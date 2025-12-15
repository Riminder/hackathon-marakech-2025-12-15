// API client for backend communication
import type { AnalysisResult, Job, Profile } from './types';

const API_BASE = '/api';

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(`${API_BASE}/jobs`);
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  const data = await response.json();
  return data.jobs;
}

export async function fetchProfiles(): Promise<Profile[]> {
  const response = await fetch(`${API_BASE}/profiles`);
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  const data = await response.json();
  return data.profiles;
}

export async function analyzeCandidate(
  profileKey: string,
  jobKey: string,
  roastMode: boolean = false
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile_key: profileKey,
      job_key: jobKey,
      roast_mode: roastMode,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze candidate');
  }

  return response.json();
}

export interface VideoJob {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  error?: string;
}

export async function startVideoGeneration(
  emailContent: string,
  language: string
): Promise<{ job_id: string }> {
  const response = await fetch(`${API_BASE}/generate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email_content: emailContent,
      language: language,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to start video generation');
  }

  return response.json();
}

export async function getVideoStatus(jobId: string): Promise<VideoJob> {
  const response = await fetch(`${API_BASE}/video-status/${jobId}`);

  if (!response.ok) {
    throw new Error('Failed to get video status');
  }

  return response.json();
}
