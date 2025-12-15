import { HRFlowProfile, HRFlowScoringResult, HRFlowJob } from '@/types';

const HRFLOW_API_URL = 'https://api.hrflow.ai/v1';

class HRFlowAPI {
  private apiKey: string;
  private userEmail: string;
  private algorithmKey: string;

  constructor() {
    this.apiKey = process.env.HRFLOW_API_KEY || 'placeholder-hrflow-key';
    this.userEmail = process.env.HRFLOW_USER_EMAIL || 'placeholder@email.com';
    this.algorithmKey = process.env.HRFLOW_ALGORITHM_KEY || 'placeholder-algorithm-key';
  }

  private async request(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${HRFLOW_API_URL}${endpoint}`);
    
    // Add common parameters
    url.searchParams.append('X-API-KEY', this.apiKey);
    url.searchParams.append('X-USER-EMAIL', this.userEmail);
    
    // Add specific parameters
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HRFlow API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Test connection and get job info
  async testConnection(boardKey: string, jobReference: string) {
    try {
      const job = await this.getJob(boardKey, jobReference);
      return { success: true, job };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get job details
  async getJob(boardKey: string, jobReference: string): Promise<HRFlowJob> {
    const response = await this.request('/job/indexing', {
      board_key: boardKey,
      reference: jobReference
    });

    return response.data;
  }

  // Score profiles for a job (Top-K)
  async scoreProfiles(params: {
    sourceKeys: string[];
    boardKey: string;
    jobReference: string;
    limit: number;
    scoreThreshold?: number;
  }): Promise<HRFlowScoringResult[]> {
    const response = await this.request('/profiles/scoring', {
      algorithm_key: this.algorithmKey,
      source_keys: params.sourceKeys,
      board_key: params.boardKey,
      job_reference: params.jobReference,
      limit: params.limit,
      score_threshold: params.scoreThreshold || 0.0,
      order_by: 'desc'
    });

    return response.data.profiles.map((item: any) => ({
      profile: item.profile,
      score: item.score,
      predictions: item.predictions
    }));
  }

  // Grade individual profile
  async gradeProfile(params: {
    sourceKey: string;
    profileReference: string;
    boardKey: string;
    jobReference: string;
  }): Promise<{ score: number; predictions: any }> {
    const response = await this.request('/profile/grading', {
      algorithm_key: this.algorithmKey,
      source_key: params.sourceKey,
      profile_reference: params.profileReference,
      board_key: params.boardKey,
      job_reference: params.jobReference
    });

    return response.data;
  }

  // Search jobs for rematch
  async searchJobs(boardKeys: string[], limit: number = 20): Promise<HRFlowJob[]> {
    const response = await this.request('/jobs/searching', {
      board_keys: boardKeys,
      limit
    });

    return response.data.jobs;
  }

  // Generate "why match" explanation using profile and job data
  generateWhyMatch(profile: HRFlowProfile, job: HRFlowJob, score: number): string[] {
    const reasons: string[] = [];
    
    // Skills match
    if (profile.skills && job.skills) {
      const matchingSkills = profile.skills.filter(skill => 
        job.skills?.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );
      
      if (matchingSkills.length > 0) {
        reasons.push(`Compétences alignées: ${matchingSkills.slice(0, 3).join(', ')}`);
      }
    }

    // Experience level
    if (profile.experiences && profile.experiences.length > 0) {
      const totalExperience = profile.experiences.length;
      if (totalExperience >= 3) {
        reasons.push(`Expérience solide: ${totalExperience}+ postes précédents`);
      } else if (totalExperience >= 1) {
        reasons.push(`Expérience pertinente: ${totalExperience} poste(s) précédent(s)`);
      }
    }

    // Score-based reason
    if (score >= 0.8) {
      reasons.push(`Score élevé: ${Math.round(score * 100)}% de compatibilité`);
    } else if (score >= 0.6) {
      reasons.push(`Bon potentiel: ${Math.round(score * 100)}% de compatibilité`);
    }

    // Education
    if (profile.educations && profile.educations.length > 0) {
      reasons.push(`Formation adaptée: ${profile.educations.length} diplôme(s)`);
    }

    // Fallback reasons if none found
    if (reasons.length === 0) {
      reasons.push(`Profil intéressant pour le poste`);
      reasons.push(`Candidature à examiner`);
    }

    // Return max 3 reasons
    return reasons.slice(0, 3);
  }
}

export const hrflow = new HRFlowAPI();