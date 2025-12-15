import OpenAI from 'openai';
import { HRFlowJob, HRFlowProfile } from '@/types';

class EvaluationAI {
  public openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder-openai-key',
    });
  }

  // Evaluate candidate based on CV, transcript, and job requirements
  async evaluateCandidate(params: {
    profile: HRFlowProfile;
    job: HRFlowJob;
    transcript: string;
  }): Promise<{
    summary: string;
    green_flags: string[];
    yellow_flags: string[];
    red_flags: string[];
    match_percentage: number;
    match_explanation: string;
    upskilling_recommendations?: Record<string, any>;
  }> {
    const prompt = this.buildEvaluationPrompt(params);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert RH spécialisé dans l\'évaluation de candidats. Tu dois fournir une évaluation objective, constructive et non discriminatoire.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return this.parseEvaluationResponse(content);
  }

  private buildEvaluationPrompt(params: {
    profile: HRFlowProfile;
    job: HRFlowJob;
    transcript: string;
  }): string {
    return `
Tu es un expert RH. Évalue ce candidat pour le poste en analysant son CV et l'entretien.

**POSTE À POURVOIR:**
Titre: ${params.job.name}
Description: ${params.job.description || params.job.summary || 'Non spécifiée'}
Compétences requises: ${params.job.skills?.join(', ') || 'Non spécifiées'}

**PROFIL CANDIDAT:**
Nom: ${params.profile.name}
Email: ${params.profile.email}
Résumé: ${params.profile.summary || 'Non spécifié'}
Compétences: ${params.profile.skills?.join(', ') || 'Non spécifiées'}
Expériences: ${params.profile.experiences?.length || 0} poste(s) précédent(s)

**TRANSCRIPT DE L'ENTRETIEN:**
${params.transcript}

**CONSIGNES D'ÉVALUATION:**
1. Fournis un résumé de l'entretien (3-5 phrases)
2. Liste les GREEN FLAGS (points forts, max 5)
3. Liste les YELLOW FLAGS (points à clarifier/améliorer, max 3)
4. Liste les RED FLAGS (alertes sérieuses, max 3)
5. Calcule un pourcentage de match (0-100) avec explication
6. Suggère des recommandations d'upskilling si pertinent

**FORMAT DE RÉPONSE (JSON):**
{
  "summary": "Résumé de l'entretien...",
  "green_flags": ["Point fort 1", "Point fort 2", ...],
  "yellow_flags": ["Point à clarifier 1", ...],
  "red_flags": ["Alerte 1", ...],
  "match_percentage": 75,
  "match_explanation": "Explication du score...",
  "upskilling_recommendations": {
    "technical": ["Compétence 1", "Compétence 2"],
    "soft_skills": ["Soft skill 1"],
    "certifications": ["Certification 1"]
  }
}

**IMPORTANT:** 
- Sois objectif et constructif
- Évite tout biais discriminatoire
- Base-toi sur les compétences et l'expérience
- Les red flags doivent être des problèmes sérieux uniquement
`;
  }

  private parseEvaluationResponse(content: string): {
    summary: string;
    green_flags: string[];
    yellow_flags: string[];
    red_flags: string[];
    match_percentage: number;
    match_explanation: string;
    upskilling_recommendations?: Record<string, any>;
  } {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || 'Évaluation non disponible',
          green_flags: parsed.green_flags || [],
          yellow_flags: parsed.yellow_flags || [],
          red_flags: parsed.red_flags || [],
          match_percentage: parsed.match_percentage || 50,
          match_explanation: parsed.match_explanation || 'Score basé sur l\'analyse générale',
          upskilling_recommendations: parsed.upskilling_recommendations
        };
      }
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
    }

    // Fallback parsing if JSON parsing fails
    return this.fallbackParseEvaluation(content);
  }

  private fallbackParseEvaluation(content: string): {
    summary: string;
    green_flags: string[];
    yellow_flags: string[];
    red_flags: string[];
    match_percentage: number;
    match_explanation: string;
  } {
    return {
      summary: 'Évaluation basée sur l\'entretien et le profil du candidat',
      green_flags: this.extractFlags(content, 'green'),
      yellow_flags: this.extractFlags(content, 'yellow'),
      red_flags: this.extractFlags(content, 'red'),
      match_percentage: this.extractPercentage(content),
      match_explanation: 'Score basé sur l\'analyse des compétences et de l\'entretien'
    };
  }

  private extractFlags(content: string, type: 'green' | 'yellow' | 'red'): string[] {
    const patterns = {
      green: /green.flags?[:\-\s]*([\s\S]*?)(?=yellow|red|match|$)/gi,
      yellow: /yellow.flags?[:\-\s]*([\s\S]*?)(?=red|match|$)/gi,
      red: /red.flags?[:\-\s]*([\s\S]*?)(?=match|$)/gi
    };

    const match = content.match(patterns[type]);
    if (match) {
      return match[1]
        .split(/[\n\-\*•]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, type === 'green' ? 5 : 3);
    }

    return [];
  }

  private extractPercentage(content: string): number {
    const percentageMatch = content.match(/(\d+)%/);
    if (percentageMatch) {
      return parseInt(percentageMatch[1]);
    }
    return 50; // Default
  }

  // Generate rematch explanation for alternative jobs
  async generateRematchExplanation(params: {
    profile: HRFlowProfile;
    originalJob: HRFlowJob;
    targetJob: HRFlowJob;
    score: number;
  }): Promise<string> {
    const prompt = `
Explique pourquoi ce candidat pourrait être intéressant pour ce nouveau poste, sachant qu'il a été refusé pour le poste original.

**CANDIDAT:**
${params.profile.name} - ${params.profile.summary}
Compétences: ${params.profile.skills?.join(', ')}

**POSTE ORIGINAL (refusé):**
${params.originalJob.name}

**NOUVEAU POSTE SUGGÉRÉ:**
${params.targetJob.name}
Score de compatibilité: ${Math.round(params.score * 100)}%

Fournis une explication courte (2-3 phrases) sur pourquoi ce nouveau poste pourrait mieux convenir.
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || 
           `Ce poste semble mieux aligné avec le profil du candidat (${Math.round(params.score * 100)}% de compatibilité).`;
  }
}

export const evaluationAI = new EvaluationAI();