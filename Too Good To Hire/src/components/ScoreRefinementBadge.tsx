"use client";

import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreRefinementBadgeProps {
  originalScore: number;
  refinedScore?: number;
  showDetails?: boolean;
}

export function ScoreRefinementBadge({ 
  originalScore, 
  refinedScore, 
  showDetails = false 
}: ScoreRefinementBadgeProps) {
  if (!refinedScore || refinedScore === originalScore) {
    return null;
  }

  const adjustment = refinedScore - originalScore;
  const isPositive = adjustment > 0;
  const isNegative = adjustment < 0;

  const getColor = () => {
    if (isPositive) return 'bg-green-100 text-green-800 border-green-200';
    if (isNegative) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUp className="h-3 w-3" />;
    if (isNegative) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  return (
    <Badge className={`${getColor()} flex items-center space-x-1`}>
      {getIcon()}
      <span>
        {showDetails ? (
          <>
            {originalScore}% → {refinedScore}% 
            ({isPositive ? '+' : ''}{adjustment})
          </>
        ) : (
          <>
            Raffiné: {refinedScore}%
          </>
        )}
      </span>
    </Badge>
  );
}