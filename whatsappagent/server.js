import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import os from 'os';
import OpenAI from 'openai';
import twilio from 'twilio';
import hrflowService from './services/hrflowService.js';
import { seniorityOptions, seniorityContext, degreeOptions, degreeContext } from './services/taggingLabels.js';

const {
  PORT = 3000,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,
  OPENAI_API_KEY,
  OPENAI_MODEL = 'gpt-4',
  HRFLOW_API_KEY,
  HRFLOW_USER_EMAIL,
  HRFLOW_SOURCE_KEYS,
  HRFLOW_BOARD_KEY,
  HRFLOW_SCORING_ALGORITHM_KEY,
  HRFLOW_GRADING_ALGORITHM_KEY = 'grader-hrflow-profiles-titan',
  HRFLOW_TAGGING_ALGORITHM_KEY = 'tagger-hrflow-dynamic',
  NUMBER_OF_PROFILES_TO_SCORE = 32,
  NUMBER_OF_PROFILES_TO_GRADE = 32,
  LOCATION_DISTANCE_RADIUS = 30
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
  throw new Error('Missing Twilio env vars');
}

if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

if (!HRFLOW_API_KEY || !HRFLOW_USER_EMAIL || !HRFLOW_SOURCE_KEYS || !HRFLOW_BOARD_KEY) {
  throw new Error('Missing HrFlow env vars');
}

const SOURCE_KEYS = HRFLOW_SOURCE_KEYS.split(',').map(s => s.trim()).filter(Boolean);

const app = express();

// Twilio envoie du x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function downloadTwilioMediaToTmp(mediaUrl, contentType = '', fileType = 'audio') {
  // Twilio MediaUrl est protégé => Basic Auth avec SID + AuthToken
  let ext = '.bin';
  
  if (fileType === 'audio') {
    ext =
      contentType.includes('ogg') ? '.ogg' :
      contentType.includes('wav') ? '.wav' :
      contentType.includes('mp3') ? '.mp3' :
      contentType.includes('m4a') ? '.m4a' :
      '.bin';
  } else if (fileType === 'resume') {
    ext =
      contentType.includes('pdf') ? '.pdf' :
      contentType.includes('msword') || contentType.includes('wordprocessingml') ? '.docx' :
      contentType.includes('doc') ? '.doc' :
      contentType.includes('text') ? '.txt' :
      '.bin';
  }

  const prefix = fileType === 'resume' ? 'wa-resume' : 'wa-audio';
  const tmpFile = path.join(os.tmpdir(), `${prefix}-${Date.now()}${ext}`);

  const res = await axios.get(mediaUrl, {
    responseType: 'stream',
    auth: { username: TWILIO_ACCOUNT_SID, password: TWILIO_AUTH_TOKEN }
  });

  await new Promise((resolve, reject) => {
    const w = fs.createWriteStream(tmpFile);
    res.data.pipe(w);
    w.on('finish', resolve);
    w.on('error', reject);
  });

  return tmpFile;
}

async function transcribeAudio(filePath) {
  // OpenAI accepte ogg/wav/mp3/m4a/etc.
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1'
  });
  return transcription.text?.trim() || '';
}

async function generateJobFromResume(resumeText) {
  const PERSONA = "You are an expert Talent Acquisition Manager and HR Specialist with 20 years of experience in writing and evaluating job postings.";

  const PROMPT = `# PRIMARY INSTRUCTION
You are provided with raw text in <input_text> describing a resume. Your task is to write a job posting for which the resume in <input_text> is an ideal candidate.

---

# Job writing criteria

The job description should include the following information:

- Job title.

- Tasks.

- Skills.

- Education level.

- Seniority.

---

# INPUT DATA

<input_text>

${resumeText}

</input_text>

---`;

  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: PERSONA
        },
        {
          role: 'user',
          content: PROMPT
        }
      ]
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating job from resume:', error);
    throw error;
  }
}

