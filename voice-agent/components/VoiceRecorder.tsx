'use client';

import { useState, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      setError('');
      
      // Vérifier si le navigateur supporte getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Votre navigateur ne supporte pas l\'enregistrement audio');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;

      // Vérifier les types MIME supportés
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        await transcribeAudio();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = (e) => {
        console.error('MediaRecorder error:', e);
        setError('Erreur d\'enregistrement');
        setIsRecording(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      // Timer pour afficher la durée
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error: any) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        setError('Accès au microphone refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
      } else if (error.name === 'NotFoundError') {
        setError('Aucun microphone détecté.');
      } else {
        setError(error.message || 'Erreur lors du démarrage de l\'enregistrement');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const transcribeAudio = async () => {
    if (chunksRef.current.length === 0) {
      setError('Aucun audio enregistré');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Créer le blob audio avec le bon type MIME
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(chunksRef.current, { type: mimeType });

      // Vérifier la taille (max 25MB)
      if (audioBlob.size > 25 * 1024 * 1024) {
        throw new Error('Enregistrement trop long. Maximum 25MB.');
      }

      console.log('Sending audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type,
      });

      const formData = new FormData();
      
      // Déterminer l'extension du fichier
      const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
      formData.append('audio', audioBlob, `recording.${extension}`);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }

      if (!data.text || data.text.trim() === '') {
        throw new Error('Aucun texte détecté dans l\'enregistrement');
      }

      console.log('Transcription successful:', data.text);
      onTranscript(data.text);

    } catch (error: any) {
      console.error('Transcription error:', error);
      
      if (error.message.includes('connexion') || error.message.includes('ECONNRESET')) {
        setError('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
      } else {
        setError(error.message || 'Erreur lors de la transcription');
      }
    } finally {
      setIsProcessing(false);
      chunksRef.current = [];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {isRecording 
            ? `Enregistrement... ${formatTime(recordingTime)}` 
            : isProcessing 
            ? 'Transcription en cours...'
            : 'Enregistrer votre CV'}
        </h3>
      </div>

      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 text-center">{error}</p>
        </div>
      )}

      {!isRecording ? (
        <button
          onClick={startRecording}
          disabled={disabled || isProcessing}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Transcription...
            </span>
          ) : (
            'Commencer l\'enregistrement'
          )}
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse font-medium"
        >
          Arrêter l'enregistrement
        </button>
      )}

      {isRecording && (
        <div className="w-full">
          <div className="flex justify-center items-center gap-1 h-16">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-green-500 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(10, Math.min(100, Math.random() * 60 + 20))}%`,
                  animation: 'pulse 0.5s ease-in-out infinite',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        {isRecording 
          ? 'Parlez clairement dans votre microphone'
          : 'Cliquez pour enregistrer votre présentation vocale'}
      </p>
    </div>
  );
}