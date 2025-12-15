// src/app/api/candidates/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("🔵 API CANDIDATES: Démarrage (Enrichissement + Grading)...");

  try {
    // ✅ RÉCUPÉRATION SÉCURISÉE DEPUIS LE .ENV
    const API_KEY = process.env.HRFLOW_API_KEY || "";
    const USER_EMAIL = process.env.HRFLOW_USER_EMAIL || "";
    const SOURCE_KEY = process.env.HRFLOW_SOURCE_KEY || "";
    const ALGORITHM_KEY = process.env.HRFLOW_ALGORITHM_KEY || "";
    const BOARD_KEY = process.env.HRFLOW_BOARD_KEY || "";
    const JOB_KEY = process.env.HRFLOW_JOB_KEY || "";

    console.log("🔍 DEBUG ENV:", {
        API_KEY_EXISTS: !!API_KEY,
        USER_EMAIL_EXISTS: !!USER_EMAIL,
        SOURCE_KEY_EXISTS: !!SOURCE_KEY,
        JOB_KEY_EXISTS: !!JOB_KEY
    });



    // Sécurité CTO : On vérifie que les clés existent bien
    if (!API_KEY || !SOURCE_KEY || !ALGORITHM_KEY || !BOARD_KEY || !JOB_KEY) {
        console.error("❌ Configuration .env incomplète");
        throw new Error("Configuration .env manquante pour HrFlow");
    }

    const headers = {
        "X-API-KEY": API_KEY, // Plus de guillemets, c'est la variable
        "X-USER-EMAIL": USER_EMAIL,
        "Accept": "application/json"
    };


    // 1. Récupérer la liste des IDs
    const listUrl = `https://api.hrflow.ai/v1/storing/profiles?source_keys=["${SOURCE_KEY}"]&limit=10&order_by=desc&sort_by=created_at&return_profile=false`;
    const listResponse = await fetch(listUrl, { method: "GET", headers });
    
    if (!listResponse.ok) throw new Error(`Erreur List Profiles: ${listResponse.status}`);

    const listJson = await listResponse.json();
    const profilesList = listJson.data || [];
    
    console.log(`🔵 ${profilesList.length} profils trouvés. Lancement des appels parallèles...`);

    // 2. Boucle sur chaque profil
    const detailedProfiles = await Promise.all(
        profilesList.map(async (p: any) => {
            try {
                // --- Construction des URLs ---
                const detailUrl = `https://api.hrflow.ai/v1/profile/indexing?source_key=${SOURCE_KEY}&key=${p.key}`;
                
                // URL complexe pour le grading (on encode bien les crochets)
                const gradingParams = new URLSearchParams();
                gradingParams.append("algorithm_key", ALGORITHM_KEY);
                gradingParams.append("board_key", BOARD_KEY);
                gradingParams.append("job_key", JOB_KEY);
                gradingParams.append("profile_ids[0][profile_key]", p.key);
                gradingParams.append("profile_ids[0][source_key]", SOURCE_KEY);
                const gradingUrl = `https://api.hrflow.ai/v1/profile/grading?${gradingParams.toString()}`;

                // --- APPELS PARALLÈLES (Gain de temps énorme) ---
                const [detailRes, gradingRes] = await Promise.all([
                    fetch(detailUrl, { method: "GET", headers, cache: 'no-store' }),
                    fetch(gradingUrl, { method: "GET", headers, cache: 'no-store' })
                ]);

                // --- Traitement du PROFIL ---
                let profileData: any = {};
                if (detailRes.ok) {
                    const json = await detailRes.json();
                    profileData = json.data || {};
                }

                // --- Traitement du SCORE (Grading) ---
                let finalScore = 50; // Valeur par défaut si échec
                if (gradingRes.ok) {
                    const gradingJson = await gradingRes.json();
                    // Structure: data.scores[0] = [valeur1, valeur2]
                    if (gradingJson.data && gradingJson.data.scores && gradingJson.data.scores.length > 0) {
                        const scoresArray = gradingJson.data.scores[0];
                        // Instruction : Prendre la 2ème valeur (index 1)
                        const rawScore = scoresArray[1]; 
                        // Conversion en pourcentage entier (0.92 -> 92)
                        finalScore = Math.floor(rawScore * 100);
                    }
                }

                // --- Mapping Final ---
                const firstName = profileData.info?.first_name || "";
                const lastName = profileData.info?.last_name || "";
                const fullName = profileData.info?.full_name || `${firstName} ${lastName}`.trim() || "Candidat Inconnu";
                
                const role = profileData.experiences && profileData.experiences.length > 0 
                    ? profileData.experiences[0].title 
                    : "Candidat Open to Work";

                const realSkills = profileData.skills 
                    ? profileData.skills.slice(0, 3).map((s: any) => s.name)
                    : ["Soft Skills"];

                const expYears = Math.floor(profileData.experiences_duration || 0);
                const expLabel = expYears > 5 ? `Senior (${expYears} ans)` : `Junior (${expYears} ans)`;

                return {
                    id: p.key, // On garde la key pour le reject plus tard
                    name: fullName,
                    role: role,
                    location: profileData.info?.location?.text || "Remote",
                    score: finalScore, // ✅ LE VRAI SCORE ISSU DE L'IA
                    experience: expLabel,
                    strengths: realSkills,
                    weaknesses: ["Potentiel à confirmer"],
                    avatar: profileData.info?.picture || `https://i.pravatar.cc/150?u=${p.key}`,
                };

            } catch (err) {
                console.error(`Erreur pour le candidat ${p.key}`, err);
                return null;
            }
        })
    );

    const validCandidates = detailedProfiles.filter(p => p !== null);
    
    console.log(`🟢 ${validCandidates.length} candidats prêts avec scores IA.`);
    return NextResponse.json(validCandidates);

  } catch (error) {
    console.error("💥 CRASH API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}