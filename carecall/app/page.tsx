"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Trash2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  TrendingUp, 
  AlertCircle,
  Loader2 
} from "lucide-react";

// --- Types ---
type Candidate = {
  id: string; // This maps to profile_key
  name: string;
  role: string;
  location: string;
  score: number;
  experience: string;
  strengths: string[];
  weaknesses: string[];
  avatar: string;
};

// --- Mock Data ---
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Eric Kelly",
    role: "Senior Frontend Dev",
    location: "Jahra, KWT",
    score: 88,
    experience: "Expérimenté (3-7 ans)",
    strengths: ["React", "Leadership"],
    weaknesses: ["Vue.js"],
    avatar: "https://i.pravatar.cc/150?u=eric",
  },
  {
    id: "2",
    name: "Jeremy Johnson",
    role: "Backend Engineer",
    location: "Ad Dawhah, QAT",
    score: 72,
    experience: "Expérimenté (3-7 ans)",
    strengths: ["Node.js", "Scalability"],
    weaknesses: ["Communication"],
    avatar: "https://i.pravatar.cc/150?u=jeremy",
  },
  {
    id: "3",
    name: "Leslie Santana",
    role: "Product Designer",
    location: "Safi, MAR",
    score: 45,
    experience: "Junior (1-2 ans)",
    strengths: ["Figma", "UI"],
    weaknesses: ["UX Research", "Coding"],
    avatar: "https://i.pravatar.cc/150?u=leslie",
  },
  {
    id: "a040c61aa666cacd4fa3081657a10501f539efa6",
    name: "Erica Serrano",
    role: "Data Scientist",
    location: "Rangpur, BGD",
    score: 24,
    experience: "Expérimenté (3-7 ans)",
    strengths: ["Python"],
    weaknesses: ["SQL", "Business Logic", "Teamwork"],
    avatar: "https://i.pravatar.cc/150?u=erica",
  },
  {
    id: "5",
    name: "Kathleen Roberts",
    role: "DevOps Engineer",
    location: "Flores, GTM",
    score: 65,
    experience: "Senior (7+ ans)",
    strengths: ["AWS", "Docker"],
    weaknesses: ["Kubernetes", "Documentation"],
    avatar: "https://i.pravatar.cc/150?u=kathleen",
  },
];

// --- Constants for API (HACKATHON MODE: Client Side) ---
const API_URL = "/api/reject"; 
const API_KEY = "ask_09d9cda949adbb6f475da0ab5f832491";    
//const API_KEY = "xxx";    
const USER_EMAIL = "integrations+carecall@hrflow.ai";     


export default function RecruiterBackOffice() {
  // --- State ---
  const [threshold, setThreshold] = useState<number>(50);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // NEW: Loading state


// --- Logic ---
const candidatesToReject = useMemo(() => {
  return candidates.filter((c) => c.score < threshold);
}, [candidates, threshold]);

const handleReject = async () => {
  // 1. Validation basique
  if (candidatesToReject.length === 0) return;

  const confirmed = confirm(
    `Êtes-vous sûr de vouloir rejeter ${candidatesToReject.length} candidats ?\nCela déclenchera l'agent IA individuellement pour chacun.`
  );

  if (!confirmed) return;

  setIsSubmitting(true);

  try {
    // 2. Création des Promesses (Une requête fetch par candidat)
    const requests = candidatesToReject.map((candidate) => {
      
      // IMPORTANT : On garde le format array [{...}] car ton code Python 
      // s'attend à itérer sur une liste, même si elle ne contient qu'un seul élément.
      const singlePayload = {
        profile_key: candidate.id,
        strengths: candidate.strengths,
        weaknesses: candidate.weaknesses
      };


      // On retourne la promesse du fetch
      return fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pas besoin de clés ici car c'est géré par route.ts maintenant
        },
        body: JSON.stringify(singlePayload),
      }).then(async (response) => {
          if (!response.ok) {
              throw new Error(`Erreur API pour ${candidate.name} (${response.status})`);
          }
          return response;

      });
    });

    // 3. Exécution parallèle : on attend que TOUTES les requêtes soient finies
    await Promise.all(requests);

    // 4. Mise à jour de l'interface (Succès total)
    const keptCandidates = candidates.filter((c) => c.score >= threshold);
    setCandidates(keptCandidates);
    alert(`Succès ! ${candidatesToReject.length} candidats ont été traités individuellement.`);

  } catch (error) {
    console.error("Erreur lors de l'envoi individuel :", error);
    alert("Une erreur est survenue lors du traitement d'un ou plusieurs candidats. Vérifiez la console.");
  } finally {
    setIsSubmitting(false);
  }
};

  // --- Styles Constants ---
  const BRAND_TEAL = "#379E8F";
  const SOFT_RED_BG = "bg-red-50";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: BRAND_TEAL }}>
            FC
          </div>
          <span className="font-semibold text-lg tracking-tight">AirCall AI</span>
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md">Recruiter View</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                HR Agent Active
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Position: Senior AI Researcher</h1>
            <p className="text-gray-500 flex items-center gap-2">
               <Users size={16} /> 
               {candidates.length} candidates pending review
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
            
            {/* Slider */}
            <div className="flex flex-col gap-2 w-full md:w-64">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-600">Rejection Threshold</span>
                <span className="text-red-500">{threshold}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: candidatesToReject.length > 0 ? '#ef4444' : BRAND_TEAL }}
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleReject}
              disabled={candidatesToReject.length === 0 || isSubmitting}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md min-w-[160px] justify-center
                ${candidatesToReject.length > 0 
                  ? 'bg-red-500 hover:bg-red-600 text-white translate-y-0' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  <span>Reject ({candidatesToReject.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#379E8F]/20 focus:border-[#379E8F] transition-all"
              />
            </div>
            <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><Filter size={18}/></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Hire Score</th>
                  <th className="px-6 py-4">Strengths</th>
                  <th className="px-6 py-4">Weaknesses</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((candidate) => {
                  const isBelowThreshold = candidate.score < threshold;
                  
                  return (
                    <tr 
                      key={candidate.id} 
                      className={`
                        transition-colors duration-300 group
                        ${isBelowThreshold ? `${SOFT_RED_BG}` : 'hover:bg-gray-50'}
                      `}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img 
                            className="w-10 h-10 rounded-full border border-gray-100 object-cover shadow-sm" 
                            src={candidate.avatar} 
                            alt={candidate.name} 
                          />
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{candidate.name}</div>
                            <div className="text-xs text-gray-500">{candidate.role} • {candidate.location}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-200" />
                                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" 
                                        className={isBelowThreshold ? "text-red-500" : "text-[#379E8F]"}
                                        strokeDasharray={100} 
                                        strokeDashoffset={100 - candidate.score} 
                                    />
                                </svg>
                                <span className={`absolute text-xs font-bold ${isBelowThreshold ? "text-red-600" : "text-[#379E8F]"}`}>
                                    {candidate.score}
                                </span>
                            </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.strengths.map((s, i) => (
                            <span key={i} className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.weaknesses.map((w, i) => (
                            <span key={i} className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-md">
                              {w}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                            {candidate.experience}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                         {isBelowThreshold ? (
                             <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-white/60 px-2 py-1 rounded border border-red-200 shadow-sm animate-pulse">
                                <AlertCircle size={12} /> To Reject
                             </span>
                         ) : (
                             <button className="text-gray-400 hover:text-[#379E8F] transition-colors p-2 rounded hover:bg-teal-50">
                                <TrendingUp size={18} />
                             </button>
                         )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {candidates.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                    All candidates have been processed.
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}