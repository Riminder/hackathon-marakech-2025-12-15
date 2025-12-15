// Frontend types matching backend schemas

export interface SkillItem {
  name: string;
  candidateLevel: number;
  requiredLevel: number;
}

export interface CourseItem {
  name: string;
  platform: string;
  url: string;
}

export interface Recommendation {
  type: 'hardskill' | 'softskill' | 'general';
  skill?: string;
  title: string;
  description: string;
  courses: CourseItem[];
}

export interface CandidateInfo {
  name: string;
  email?: string;
}

export interface ChatContext {
  candidateName: string;
  jobTitle: string;
  skillGaps: SkillItem[];
  strengths: SkillItem[];
  recommendations: Recommendation[];
}

export interface AnalysisResult {
  score: number;
  threshold: number;
  matched: boolean;
  detectedLanguage: string;
  candidate: CandidateInfo;
  skillGaps: SkillItem[];
  strengths: SkillItem[];
  recommendations: Recommendation[];
  email: string;
  videoUrl?: string;
  chatContext: ChatContext;
}

export interface Job {
  key: string;
  title: string;
  company: string;
  location: string;
}

export interface Profile {
  key: string;
  name: string;
  email: string;
}
