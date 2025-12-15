'use client';

import { useState } from 'react';
import UploadCV from '@/components/UploadCV';
import VoiceRecorder from '@/components/VoiceRecorder';
import JobCard from '@/components/JobCard';
import { Job, InputMethod } from '@/types';

// Jobs hardcodés pour la démo
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    name: 'Développeur Full Stack Senior',
    location: 'Paris, France',
    picture: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    score: 95,
    description: 'Rejoignez notre équipe tech pour développer des applications innovantes avec React et Node.js',
  },
  {
    id: '2',
    name: 'Data Scientist Lead',
    location: 'Lyon, France',
    picture: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    score: 92,
    description: 'Pilotez des projets IA et machine learning au sein d\'une équipe passionnée',
  },
  {
    id: '3',
    name: 'Product Manager',
    location: 'Marseille, France',
    picture: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    score: 88,
    description: 'Définissez la vision produit et coordonnez les équipes pour des projets ambitieux',
  },
  {
    id: '4',
    name: 'Designer UX/UI Senior',
    location: 'Bordeaux, France',
    picture: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop',
    score: 90,
    description: 'Créez des expériences utilisateur exceptionnelles pour nos produits digitaux',
  },
  {
    id: '5',
    name: 'DevOps Engineer',
    location: 'Toulouse, France',
    picture: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    score: 86,
    description: 'Optimisez notre infrastructure cloud et automatisez nos processus de déploiement',
  },
  {
    id: '6',
    name: 'Frontend Architect',
    location: 'Nantes, France',
    picture: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    score: 89,
    description: 'Architecturez nos applications web modernes avec les dernières technologies',
  },
  {
    id: '7',
    name: 'Backend Developer',
    location: 'Lille, France',
    picture: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    score: 84,
    description: 'Développez des APIs robustes et scalables pour nos services',
  },
  {
    id: '8',
    name: 'Tech Lead',
    location: 'Strasbourg, France',
    picture: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    score: 91,
    description: 'Guidez une équipe de développeurs talentueux vers l\'excellence technique',
  },
  {
    id: '9',
    name: 'Mobile Developer',
    location: 'Nice, France',
    picture: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    score: 87,
    description: 'Créez des applications mobiles natives iOS et Android performantes',
  },
  {
    id: '10',
    name: 'Ingénieur Cloud',
    location: 'Rennes, France',
    picture: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
    score: 85,
    description: 'Concevez et déployez des solutions cloud sécurisées et performantes',
  },
];

