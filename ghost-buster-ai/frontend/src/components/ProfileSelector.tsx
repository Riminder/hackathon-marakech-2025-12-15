import { User, Mail } from 'lucide-react';
import type { Profile } from '../lib/types';

interface ProfileSelectorProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelect: (profile: Profile) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ProfileSelector({ profiles, selectedProfile, onSelect, disabled, loading }: ProfileSelectorProps) {
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

  if (profiles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No profiles available in your HRFlow source
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {profiles.map((profile) => (
        <button
          key={profile.key}
          onClick={() => onSelect(profile)}
          disabled={disabled}
          className={`
            w-full text-left p-4 rounded-lg border-2 transition-all
            ${selectedProfile?.key === profile.key
              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
              : 'border-gray-200 hover:border-gray-300 bg-white'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`
              p-2 rounded-lg
              ${selectedProfile?.key === profile.key ? 'bg-green-100' : 'bg-gray-100'}
            `}>
              <User className={`w-5 h-5 ${selectedProfile?.key === profile.key ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {profile.name}
              </h3>
              {profile.email && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