function formatSingleProfile(profile, rank) {
  const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  const name = profile?.info?.full_name || profile?.info?.name || profile?.key || 'Profil';
  const title = profile?.experiences?.[0]?.title || '';
  const score = profile?.score ? (profile.score * 5).toFixed(2) : '0.00';
  
  const lines = [];
  
  // Line 1: Rank + medal icon + name + score + star icon
  lines.push(`${rank} ${medalIcon} ${name} ${score} ⭐`);
  
  // Line 2: title
  if (title) {
    lines.push(title);
  }
  
  // Line 3: briefcase icon + seniority + graduation cap icon + degree
  const seniorityLabel = profile?.seniority?.label || '';
  const degreeLabel = profile?.degree?.label || '';
  const seniorityPart = seniorityLabel ? `💼 ${seniorityLabel}` : '';
  const degreePart = degreeLabel ? `🎓 ${degreeLabel}` : '';
  const tagsLine = [seniorityPart, degreePart].filter(Boolean).join(' ');
  if (tagsLine) {
    lines.push(tagsLine);
  }
  
  // Line 4: AI summary
  if (profile?.ai_summary) {
    lines.push(profile.ai_summary);
  }
  
  // Line 5: strengths
  if (profile?.strengths && profile.strengths.length > 0) {
    const strengthsFormatted = profile.strengths.map(s => {
      if (typeof s === 'object' && s.name) {
        return `• ${s.name}`;
      }
      return typeof s === 'string' ? `• ${s}` : '• -';
    }).join('\n');
    lines.push(`💪 Strengths:\n${strengthsFormatted}`);
  } else {
    lines.push('💪 Strengths: -');
  }
  
  // Line 6: weaknesses
  if (profile?.weaknesses && profile.weaknesses.length > 0) {
    const weaknessesFormatted = profile.weaknesses.map(w => {
      if (typeof w === 'object' && w.name) {
        return `• ${w.name}`;
      }
      return typeof w === 'string' ? `• ${w}` : '• -';
    }).join('\n');
    lines.push(`⚠️ Weaknesses:\n${weaknessesFormatted}`);
  } else {
    lines.push('⚠️ Weaknesses: -');
  }
  
  // Button: open profile
  const profileUrl = profile?.attachments?.[0]?.public_url || "https://riminder-documents-eu-2019-12.s3-eu-west-1.amazonaws.com/teams/fc9d40fd60e679119130ea74ae1d34a3e22174f2/sources/95bfeca6f10b7f8c1a44e49ae4c0dbe6908715ad/profiles/db96f06b1d0ec887427b2ce01f61f730353e6ceb/parsing/original.pdf";
  lines.push(`📂 [Open Profile]\n${profileUrl}`);

  return lines.join('\n');
}

function formatProfilesMessage(inputText, profiles) {
  if (!profiles.length) {
    return `Je n'ai trouvé aucun profil pertinent.\n\nTexte compris:\n"${inputText}"`;
  }

  return `🎯 Top ${profiles.length} profils pour: "${inputText}"`;
}

async function sendWhatsApp(to, body) {
  await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_FROM,
    to,
    body
  });
}

