"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mic, MicOff, Play, Square, Clock, User, Bot, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Candidate, Interview, TranscriptSegment } from '@/types';

// Mock data for demonstration
const mockCandidate: Candidate = {
  id: '1',
  job_id: 'job-1',
  hrflow_profile_reference: 'profile-1',
  email: 'marie.dupont@email.com',
  name: 'Marie Dupont',
  phone: '+33 6 12 34 56 78',
  score: 92,
  why_match: [
    'Expertise React/Node.js confirmée (5+ ans)',
    'Expérience TypeScript et architecture microservices',
    'Leadership technique et mentorat équipe'
  ],
  status: 'interview_done',
  created_at: '2024-01-15T10:00:00Z'
};

const mockInterview: Interview = {
  id: 'interview-1',
  candidate_id: '1',
  job_id: 'job-1',
  scheduled_at: '2024-01-16T14:00:00Z',
  meeting_url: 'https://meet.google.com/abc-defg-hij',
  recall_bot_id: 'bot-123',
  status: 'completed',
  started_at: '2024-01-16T14:02:00Z',
  ended_at: '2024-01-16T14:32:00Z',
  duration_minutes: 30,
  created_at: '2024-01-16T13:00:00Z'
};

const mockTranscript: TranscriptSegment[] = [
  {
    id: '1',
    interview_id: 'interview-1',
    speaker: 'Recruteur',
    text: 'Bonjour Marie, merci de prendre le temps pour cet entretien. Pouvez-vous vous présenter brièvement ?',
    start_ms: 0,
    end_ms: 5000,
    confidence: 0.95,
    created_at: '2024-01-16T14:02:00Z'
  },
  {
    id: '2',
    interview_id: 'interview-1',
    speaker: 'Marie Dupont',
    text: 'Bonjour ! Je suis développeuse full-stack avec 6 ans d\'expérience. J\'ai travaillé principalement avec React et Node.js, et j\'ai récemment mené une équipe de 4 développeurs sur un projet de refonte d\'architecture microservices.',
    start_ms: 5000,
    end_ms: 18000,
    confidence: 0.92,
    created_at: '2024-01-16T14:02:05Z'
  },
  {
    id: '3',
    interview_id: 'interview-1',
    speaker: 'Recruteur',
    text: 'Très intéressant. Pouvez-vous me parler d\'un défi technique complexe que vous avez résolu récemment ?',
    start_ms: 18000,
    end_ms: 25000,
    confidence: 0.94,
    created_at: '2024-01-16T14:02:18Z'
  },
  {
    id: '4',
    interview_id: 'interview-1',
    speaker: 'Marie Dupont',
    text: 'Nous avions des problèmes de performance sur notre API avec des temps de réponse de plus de 2 secondes. J\'ai analysé les goulots d\'étranglement, implémenté un système de cache Redis et optimisé nos requêtes SQL. Résultat : temps de réponse divisé par 10, passant à 200ms en moyenne.',
    start_ms: 25000,
    end_ms: 45000,
    confidence: 0.89,
    created_at: '2024-01-16T14:02:25Z'
  }
];

interface AIInsight {
  type: 'strength' | 'concern' | 'question';
  category: 'technical' | 'soft_skills' | 'experience' | 'culture_fit';
  text: string;
  confidence: number;
  timestamp: string;
}

