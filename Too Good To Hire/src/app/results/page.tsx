"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Target, Mail, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Candidate, CandidateStatus } from '@/types';

// Mock data for demonstration
const mockCandidates: Candidate[] = [
  {
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
    status: 'scored',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    job_id: 'job-1',
    hrflow_profile_reference: 'profile-2',
    email: 'thomas.martin@email.com',
    name: 'Thomas Martin',
    phone: '+33 6 98 76 54 32',
    score: 88,
    why_match: [
      'Stack technique parfaitement alignée',
      'Expérience startup et scale-up (3 ans)',
      'Compétences DevOps et CI/CD'
    ],
    status: 'invited',
    invited_at: '2024-01-15T11:30:00Z',
    created_at: '2024-01-15T10:05:00Z'
  },
  {
    id: '3',
    job_id: 'job-1',
    hrflow_profile_reference: 'profile-3',
    email: 'sarah.bernard@email.com',
    name: 'Sarah Bernard',
    phone: '+33 6 11 22 33 44',
    score: 85,
    why_match: [
      'Solide background full-stack (4 ans)',
      'Expérience e-commerce et fintech',
      'Maîtrise des tests automatisés'
    ],
    status: 'scheduled',
    invited_at: '2024-01-15T12:00:00Z',
    scheduled_at: '2024-01-16T14:00:00Z',
    created_at: '2024-01-15T10:10:00Z'
  },
  {
    id: '4',
    job_id: 'job-1',
    hrflow_profile_reference: 'profile-4',
    email: 'alex.rousseau@email.com',
    name: 'Alex Rousseau',
    phone: '+33 6 55 44 33 22',
    score: 82,
    why_match: [
      'Expertise frontend React avancée',
      'Expérience UX/UI et design systems',
      'Contribution open source active'
    ],
    status: 'interview_done',
    invited_at: '2024-01-14T09:00:00Z',
    scheduled_at: '2024-01-15T16:00:00Z',
    interview_done_at: '2024-01-15T16:30:00Z',
    created_at: '2024-01-15T10:15:00Z'
  },
  {
    id: '5',
    job_id: 'job-1',
    hrflow_profile_reference: 'profile-5',
    email: 'julie.moreau@email.com',
    name: 'Julie Moreau',
    phone: '+33 6 77 88 99 00',
    score: 79,
    why_match: [
      'Background développement web solide',
      'Expérience agile et méthodologies modernes',
      'Polyvalence technique et adaptabilité'
    ],
    status: 'evaluated',
    invited_at: '2024-01-13T14:00:00Z',
    scheduled_at: '2024-01-14T10:00:00Z',
    interview_done_at: '2024-01-14T10:30:00Z',
    evaluated_at: '2024-01-14T15:00:00Z',
    created_at: '2024-01-15T10:20:00Z'
  }
];

const statusConfig: Record<CandidateStatus, { label: string; color: string; icon: React.ReactNode }> = {
  scored: { 
    label: 'Scoré', 
    color: 'bg-blue-100 text-blue-800', 
    icon: <Target className="h-3 w-3" /> 
  },
  invited: { 
    label: 'Invité', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: <Mail className="h-3 w-3" /> 
  },
  scheduled: { 
    label: 'Planifié', 
    color: 'bg-purple-100 text-purple-800', 
    icon: <Calendar className="h-3 w-3" /> 
  },
  interview_done: { 
    label: 'Entretien terminé', 
    color: 'bg-indigo-100 text-indigo-800', 
    icon: <Clock className="h-3 w-3" /> 
  },
  evaluated: { 
    label: 'Évalué', 
    color: 'bg-orange-100 text-orange-800', 
    icon: <AlertCircle className="h-3 w-3" /> 
  },
  decided: { 
    label: 'Décision prise', 
    color: 'bg-green-100 text-green-800', 
    icon: <CheckCircle className="h-3 w-3" /> 
  },
  marketplace: { 
    label: 'Marketplace', 
    color: 'bg-gray-100 text-gray-800', 
    icon: <Target className="h-3 w-3" /> 
  }
};

export default function ResultsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCandidates(mockCandidates);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleInviteCandidate = async (candidateId: string) => {
    // Update candidate status to invited
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: 'invited', invited_at: new Date().toISOString() }
          : candidate
      )
    );
  };

  const handleInviteAll = async () => {
    // Invite all scored candidates
    setCandidates(prev => 
      prev.map(candidate => 
        candidate.status === 'scored'
          ? { ...candidate, status: 'invited', invited_at: new Date().toISOString() }
          : candidate
      )
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Scoring en cours...</h3>
            <p className="text-slate-600 mb-4">Analyse des profils candidats via HRFlow</p>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-slate-500 mt-2">247 profils analysés</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-slate-900">Résultats Scoring</h1>
                <p className="text-sm text-slate-600">Développeur Full-Stack Senior</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {candidates.length} candidats analysés
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {candidates.filter(c => c.status === 'scored').length}
              </div>
              <div className="text-sm text-slate-600">À inviter</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {candidates.filter(c => c.status === 'invited').length}
              </div>
              <div className="text-sm text-slate-600">Invités</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {candidates.filter(c => c.status === 'scheduled').length}
              </div>
              <div className="text-sm text-slate-600">Planifiés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}%
              </div>
              <div className="text-sm text-slate-600">Score moyen</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Top Candidats</h2>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={handleInviteAll}
              disabled={candidates.filter(c => c.status === 'scored').length === 0}
            >
              <Mail className="h-4 w-4 mr-2" />
              Inviter Tous ({candidates.filter(c => c.status === 'scored').length})
            </Button>
          </div>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Pourquoi ce match</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{candidate.name}</div>
                        <div className="text-sm text-slate-500">{candidate.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </span>
                        <Progress value={candidate.score} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {candidate.why_match?.map((reason, index) => (
                          <div key={index} className="text-sm text-slate-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {reason}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[candidate.status].color}>
                        {statusConfig[candidate.status].icon}
                        <span className="ml-1">{statusConfig[candidate.status].label}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {candidate.status === 'scored' && (
                        <Button 
                          size="sm"
                          onClick={() => handleInviteCandidate(candidate.id)}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Inviter
                        </Button>
                      )}
                      {candidate.status === 'invited' && (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          En attente
                        </Button>
                      )}
                      {candidate.status === 'scheduled' && (
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Voir RDV
                        </Button>
                      )}
                      {candidate.status === 'scheduled' && (
                        <Button 
                          size="sm" 
                          onClick={() => window.location.href = `/interview/${candidate.id}`}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Démarrer Entretien
                        </Button>
                      )}
                      {(candidate.status === 'interview_done' || candidate.status === 'evaluated') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `/interview/${candidate.id}`}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Voir Entretien
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}