// Webhook principal
app.post('/twilio/whatsapp', async (req, res) => {
  const from = req.body.From;     // ex: "whatsapp:+33..."
  const body = (req.body.Body || '').trim();
  const numMedia = Number(req.body.NumMedia || 0);

  // Réponse immédiate (évite timeout Twilio)
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message('✅ Reçu. Je traite ta demande et je reviens vers toi sur WhatsApp.');
  res.type('text/xml').send(twiml.toString());

  // Traitement async
  setImmediate(async () => {
    try {
      let finalText = body;

      // Si média présent, on traite selon le type
      if (numMedia > 0) {
        const mediaUrl = req.body.MediaUrl0;
        const mediaType = req.body.MediaContentType0 || '';

        if (!mediaUrl) {
          await sendWhatsApp(from, "❌ J'ai détecté un média mais je n'ai pas reçu MediaUrl0.");
          return;
        }

        // Détecter le type de média
        const isAudio = mediaType.startsWith('audio/');
        const isResume = mediaType.includes('pdf') || 
                         mediaType.includes('msword') || 
                         mediaType.includes('wordprocessingml') || 
                         mediaType.includes('doc') ||
                         mediaType.includes('text/plain');

        if (isAudio) {
          // Traitement audio: transcription
          const tmpFile = await downloadTwilioMediaToTmp(mediaUrl, mediaType, 'audio');
          try {
            finalText = await transcribeAudio(tmpFile);
          } finally {
            fs.existsSync(tmpFile) && fs.unlinkSync(tmpFile);
          }
        } else if (isResume) {
          // Traitement CV: OCR puis génération de job
          await sendWhatsApp(from, '📄 CV détecté. Extraction du texte en cours...');
          const tmpFile = await downloadTwilioMediaToTmp(mediaUrl, mediaType, 'resume');
          try {
            // 1. Extraire le texte du CV avec OCR
            const resumeText = await hrflowService.extractTextFromResume(
              tmpFile,
              HRFLOW_API_KEY,
              HRFLOW_USER_EMAIL
            );

            if (!resumeText || !resumeText.trim()) {
              await sendWhatsApp(from, "❌ Impossible d'extraire le texte du CV.");
              return;
            }

            await sendWhatsApp(from, '🤖 Génération du job à partir du CV...');
            
            // 2. Générer un job posting à partir du texte du CV
            finalText = await generateJobFromResume(resumeText);

            if (!finalText || !finalText.trim()) {
              await sendWhatsApp(from, "❌ Impossible de générer un job à partir du CV.");
              return;
            }
          } finally {
            fs.existsSync(tmpFile) && fs.unlinkSync(tmpFile);
          }
        } else {
          await sendWhatsApp(from, `❌ Type de média non supporté (${mediaType}). Je traite uniquement l'audio et les CV (PDF, DOC, DOCX, TXT).`);
          return;
        }
      }

      if (!finalText) {
        await sendWhatsApp(from, "❌ Je n'ai pas réussi à extraire du texte (audio vide ?).");
        return;
      }

      const truncatedText = finalText.length > 800 ? finalText.substring(0, 800) + '...' : finalText;
      await sendWhatsApp(from, `🔍 Je lance une recherche pour: "${truncatedText}"`);

      // Workflow complet HrFlow
      const apiSecret = HRFLOW_API_KEY;
      const apiUser = HRFLOW_USER_EMAIL;
      const boardKey = HRFLOW_BOARD_KEY;
      const scoringAlgorithmKey = HRFLOW_SCORING_ALGORITHM_KEY;
      const gradingAlgorithmKey = HRFLOW_GRADING_ALGORITHM_KEY;
      const taggingAlgorithmKey = HRFLOW_TAGGING_ALGORITHM_KEY;
      const numberOfProfilesToScore = parseInt(NUMBER_OF_PROFILES_TO_SCORE, 10);
      const numberOfProfilesToGrade = parseInt(NUMBER_OF_PROFILES_TO_GRADE, 10);
      const locationDistanceRadius = parseInt(LOCATION_DISTANCE_RADIUS, 10);

      // 1) Parse job from text
      console.log('🔄 Step 1: Parsing job from text...');
      const job = await hrflowService.parseJob(finalText, apiSecret, apiUser);
      console.log('✅ Step 1 completed: Job parsed', { jobTitle: job?.name, location: job?.location?.text });

      // 2) Enrich location
      console.log('🔄 Step 2: Enriching location...');
      const enrichedJob = await hrflowService.enrichLocation(job, apiSecret, apiUser);
      console.log('✅ Step 2 completed: Location enriched', { location: enrichedJob?.location });

      // 3) Store job in board
      console.log('🔄 Step 3: Storing job in board...');
      const { jobKey, jobJson } = await hrflowService.storeJob(enrichedJob, boardKey, apiSecret, apiUser);
      console.log('✅ Step 3 completed: Job stored', { jobKey });

      // 4) Get job info using asking
      console.log('🔄 Step 4: Getting job info using asking...');
      const { job_title, filters } = await hrflowService.getJobInfoFromAsking(
        apiSecret, apiUser, boardKey, jobKey, enrichedJob, locationDistanceRadius
      );
      console.log('✅ Step 4 completed: Job info retrieved', { job_title, filtersCount: filters?.length });

      // 5) Score profiles
      console.log('🔄 Step 5: Scoring profiles...');
      const scoredProfiles = await hrflowService.fetchScoredProfiles(
        apiSecret, apiUser, SOURCE_KEYS, boardKey, jobKey,
        scoringAlgorithmKey, filters, numberOfProfilesToScore
      );
      console.log('✅ Step 5 completed: Profiles scored', { profilesCount: scoredProfiles?.length });

      // 6) Grade top profiles for more accurate scores
      console.log('🔄 Step 6: Grading top profiles...');
      const gradedProfiles = await hrflowService.gradeProfilesBatch(
        scoredProfiles, jobKey, boardKey, apiSecret, apiUser, gradingAlgorithmKey, numberOfProfilesToGrade
      );
      console.log('✅ Step 6 completed: Profiles graded', { gradedProfilesCount: gradedProfiles?.length });

      // Filter and sort by score
      console.log('🔄 Step 7: Filtering and sorting profiles...');
      let finalProfiles = gradedProfiles
        .filter(profile => profile.score > 0.2)
        .sort((a, b) => b.score - a.score);

      finalProfiles = finalProfiles.slice(0, 3);
      console.log('✅ Step 7 completed: Profiles filtered and sorted', { finalProfilesCount: finalProfiles?.length });

      // 7) Add tags, AI summary and explainability to each profile
      console.log('🔄 Step 8: Adding AI enhancements to profiles...');
      for (const profileData of finalProfiles) {
        console.log(`  🔄 Processing profile: ${profileData?.info?.full_name || profileData?.key}`);
        
        // Get profile text for tagging (combine summary, experiences, and skills)
        const summary = profileData?.info?.summary || '';
        const experiences = (profileData?.experiences || [])
          .map(e => `${e.title || ''} ${e.description || ''}`)
          .join(' ');
        const skills = (profileData?.skills || [])
          .map(s => typeof s === 'string' ? s : s.name || s.value || '')
          .join(' ');
        const profileText = `${summary} ${experiences} ${skills}`.trim();

        // Add AI summary
        console.log('    🔄 Getting AI summary...');
        const aiSummary = await hrflowService.summaryProfile(
          profileData.key,
          profileData.source_key,
          apiSecret,
          apiUser,
          'fr'
        );
        profileData.ai_summary = aiSummary;
        console.log('    ✅ AI summary added');

        // Add explainability
        console.log('    🔄 Getting explainability...');
        const explanation = await hrflowService.explainProfile(
          profileData.key,
          profileData.source_key,
          boardKey,
          jobKey,
          apiSecret,
          apiUser,
          'fr',
          profileData.score
        );
        console.log('    ✅ Explainability ', explanation );

        profileData.strengths = (explanation.strengths || []).slice(0, 2);
        profileData.weaknesses = (explanation.weaknesses || []).slice(0, 2);
        console.log('    ✅ Explainability added', { strengthsCount: profileData.strengths.length, weaknessesCount: profileData.weaknesses.length });

        // Add seniority and degree tags
        console.log('    🔄 Adding seniority and degree tags...');
        const [seniority, degree] = await Promise.all([
          hrflowService.tagText(
            seniorityOptions,
            seniorityContext,
            [profileText],
            taggingAlgorithmKey,
            apiSecret,
            apiUser,
            'fr'
          ),
          hrflowService.tagText(
            degreeOptions,
            degreeContext,
            [profileText],
            taggingAlgorithmKey,
            apiSecret,
            apiUser,
            'fr'
          )
        ]);

        profileData.seniority = seniority;
        profileData.degree = degree;
        console.log('    ✅ Tags added', { seniority: seniority?.label, degree: degree?.label });
      }
      console.log('✅ Step 8 completed: All profiles enhanced');

      // 8) Format and send response
      console.log('🔄 Step 9: Formatting and sending response...');
      const truncatedMsg = finalText.length > 400 ? finalText.substring(0, 400) + '...' : finalText;
      
      // Send first message with search query
      const searchMsg = formatProfilesMessage(truncatedMsg, finalProfiles);
      await sendWhatsApp(from, searchMsg);
      
      // Send a separate message for each profile
      for (let i = 0; i < finalProfiles.length; i++) {
        const profileMsg = formatSingleProfile(finalProfiles[i], i + 1);
        await sendWhatsApp(from, profileMsg);
      }
      
      console.log('✅ Step 9 completed: Response sent');

    } catch (e) {
      console.error('❌ Error in WhatsApp workflow:', e);
      await sendWhatsApp(from, `❌ Erreur: ${e?.message || String(e)}`);
    }
  });
});

app.get('/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`WhatsApp HR Agent listening on http://localhost:${PORT}`);
});
