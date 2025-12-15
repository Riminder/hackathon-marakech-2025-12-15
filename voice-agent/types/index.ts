export interface Job {
  id: string;
  name: string;
  location: string;
  picture?: string;
  score: number;
  description?: string;
}

export interface ParsedProfile {
  profile_id: string;
  profile_reference?: string;
  info?: {
    full_name?: string;
    email?: string;
    phone?: string;
  };
}

export interface ScoringResult {
  jobs: Job[];
}

export type InputMethod = 'file' | 'text' | 'voice' | null;