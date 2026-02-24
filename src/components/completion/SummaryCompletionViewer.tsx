'use client';

import React, { useState } from 'react';
import type { SummaryCompletionQuestion } from '@/types';

interface Props {
  data: SummaryCompletionQuestion;
}

export default function SummaryCompletionViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const summary = content.summary;
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';
  const options = content.options;
  const showOptions = content.uiHints?.showOptions ?? false;

  const handleChange = (blankId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const sortedBlanks = [...(summary?.blanks || [])].sort((a, b) => a.position - b.position);
  let lastIndex = 0;
  const parts: Array<{ type: 'text' | 'blank'; content: string; blankId?: number }> = [];

  sortedBlanks.forEach((blank) => {
    if (blank.position > lastIndex) {
      parts.push({ type: 'text', content: summary.text.substring(lastIndex, blank.position) });
    }
    parts.push({ type: 'blank', content: '', blankId: blank.id });
    lastIndex = blank.position;
  });
  if (summary && lastIndex < summary.text.length) {
    parts.push({ type: 'text', content: summary.text.substring(lastIndex) });
  }

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
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700">
          Choose from: {options.map((o) => o.text).join(', ')}
        </div>
      )}
      <div className="text-gray-900 leading-relaxed">
        {parts.map((part, i) => {
          if (part.type === 'text') {
            return <span key={`t-${i}`}>{part.content}</span>;
          }
          return (
            <span key={`b-${part.blankId}`} className="inline-flex items-center mx-1">
              <input
                type="text"
                className="w-28 border-b-2 border-gray-500 bg-transparent px-2 py-0.5 text-center focus:border-blue-600 focus:outline-none"
                value={part.blankId ? answers[part.blankId] ?? '' : ''}
                onChange={(e) => part.blankId && handleChange(part.blankId, e.target.value)}
                placeholder="_____"
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
