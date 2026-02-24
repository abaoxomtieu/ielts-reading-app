'use client';

import React, { useState } from 'react';
import type { SentenceCompletionQuestion } from '@/types';

interface Props {
  data: SentenceCompletionQuestion;
}

export default function SentenceCompletionViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const sentences = content.sentences || [];
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';
  const options = content.options;
  const showOptions = content.uiHints?.showOptions ?? false;

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const renderSentence = (s: { id: number; text: string }) => {
    const hasBlank = s.text.includes('[______]');
    const parts = hasBlank ? s.text.split('[______]') : [s.text];
    return (
      <div key={s.id} className="flex flex-wrap items-center gap-2 mb-4">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
          {s.id}
        </span>
        {parts[0] && <span className="text-gray-900">{parts[0]}</span>}
        {hasBlank && (
          <input
            type="text"
            className="inline-block w-40 border-b-2 border-gray-500 bg-transparent px-2 py-0.5 focus:border-blue-600 focus:outline-none text-gray-900"
            value={answers[s.id] ?? ''}
            onChange={(e) => handleChange(s.id, e.target.value)}
            placeholder="_____"
          />
        )}
        {hasBlank && parts[1] && <span className="text-gray-900">{parts[1]}</span>}
        {!hasBlank && <span className="text-gray-900">{s.text}</span>}
      </div>
    );
  };

  return (
    <div className="w-full bg-white border border-gray-300 shadow-sm p-8 rounded-lg">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white font-bold rounded-md">
            {meta.questionNumber}
          </div>
          <h2 className="text-xl font-semibold text-black flex-1">{content.questionText}</h2>
        </div>
        {content.instructions && (
          <p className="text-sm text-gray-600 ml-13">{content.instructions}</p>
        )}
      </div>
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>
      {showOptions && options && options.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <div className="grid gap-2 text-sm text-gray-800 sm:grid-cols-2">
            {options.map((opt) => (
              <div key={opt.id} className="flex items-start gap-2">
                <span className="font-bold text-gray-900">{opt.id}</span>
                <span className="text-gray-800">{opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-1">
        {sentences.map(renderSentence)}
      </div>
    </div>
  );
}
