import { useState, useEffect } from 'react';
import { Ghost, Sparkles, Loader2, MessageCircle, ArrowRight } from 'lucide-react';
import { ProfileSelector } from './components/ProfileSelector';
import { JobSelector } from './components/JobSelector';
import { ScoreDisplay } from './components/ScoreDisplay';
import { SkillGapChart } from './components/SkillGapChart';
import { EmailPreview } from './components/EmailPreview';
import { Recommendations } from './components/Recommendations';
import { Chat } from './components/Chat';
import { fetchJobs, fetchProfiles, analyzeCandidate } from './lib/api';
import type { Job, Profile, AnalysisResult } from './lib/types';

type Step = 'select' | 'analyzing' | 'results';

function App() {
  const [step, setStep] = useState<Step>('select');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch((err) => {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs');
      })
      .finally(() => setJobsLoading(false));

    fetchProfiles()
      .then(setProfiles)
      .catch((err) => {
        console.error('Failed to fetch profiles:', err);
        setError('Failed to load profiles');
      })
      .finally(() => setProfilesLoading(false));
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProfile || !selectedJob) return;

    setStep('analyzing');
    setError(null);

    try {
      const analysisResult = await analyzeCandidate(selectedProfile.key, selectedJob.key);
      setResult(analysisResult);
      setStep('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze. Please try again.');
      setStep('select');
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedProfile(null);
    setSelectedJob(null);
    setResult(null);
    setError(null);
    setShowChat(false);
  };

  const canAnalyze = selectedProfile && selectedJob;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Ghost className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GhostBusters AI</h1>
                <p className="text-xs text-gray-500">No more ghosting candidates</p>
              </div>
            </div>
            {step === 'results' && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Start New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Selection Step */}
        {step === 'select' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Personalized Candidate Feedback
              </h2>
              <p className="text-gray-600 text-lg">
                Select a candidate profile and job position to generate constructive,
                personalized feedback.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  1. Select Candidate
                </h3>
                <ProfileSelector
                  profiles={profiles}
                  selectedProfile={selectedProfile}
                  onSelect={setSelectedProfile}
                  loading={profilesLoading}
                />
              </div>

              {/* Job Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  2. Select Job Position
                </h3>
                <JobSelector
                  jobs={jobs}
                  selectedJob={selectedJob}
                  onSelect={setSelectedJob}
                  loading={jobsLoading}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all
                  ${canAnalyze
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Sparkles className="w-5 h-5" />
                Analyze & Generate Feedback
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing...</h2>
            <p className="text-gray-500 text-center max-w-md">
              Scoring profile against job requirements and generating personalized feedback.
            </p>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && result && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Results for {result.candidate.name}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Applied for: {result.chatContext.jobTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowChat(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Open Feedback Chat
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ScoreDisplay
                score={result.score}
                threshold={result.threshold}
                matched={result.matched}
              />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <SkillGapChart
                  skillGaps={result.skillGaps}
                  strengths={result.strengths}
                />
              </div>
            </div>

            <Recommendations recommendations={result.recommendations} />

            <EmailPreview
              email={result.email}
              candidateName={result.candidate.name}
              language={result.detectedLanguage}
            />
          </div>
        )}
      </main>

      {showChat && result && (
        <Chat
          context={result.chatContext}
          onClose={() => setShowChat(false)}
        />
      )}

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            Powered by HrFlow.ai, Claude AI, and Vercel AI SDK
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
