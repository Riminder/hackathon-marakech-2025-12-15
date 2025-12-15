'use client';

import { useState } from 'react';
import UploadCV from '@/components/UploadCV';
import VoiceRecorder from '@/components/VoiceRecorder';
import JobCard from '@/components/JobCard';
import { Job, InputMethod } from '@/types';

export default function Home() {
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');

  const processCV = async (file?: File, text?: string) => {
    setIsProcessing(true);
    setError('');
    setJobs([]);

    try {
      // Step 1: Parse CV
      setCurrentStep('Analyse du CV en cours...');
      const parseFormData = new FormData();
      if (file) {
        parseFormData.append('file', file);
      } else if (text) {
        parseFormData.append('text', text);
      }

      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        body: parseFormData,
      });

      if (!parseResponse.ok) {
        throw new Error('Erreur lors de l\'analyse du CV');
      }

      const parseData = await parseResponse.json();
      console.log('Parse result:', parseData);

      // Step 2: Index profile
      setCurrentStep('Indexation du profil...');
      const indexResponse = await fetch('/api/index-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: parseData.data }),
      });

      if (!indexResponse.ok) {
        throw new Error('Erreur lors de l\'indexation du profil');
      }

      const indexData = await indexResponse.json();
      const profileId = indexData.data?.id || indexData.data?.profile_id;
      console.log('Index result:', indexData);

      // Step 3: Score jobs
      setCurrentStep('Recherche des offres correspondantes...');
      const scoreResponse = await fetch('/api/score-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
      });

      if (!scoreResponse.ok) {
        throw new Error('Erreur lors du calcul des correspondances');
      }

      const scoreData = await scoreResponse.json();
      console.log('Score result:', scoreData);

      // Transform jobs data
      const jobsList: Job[] = (scoreData.data?.jobs || []).map((job: any) => ({
        id: job.id || job.key,
        name: job.name || job.title,
        location: job.location?.text || job.location || 'Non spécifié',
        picture: job.picture || job.image,
        score: job.score || 0,
        description: job.summary || job.description,
      }));

      setJobs(jobsList);
      setCurrentStep('');
    } catch (err: any) {
      console.error('Processing error:', err);
      setError(err.message || 'Une erreur est survenue');
      setCurrentStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    processCV(file);
  };


  const handleTranscript = (text: string) => {
    processCV(undefined, text);
  };

  const resetForm = () => {
    setInputMethod(null);
    setJobs([]);
    setError('');
    setCurrentStep('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CV Job Matcher
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez les offres d'emploi qui correspondent à votre profil
          </p>
        </div>

        {!inputMethod && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div onClick={() => setInputMethod('file')}>
              <UploadCV onFileSelect={handleFileSelect} disabled={isProcessing} />
            </div>

            <div onClick={() => setInputMethod('voice')}>
              <VoiceRecorder onTranscript={handleTranscript} disabled={isProcessing} />
            </div>
          </div>
        )}

        {inputMethod && !isProcessing && jobs.length === 0 && !error && (
          <div className="max-w-2xl mx-auto">
            {inputMethod === 'file' && (
              <UploadCV onFileSelect={handleFileSelect} disabled={isProcessing} />
            )}
            {inputMethod === 'voice' && (
              <VoiceRecorder onTranscript={handleTranscript} disabled={isProcessing} />
            )}
            <button
              onClick={resetForm}
              className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Choisir une autre méthode
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl text-gray-700">{currentStep}</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={resetForm}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {jobs.length > 0 && (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Offres correspondantes ({jobs.length})
              </h2>
              <button
                onClick={resetForm}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Analyser un nouveau CV
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}