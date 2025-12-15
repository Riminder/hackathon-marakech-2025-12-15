// Database Types
export interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  hrflow_board_key: string;
  hrflow_job_reference: string;
  hrflow_source_key: string;
  title: string;
  description?: string;
  requirements?: Record<string, any>;
  top_k: number;
  score_threshold: number;
  status: 'active' | 'paused' | 'closed';
  created_at: string;
}

export type CandidateStatus = 
  | 'scored' 
  | 'invited' 
  | 'scheduled' 
  | 'interview_done' 
  | 'evaluated' 
  | 'decided' 
  | 'marketplace';

export interface Candidate {
  id: string;
  job_id: string;
  hrflow_profile_reference: string;
  email: string;
  name?: string;
  phone?: string;
  cv_url?: string;
  
  // Scoring HRFlow
  score: number;
  score_breakdown?: Record<string, number>;
  why_match?: string[];
  
  // Status workflow
  status: CandidateStatus;
  invited_at?: string;
  scheduled_at?: string;
  interview_done_at?: string;
  evaluated_at?: string;
  decided_at?: string;
  
  created_at: string;
}

export interface Interview {
  id: string;
  candidate_id: string;
  job_id: string;
  
  // Scheduling
  scheduled_at?: string;
  meeting_url?: string;
  google_event_id?: string;
  
  // Recall.ai
  recall_bot_id?: string;
  status: 'created' | 'scheduled' | 'in_progress' | 'completed' | 'failed';
  
  // Results
  started_at?: string;
  ended_at?: string;
  duration_minutes?: number;
  
  created_at: string;
}

export interface TranscriptSegment {
  id: string;
  interview_id: string;
  speaker: string;
  text: string;
  start_ms?: number;
  end_ms?: number;
  confidence?: number;
  created_at: string;
}

export interface Evaluation {
  id: string;
  candidate_id: string;
  interview_id: string;
  
  // Évaluation IA
  summary?: string;
  green_flags?: string[];
  yellow_flags?: string[];
  red_flags?: string[];
  
  // Match Score
  match_percentage?: number;
  match_explanation?: string;
  
  // Upskilling
  upskilling_recommendations?: Record<string, any>;
  
  created_at: string;
}

export interface Decision {
  id: string;
  candidate_id: string;
  evaluation_id: string;
  
  decision: 'yes' | 'no';
  reason?: string;
  reason_category?: string;
  
  // Rematch
  rematch_suggestions?: RematchSuggestion[];
  added_to_marketplace: boolean;
  
  // Email
  email_sent_at?: string;
  
  created_at: string;
}

export interface RematchSuggestion {
  job_id: string;
  job_title: string;
  match_percentage: number;
  explanation: string;
  recruiter?: string;
}

// Form Types
export interface SetupForm {
  source_key: string;
  board_key: string;
  job_reference: string;
  top_k: number;
  score_threshold?: number;
}

export interface DecisionForm {
  decision: 'yes' | 'no';
  reason?: string;
  reason_category?: string;
}

// API Response Types
export interface HRFlowProfile {
  key: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experiences?: any[];
  educations?: any[];
}

export interface HRFlowScoringResult {
  profile: HRFlowProfile;
  score: number;
  predictions?: Record<string, any>;
}

export interface HRFlowJob {
  key: string;
  reference: string;
  name: string;
  summary?: string;
  description?: string;
  skills?: string[];
  requirements?: Record<string, any>;
}

export interface RecallBot {
  id: string;
  meeting_url: string;
  bot_name: string;
  status: string;
  recording_config?: Record<string, any>;
}

export interface RecallTranscript {
  id: string;
  bot_id: string;
  segments: {
    speaker: string;
    text: string;
    start_ms: number;
    end_ms: number;
    confidence: number;
  }[];
}

// Email Templates
export interface EmailTemplate {
  subject: string;
  body: string;
  variables?: Record<string, string>;
}