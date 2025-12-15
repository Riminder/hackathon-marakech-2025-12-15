import { Briefcase, MapPin, Building } from 'lucide-react';
import type { Job } from '../lib/types';

interface JobSelectorProps {
  jobs: Job[];
  selectedJob: Job | null;
  onSelect: (job: Job) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function JobSelector({ jobs, selectedJob, onSelect, disabled, loading }: JobSelectorProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse border rounded-lg p-4">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No jobs available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <button
          key={job.key}
          onClick={() => onSelect(job)}
          disabled={disabled}
          className={`
            w-full text-left p-4 rounded-lg border-2 transition-all
            ${selectedJob?.key === job.key
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-lg
              ${selectedJob?.key === job.key ? 'bg-blue-100' : 'bg-gray-100'}
            `}>
              <Briefcase className={`w-5 h-5 ${selectedJob?.key === job.key ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