const mockAIInsights: AIInsight[] = [
  {
    type: 'strength',
    category: 'technical',
    text: 'Excellente maîtrise des technologies React/Node.js avec expérience concrète',
    confidence: 0.95,
    timestamp: '14:02:18'
  },
  {
    type: 'strength',
    category: 'experience',
    text: 'Leadership technique confirmé - a mené une équipe de 4 développeurs',
    confidence: 0.92,
    timestamp: '14:02:18'
  },
  {
    type: 'strength',
    category: 'technical',
    text: 'Approche méthodique pour résoudre les problèmes de performance (analyse → solution → résultats)',
    confidence: 0.88,
    timestamp: '14:02:45'
  },
  {
    type: 'question',
    category: 'experience',
    text: 'Creuser l\'expérience en architecture microservices - détails d\'implémentation ?',
    confidence: 0.75,
    timestamp: '14:02:18'
  }
];

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [candidate] = useState<Candidate>(mockCandidate);
  const [interview] = useState<Interview>(mockInterview);
  const [transcript] = useState<TranscriptSegment[]>(mockTranscript);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>(mockAIInsights);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [manualNotes, setManualNotes] = useState('');
  const [refinedScore, setRefinedScore] = useState<number | null>(null);

  useEffect(() => {
    // Simulate real-time AI analysis
    const interval = setInterval(() => {
      if (isRecording) {
        setCurrentTime(prev => prev + 1);
        
        // Simulate new AI insights every 30 seconds
        if (currentTime % 30 === 0 && currentTime > 0) {
          const newInsight: AIInsight = {
            type: Math.random() > 0.7 ? 'concern' : 'strength',
            category: ['technical', 'soft_skills', 'experience', 'culture_fit'][Math.floor(Math.random() * 4)] as any,
            text: 'Nouvelle observation basée sur l\'analyse en temps réel...',
            confidence: 0.7 + Math.random() * 0.3,
            timestamp: formatTime(currentTime)
          };
          setAIInsights(prev => [...prev, newInsight]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, currentTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate score refinement after interview
    setTimeout(() => {
      const adjustment = Math.random() > 0.5 ? 
        Math.floor(Math.random() * 8) + 2 : // +2 to +10
        -Math.floor(Math.random() * 5) - 1; // -1 to -5
      
      setRefinedScore(Math.max(0, Math.min(100, candidate.score + adjustment)));
    }, 2000);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'concern': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'question': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'strength': return 'bg-green-50 border-green-200 text-green-800';
      case 'concern': return 'bg-red-50 border-red-200 text-red-800';
      case 'question': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Entretien en cours</h1>
                <p className="text-sm text-slate-600">{candidate.name} • {formatTime(currentTime)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {refinedScore !== null && (
                <Badge className="bg-blue-100 text-blue-800">
                  Score raffiné: {refinedScore}%
                  {refinedScore > candidate.score ? 
                    <TrendingUp className="h-3 w-3 ml-1 text-green-600" /> : 
                    <TrendingDown className="h-3 w-3 ml-1 text-red-600" />
                  }
                </Badge>
              )}
              <Badge className={isRecording ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                {isRecording ? 'En cours' : 'Terminé'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Candidate Info & Controls */}
          <div className="space-y-6">
            {/* Candidate Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {candidate.name}
                </CardTitle>
                <CardDescription>{candidate.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Score initial</span>
                      <span className="text-2xl font-bold text-blue-600">{candidate.score}%</span>
                    </div>
                    <Progress value={candidate.score} className="h-2" />
                  </div>
                  
                  {refinedScore !== null && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Score raffiné</span>
                        <span className={`text-2xl font-bold ${refinedScore > candidate.score ? 'text-green-600' : 'text-red-600'}`}>
                          {refinedScore}%
                        </span>
                      </div>
                      <Progress value={refinedScore} className="h-2" />
                      <div className="text-xs text-slate-500 mt-1">
                        {refinedScore > candidate.score ? '+' : ''}{refinedScore - candidate.score} points après entretien
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium mb-2">Pourquoi ce match :</h4>
                    <ul className="space-y-1">
                      {candidate.why_match?.map((reason, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recording Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2" />
                  Note-Taker IA
                </CardTitle>
                <CardDescription>
                  Enregistrement et analyse automatique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isRecording ? (
                        <Mic className="h-5 w-5 text-red-500 animate-pulse" />
                      ) : (
                        <MicOff className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">
                        {isRecording ? 'Enregistrement actif' : 'Prêt à enregistrer'}
                      </span>
                    </div>
                    <div className="text-lg font-mono">
                      {formatTime(currentTime)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {!isRecording ? (
                      <Button 
                        onClick={handleStartRecording}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Démarrer
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStopRecording}
                        variant="outline"
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Arrêter
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    L'IA analyse en temps réel les compétences, soft skills et fit culturel
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes manuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ajoutez vos observations personnelles..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - AI Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-600" />
                  Insights IA en temps réel
                </CardTitle>
                <CardDescription>
                  {aiInsights.length} observations générées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {aiInsights.map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start space-x-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {insight.timestamp}
                            </span>
                          </div>
                          <p className="text-sm">{insight.text}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Confiance</span>
                              <span>{Math.round(insight.confidence * 100)}%</span>
                            </div>
                            <Progress value={insight.confidence * 100} className="h-1 mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Transcript */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transcript en temps réel</CardTitle>
                <CardDescription>
                  Transcription automatique via Recall.ai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transcript.map((segment) => (
                    <div key={segment.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={segment.speaker === 'Recruteur' ? 'default' : 'secondary'}>
                          {segment.speaker}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {Math.floor((segment.start_ms || 0) / 60000)}:{String(Math.floor(((segment.start_ms || 0) % 60000) / 1000)).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 pl-4 border-l-2 border-slate-200">
                        {segment.text}
                      </p>
                    </div>
                  ))}
                  
                  {isRecording && (
                    <div className="flex items-center space-x-2 text-slate-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Écoute en cours...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        {refinedScore !== null && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Entretien terminé</h3>
                    <p className="text-slate-600">
                      Score raffiné de {candidate.score}% à {refinedScore}% 
                      ({refinedScore > candidate.score ? '+' : ''}{refinedScore - candidate.score} points)
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      Voir l'évaluation complète
                    </Button>
                    <Button>
                      Prendre une décision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}