'use client';

import { useState } from 'react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  disabled?: boolean;
}

export default function TextInput({ onTextSubmit, disabled }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Saisir votre CV
        </h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Entrez les informations de votre CV (nom, expérience, compétences, formation...)"
        rows={8}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Soumettre le texte
      </button>
    </div>
  );
}