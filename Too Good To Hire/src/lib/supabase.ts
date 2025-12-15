import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE5NTczNDUyMDB9.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database helper functions
export const db = {
  // Users
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createUser(user: { email: string; name?: string; company?: string }) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Jobs
  async createJob(job: {
    user_id: string;
    hrflow_board_key: string;
    hrflow_job_reference: string;
    hrflow_source_key: string;
    title: string;
    description?: string;
    requirements?: Record<string, any>;
    top_k: number;
    score_threshold: number;
  }) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getJob(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getJobsByUser(userId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Candidates
  async createCandidate(candidate: {
    job_id: string;
    hrflow_profile_reference: string;
    email: string;
    name?: string;
    phone?: string;
    cv_url?: string;
    score: number;
    score_breakdown?: Record<string, number>;
    why_match?: string[];
  }) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCandidatesByJob(jobId: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('job_id', jobId)
      .order('score', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateCandidateStatus(candidateId: string, status: string, updates?: Record<string, any>) {
    const updateData = { status, ...updates };
    
    const { data, error } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', candidateId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Interviews
  async createInterview(interview: any) {
    const { data, error } = await supabase
      .from('interviews')
      .insert(interview)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInterview(id: string) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInterview(id: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('interviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Transcript Segments
  async createTranscriptSegments(segments: any[]) {
    const { data, error } = await supabase
      .from('transcript_segments')
      .insert(segments)
      .select();
    
    if (error) throw error;
    return data;
  },

  async getTranscriptSegments(interviewId: string) {
    const { data, error } = await supabase
      .from('transcript_segments')
      .select('*')
      .eq('interview_id', interviewId)
      .order('start_ms', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Evaluations
  async createEvaluation(evaluation: any) {
    const { data, error } = await supabase
      .from('evaluations')
      .insert(evaluation)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getEvaluation(candidateId: string) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Decisions
  async createDecision(decision: any) {
    const { data, error } = await supabase
      .from('decisions')
      .insert(decision)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getDecision(candidateId: string) {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();
    
    if (error) throw error;
    return data;
  }
};