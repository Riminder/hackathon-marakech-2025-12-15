import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  threshold: number;
  matched: boolean;
}

export function ScoreDisplay({ score, threshold, matched }: ScoreDisplayProps) {
  const percentage = Math.round(score * 100);
  const thresholdPercentage = Math.round(threshold * 100);

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
            stroke={matched ? '#22c55e' : '#f97316'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 141.3} 141.3`}
          />
          {/* Threshold marker */}
          <circle
            cx={50 + 45 * Math.cos((Math.PI * (180 - thresholdPercentage * 1.8)) / 180)}
            cy={50 - 45 * Math.sin((Math.PI * (180 - thresholdPercentage * 1.8)) / 180)}
            r="3"
            fill="#6b7280"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-end justify-center pb-0">
          <div className="text-center">
            <span className={`text-3xl font-bold ${matched ? 'text-green-600' : 'text-orange-600'}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`
        flex items-center justify-center gap-2 py-2 px-4 rounded-full mx-auto w-fit
        ${matched ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
      `}>
        {matched ? (
          <>
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Above Threshold</span>
          </>
        ) : (
          <>
            <TrendingDown className="w-4 h-4" />
            <span className="font-medium">Below Threshold ({thresholdPercentage}%)</span>
          </>
        )}
      </div>

      {/* Additional info */}
      <p className="text-sm text-gray-500 text-center mt-4">
        {matched
          ? "This candidate meets the minimum requirements for the position."
          : "This candidate's profile doesn't fully match the requirements, but shows potential in key areas."
        }
      </p>
    </div>
  );
}
