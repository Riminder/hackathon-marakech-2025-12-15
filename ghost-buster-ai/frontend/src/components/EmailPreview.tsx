import { useState } from 'react';
import { Mail, Copy, Check, Globe } from 'lucide-react';

interface EmailPreviewProps {
  email: string;
  candidateName: string;
  language: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  ar: 'Arabic',
  zh: 'Chinese',
  ja: 'Japanese',
};

export function EmailPreview({ email, candidateName, language }: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const languageName = LANGUAGE_NAMES[language] || language.toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-medium text-gray-900">Personalized Email</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3" />
                Generated in {languageName}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${copied
                ? 'bg-green-100 text-green-700'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
          {email}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-50 px-4 py-3 border-t border-blue-100">
        <p className="text-sm text-blue-700">
          This email was generated based on {candidateName}'s profile analysis and is personalized to highlight their strengths while providing constructive feedback.
        </p>
      </div>
    </div>
  );
}
