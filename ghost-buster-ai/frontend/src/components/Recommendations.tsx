import { Lightbulb, ExternalLink, Code, Users } from 'lucide-react';
import type { Recommendation } from '../lib/types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        Personalized Learning Path
      </h3>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                ${rec.type === 'hardskill' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
              `}>
                {rec.type === 'hardskill' ? (
                  <Code className="w-4 h-4" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`
                    text-xs font-medium px-2 py-0.5 rounded-full
                    ${rec.type === 'hardskill' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}
                  `}>
                    {rec.type === 'hardskill' ? 'Technical Skill' : 'Soft Skill'}
                  </span>
                  {rec.skill && (
                    <span className="text-xs text-gray-500">{rec.skill}</span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>

                {rec.courses.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recommended Courses</p>
                    {rec.courses.map((course, courseIndex) => (
                      <a
                        key={courseIndex}
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{course.name}</span>
                        <span className="text-gray-400 text-xs flex-shrink-0">({course.platform})</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          These recommendations are AI-generated based on your skill gap analysis and job requirements.
        </p>
      </div>
    </div>
  );
}
