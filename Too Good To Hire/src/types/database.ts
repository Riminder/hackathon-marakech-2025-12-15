// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          company: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          company?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          company?: string | null;
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          user_id: string;
          hrflow_board_key: string;
          hrflow_job_reference: string;
          hrflow_source_key: string;
          title: string;
          description: string | null;
          requirements: any | null;
          top_k: number;
          score_threshold: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hrflow_board_key: string;
          hrflow_job_reference: string;
          hrflow_source_key: string;
          title: string;
          description?: string | null;
          requirements?: any | null;
          top_k?: number;
          score_threshold?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hrflow_board_key?: string;
          hrflow_job_reference?: string;
          hrflow_source_key?: string;
          title?: string;
          description?: string | null;
          requirements?: any | null;
          top_k?: number;
          score_threshold?: number;
          status?: string;
          created_at?: string;
        };
      };
      candidates: {
        Row: {
          id: string;
          job_id: string;
          hrflow_profile_reference: string;
          email: string;
          name: string | null;
          phone: string | null;
          cv_url: string | null;
          score: number;
          score_breakdown: any | null;
          why_match: string[] | null;
          status: string;
          invited_at: string | null;
          scheduled_at: string | null;
          interview_done_at: string | null;
          evaluated_at: string | null;
          decided_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          hrflow_profile_reference: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          cv_url?: string | null;
          score: number;
          score_breakdown?: any | null;
          why_match?: string[] | null;
          status?: string;
          invited_at?: string | null;
          scheduled_at?: string | null;
          interview_done_at?: string | null;
          evaluated_at?: string | null;
          decided_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          hrflow_profile_reference?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          cv_url?: string | null;
          score?: number;
          score_breakdown?: any | null;
          why_match?: string[] | null;
          status?: string;
          invited_at?: string | null;
          scheduled_at?: string | null;
          interview_done_at?: string | null;
          evaluated_at?: string | null;
          decided_at?: string | null;
          created_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          candidate_id: string;
          job_id: string;
          scheduled_at: string | null;
          meeting_url: string | null;
          google_event_id: string | null;
          recall_bot_id: string | null;
          status: string;
          started_at: string | null;
          ended_at: string | null;
          duration_minutes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          job_id: string;
          scheduled_at?: string | null;
          meeting_url?: string | null;
          google_event_id?: string | null;
          recall_bot_id?: string | null;
          status?: string;
          started_at?: string | null;
          ended_at?: string | null;
          duration_minutes?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          job_id?: string;
          scheduled_at?: string | null;
          meeting_url?: string | null;
          google_event_id?: string | null;
          recall_bot_id?: string | null;
          status?: string;
          started_at?: string | null;
          ended_at?: string | null;
          duration_minutes?: number | null;
          created_at?: string;
        };
      };
      transcript_segments: {
        Row: {
          id: string;
          interview_id: string;
          speaker: string;
          text: string;
          start_ms: number | null;
          end_ms: number | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          speaker: string;
          text: string;
          start_ms?: number | null;
          end_ms?: number | null;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          speaker?: string;
          text?: string;
          start_ms?: number | null;
          end_ms?: number | null;
          confidence?: number | null;
          created_at?: string;
        };
      };
      evaluations: {
        Row: {
          id: string;
          candidate_id: string;
          interview_id: string;
          summary: string | null;
          green_flags: string[] | null;
          yellow_flags: string[] | null;
          red_flags: string[] | null;
          match_percentage: number | null;
          match_explanation: string | null;
          upskilling_recommendations: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          interview_id: string;
          summary?: string | null;
          green_flags?: string[] | null;
          yellow_flags?: string[] | null;
          red_flags?: string[] | null;
          match_percentage?: number | null;
          match_explanation?: string | null;
          upskilling_recommendations?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          interview_id?: string;
          summary?: string | null;
          green_flags?: string[] | null;
          yellow_flags?: string[] | null;
          red_flags?: string[] | null;
          match_percentage?: number | null;
          match_explanation?: string | null;
          upskilling_recommendations?: any | null;
          created_at?: string;
        };
      };
      decisions: {
        Row: {
          id: string;
          candidate_id: string;
          evaluation_id: string;
          decision: string;
          reason: string | null;
          reason_category: string | null;
          rematch_suggestions: any | null;
          added_to_marketplace: boolean;
          email_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          evaluation_id: string;
          decision: string;
          reason?: string | null;
          reason_category?: string | null;
          rematch_suggestions?: any | null;
          added_to_marketplace?: boolean;
          email_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          evaluation_id?: string;
          decision?: string;
          reason?: string | null;
          reason_category?: string | null;
          rematch_suggestions?: any | null;
          added_to_marketplace?: boolean;
          email_sent_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}