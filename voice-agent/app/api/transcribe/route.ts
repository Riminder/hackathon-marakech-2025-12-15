
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 3,
});

export async function POST(request: Request) {
  try {
    // Utilise la Web API pour parser le formData
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    if (!audioFile || typeof audioFile === 'string') {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }
    // Vérifie la taille (max 25MB)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large. Maximum size is 25MB' }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }
    // Convertit le fichier en File (qui hérite de Blob et ajoute name/lastModified)
    const arrayBuffer = await audioFile.arrayBuffer();
    const file = new File(
      [arrayBuffer],
      audioFile.name || 'recording.webm',
      {
        type: audioFile.type || 'audio/webm',
        lastModified: Date.now(),
      }
    );
    // Appel à l'API OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'fr',
      response_format: 'json'
    });
    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('Transcription error:', error);
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return NextResponse.json({ error: 'Erreur de connexion avec OpenAI. Veuillez réessayer.' }, { status: 503 });
    }
    if (error.status === 401) {
      return NextResponse.json({ error: 'Clé API OpenAI invalide' }, { status: 500 });
    }
    if (error.status === 429) {
      return NextResponse.json({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message || 'Échec de la transcription' }, { status: 500 });
  }
}