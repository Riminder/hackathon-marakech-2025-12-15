import type { SkillItem } from '../lib/types';

interface SkillGapChartProps {
  skillGaps: SkillItem[];
  strengths: SkillItem[];
}

export function SkillGapChart({ skillGaps, strengths }: SkillGapChartProps) {
  // Prepare data for visualization
  const gapsData = skillGaps.slice(0, 3).map(skill => ({
    name: skill.name,
    candidate: skill.candidateLevel,
    required: skill.requiredLevel,
    gap: skill.requiredLevel - skill.candidateLevel,
  }));

  const strengthsData = strengths.slice(0, 3).map(skill => ({
    name: skill.name,
    candidate: skill.candidateLevel,
    required: skill.requiredLevel,
    surplus: skill.candidateLevel - skill.requiredLevel,
  }));

  return (
    <div className="space-y-8">
      {/* Skill Gaps Section */}
      {gapsData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            Areas for Growth
          </h3>
          <div className="space-y-4">
            {gapsData.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{skill.name}</span>
                  <span className="text-gray-500">
                    {skill.candidate}% / {skill.required}% required
                  </span>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  {/* Required level marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-gray-400 z-10"
                    style={{ left: `${skill.required}%` }}
                  />
                  {/* Candidate level */}
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.candidate}%` }}
                  />
                </div>
                <p className="text-xs text-orange-600">
                  Gap: {skill.gap}% to reach required level
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths Section */}
      {strengthsData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Your Strengths
          </h3>
          <div className="space-y-4">
            {strengthsData.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{skill.name}</span>
                  <span className="text-gray-500">
                    {skill.candidate}% (required: {skill.required}%)
                  </span>
                </div>
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  {/* Required level marker */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-gray-400 z-10"
                    style={{ left: `${skill.required}%` }}
                  />
                  {/* Candidate level */}
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(skill.candidate, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-green-600">
                  Exceeds requirement by {skill.surplus}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-400 to-orange-500"></div>
          <span>Your Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gray-400"></div>
          <span>Required Level</span>
        </div>
      </div>
    </div>
  );
}
