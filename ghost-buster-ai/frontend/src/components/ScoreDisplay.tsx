import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  threshold: number;
  matched: boolean;
}

type MatchStatus = 'match' | 'potential' | 'no-match';

function getMatchStatus(percentage: number): MatchStatus {
  if (percentage >= 80) return 'match';
  if (percentage >= 60) return 'potential';
  return 'no-match';
}

const statusConfig = {
  'match': {
    color: '#22c55e',
    textColor: 'text-green-600',
    bgColor: 'bg-green-100 text-green-700',
    icon: TrendingUp,
    label: 'Strong Match',
    description: "This candidate meets the requirements for the position.",
  },
  'potential': {
    color: '#f97316',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-100 text-orange-700',
    icon: Minus,
    label: 'Potential Match',
    description: "This candidate shows potential but may need development in some areas.",
  },
  'no-match': {
    color: '#ef4444',
    textColor: 'text-red-600',
    bgColor: 'bg-red-100 text-red-700',
    icon: TrendingDown,
    label: 'Not a Match',
    description: "This candidate's profile doesn't match the requirements for this role.",
  },
};

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  const percentage = Math.round(score * 100);
  const status = getMatchStatus(percentage);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-gray-600" />
        Match Score
      </h3>

      {/* Gauge visualization */}
      <div className="relative w-48 h-24 mx-auto mb-4">
        {/* Background arc */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background track */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Score arc */}
          <path
            d="M 5 50 A 45 45 0 0 1 95 50"
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 141.3} 141.3`}
          />
          {/* 60% marker */}
          <circle
            cx={50 + 45 * Math.cos((Math.PI * (180 - 60 * 1.8)) / 180)}
            cy={50 - 45 * Math.sin((Math.PI * (180 - 60 * 1.8)) / 180)}
            r="2"
            fill="#9ca3af"
          />
          {/* 80% marker */}
          <circle
            cx={50 + 45 * Math.cos((Math.PI * (180 - 80 * 1.8)) / 180)}
            cy={50 - 45 * Math.sin((Math.PI * (180 - 80 * 1.8)) / 180)}
            r="2"
            fill="#9ca3af"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <div className="text-center">
            <span className={`text-3xl font-bold ${config.textColor}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full mx-auto w-fit ${config.bgColor}`}>
        <StatusIcon className="w-4 h-4" />
        <span className="font-medium">{config.label}</span>
      </div>

      {/* Additional info */}
      <p className="text-sm text-gray-500 text-center mt-4">
        {config.description}
      </p>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          &lt;60%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          60-79%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          ≥80%
        </span>
      </div>
    </div>
  );
}
