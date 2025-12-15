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
  jobKey: string
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile_key: profileKey, job_key: jobKey }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze candidate');
  }

  return response.json();
}
