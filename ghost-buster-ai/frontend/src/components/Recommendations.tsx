import { Lightbulb, BookOpen } from 'lucide-react';

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        Personalized Recommendations
      </h3>

      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-gray-700 flex-1">{rec}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          These recommendations are based on your skill gap analysis
        </p>
      </div>
    </div>
  );
}