export default function Home() {
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepIndex, setStepIndex] = useState(0);

  const processingSteps = [
    { text: '🔍 Analyse du CV...', color: 'from-[#DBE7F3] to-[#B6CCE2]' },
    { text: '🧠 Extraction des compétences...', color: 'from-[#B6CCE2] to-[#A3BFD7]' },
    { text: '⚡ Matching en cours...', color: 'from-[#A3BFD7] to-[#8CAEC9]' },
    { text: '✨ Calcul des scores...', color: 'from-[#8CAEC9] to-[#DBE7F3]' }
  ];

  const processCV = async (file?: File, text?: string) => {
    setIsProcessing(true);
    setError('');
    setJobs([]);
    setStepIndex(0);

    // Simule les étapes de chargement
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(processingSteps[i].text);
      setStepIndex(i);
      // Attendre 1 seconde à chaque étape
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Affiche les jobs mockés après le "chargement"
    const shuffledJobs = [...MOCK_JOBS]
      .map(job => ({
        ...job,
        score: Math.max(75, Math.min(100, job.score + Math.floor(Math.random() * 10) - 5))
      }))
      .sort((a, b) => b.score - a.score);
    setJobs(shuffledJobs);
    setCurrentStep('');
    setIsProcessing(false);
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
    setStepIndex(0);
  };

  return (
    <main className="min-h-screen bg-gradient-radial from-[#DBE7F3] via-[#1e3a5f] to-[#0f1f3a] text-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#DBE7F3] rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#0f1f3a] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e3a5f] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        {!inputMethod && !isProcessing && jobs.length === 0 && (
          <div className="text-center mb-12 sm:mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#DBE7F3]/40 to-[#B6CCE2]/40 border border-[#A3BFD7]/30 mb-6 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-300 text-sm font-medium">Powered by AI</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block text-white drop-shadow-lg">
                Trouvez Votre
              </span>
              <span className="block bg-gradient-to-r from-[#DBE7F3] via-[#c8daea] to-[#DBE7F3] bg-clip-text text-transparent drop-shadow-lg">
                Job Parfait
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Notre intelligence artificielle analyse votre CV et vous connecte instantanément
              aux opportunités qui correspondent parfaitement à votre profil
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white mb-16">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Résultats en 30s</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-medium">Matching Précis</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Methods Selection */}
        {!inputMethod && !isProcessing && jobs.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16">
            {/* Upload File Card */}
            <div
              onClick={() => setInputMethod('file')}
              className="group relative cursor-pointer"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#DBE7F3] to-[#B6CCE2] rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-[#DBE7F3]/50 hover:border-[#B6CCE2]/70 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DBE7F3] to-[#B6CCE2] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-md">
                  <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">
                  Upload CV
                </h3>
                <p className="text-slate-600 mb-4">
                  Glissez votre CV au format PDF ou image
                </p>
                <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                  <span>Commencer</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Voice Recording Card */}
            <div
              onClick={() => setInputMethod('voice')}
              className="group relative cursor-pointer"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A3BFD7] to-[#8CAEC9] rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-[#A3BFD7]/50 hover:border-[#8CAEC9]/70 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A3BFD7] to-[#8CAEC9] flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-md">
                  <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-800">
                  Enregistrement Vocal
                </h3>
                <p className="text-slate-600 mb-4">
                  Présentez-vous directement à l'oral
                </p>
                <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                  <span>Commencer</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Input Method */}
        {inputMethod && !isProcessing && jobs.length === 0 && !error && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-[#DBE7F3]/50 shadow-2xl">
              {inputMethod === 'file' && (
                <UploadCV onFileSelect={handleFileSelect} disabled={isProcessing} />
              )}
              {inputMethod === 'voice' && (
                <VoiceRecorder onTranscript={handleTranscript} disabled={isProcessing} />
              )}
              <button
                onClick={resetForm}
                className="mt-6 w-full px-4 py-3 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100/50 font-medium"
              >
                ← Choisir une autre méthode
              </button>
            </div>
          </div>
        )}

        {/* Processing Animation */}
        {isProcessing && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-12 border border-[#DBE7F3]/50 shadow-2xl">
              <div className="space-y-8">
                {processingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 transition-all duration-500 ${index === stepIndex ? 'scale-110' : index < stepIndex ? 'opacity-50' : 'opacity-30'
                      }`}
                  >
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${index === stepIndex
                      ? `bg-gradient-to-r ${step.color} animate-pulse shadow-lg`
                      : index < stepIndex
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                      }`}>
                      {index < stepIndex ? (
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-2xl">{step.text.split(' ')[0]}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-lg font-semibold ${index === stepIndex ? 'text-slate-800' : 'text-slate-500'
                        }`}>
                        {step.text}
                      </p>
                      {index === stepIndex && (
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${step.color} animate-progress rounded-full`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="backdrop-blur-xl bg-red-50/90 border border-red-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Une erreur est survenue</h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-medium transition-all border border-red-200"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {jobs.length > 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-6 backdrop-blur-sm shadow-sm">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-bold text-lg">{jobs.length} Offres Trouvées</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-800">
                Vos Opportunités
              </h2>
              <p className="text-slate-600 text-lg mb-6">
                Triées par compatibilité avec votre profil
              </p>

              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DBE7F3] to-[#A3BFD7] hover:from-[#B6CCE2] hover:to-[#8CAEC9] text-slate-800 font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Analyser un nouveau CV
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}