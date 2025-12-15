

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🔵 1. API Route: Démarrage...");
  
  try {
    const body = await request.json();

    // ✅ RÉCUPÉRATION SÉCURISÉE
    const API_KEY = process.env.HRFLOW_API_KEY;
    const USER_EMAIL = process.env.HRFLOW_USER_EMAIL;

    // L'URL du Workflow est souvent unique et peut rester en dur ou aller dans le .env aussi
    const WORKFLOW_URL = "https://api-workflows.hrflow.ai/teams/fc9d40fd60e679119130ea74ae1d34a3e22174f2/dev-demo/python3.9/dd3a9abe34b0a3dc2c86b296a950d9ccb468c34d";

    if (!API_KEY || !USER_EMAIL) {
        return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 });
    }

    const response = await fetch(WORKFLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        "X-USER-EMAIL": USER_EMAIL,
      },
      body: JSON.stringify(body),
    });


    console.log("📡 4. Réponse HrFlow - Status:", response.status);

    // IMPORTANT : On lit en TEXTE d'abord pour voir l'erreur même si ce n'est pas du JSON
    const responseText = await response.text();
    console.log("🛑 5. Réponse HrFlow - Body (Raw):", responseText);

    if (!response.ok) {
        // On renvoie l'erreur exacte au front pour que tu la voies aussi
        return NextResponse.json({ 
            error: "Erreur HrFlow", 
            details: responseText,
            status: response.status 
        }, { status: response.status });
    }

    // Si tout va bien, on parse le JSON
    const data = JSON.parse(responseText);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("💥 CRASH SERVEUR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}