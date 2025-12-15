"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Calendar, BarChart3, ArrowRight, CheckCircle, MessageSquare, Zap } from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      // Simulate login delay
      setTimeout(() => {
        setIsLoggedIn(true);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleScoreProfile = () => {
    // Navigate to scoring results
    window.location.href = '/results';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Hiring Agent</h1>
            <p className="text-slate-600">Agent de Recrutement Automatisé</p>
          </div>
          
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Connexion Recruteur</CardTitle>
              <CardDescription>
                Accédez à votre plateforme de recrutement IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="recruteur@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Hiring Agent</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                Connecté
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => setIsLoggedIn(false)}
                className="hover:bg-slate-100"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Agent de Recrutement Automatisé
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Scorez, interviewez et évaluez vos candidats automatiquement avec l'IA
          </p>
        </div>

        {/* Main Action Card */}
        <Card className="mb-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-6 w-6 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                Poste Actif
              </Badge>
            </div>
            <CardTitle className="text-2xl text-blue-900">
              Développeur Full-Stack Senior
            </CardTitle>
            <CardDescription className="text-lg text-blue-700">
              Paris • CDI • 60-80k€ • React, Node.js, TypeScript
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">247</div>
                <div className="text-sm text-blue-700">Candidats disponibles</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-900">Top 10</div>
                <div className="text-sm text-blue-700">Recommandés</div>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={handleScoreProfile}
            >
              <Target className="mr-3 h-5 w-5" />
              Score Profile
            </Button>
          </CardContent>
        </Card>

        {/* Process Flow */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Processus Automatisé
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">1. Scoring IA</h4>
                <p className="text-sm text-slate-600">
                  Analyse automatique des profils via HRFlow
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">2. Planification</h4>
                <p className="text-sm text-slate-600">
                  RDV automatiques + Google Meet
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">3. Entretien IA</h4>
                <p className="text-sm text-slate-600">
                  Transcript + évaluation Recall.ai
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">4. Décision</h4>
                <p className="text-sm text-slate-600">
                  Validation + rematch automatique
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Candidats Analysés</p>
                  <p className="text-2xl font-bold text-slate-900">1,247</p>
                  <p className="text-xs text-green-600">+23 cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Entretiens Planifiés</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-blue-600">Cette semaine</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Taux de Conversion</p>
                  <p className="text-2xl font-bold text-slate-900">18%</p>
                  <p className="text-xs text-purple-600">Candidats → Entretiens</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Taux de Réussite</p>
                  <p className="text-2xl font-bold text-slate-900">87%</p>
                  <p className="text-xs text-orange-600">Entretiens → Embauches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Entretiens en Cours
              </CardTitle>
              <CardDescription>
                Suivez les entretiens en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Voir les Entretiens
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Décisions en Attente
              </CardTitle>
              <CardDescription>
                Validez les évaluations IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Prendre les Décisions
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}