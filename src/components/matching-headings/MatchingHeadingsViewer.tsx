'use client';

import React, { useState } from 'react';
import type { MatchingHeadingsQuestion } from '@/types';

interface Props {
  data: MatchingHeadingsQuestion;
  passageText?: string;
}

export default function MatchingHeadingsViewer({ data, passageText }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const headings = content.headings || [];
  const paragraphLabels = content.paragraphLabels || ['A', 'B', 'C', 'D', 'E'];

  const handleChange = (paragraphLabel: string, headingId: string) => {
    setAnswers((prev) => ({ ...prev, [paragraphLabel]: headingId }));
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
      <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Headings</h3>
        <ul className="list-none space-y-1 text-sm text-gray-700">
          {headings.map((h) => (
            <li key={h.id}>
              <span className="font-medium">{h.id}</span> {h.text}
            </li>
          ))}
        </ul>
      </div>
      {passageText && (
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
          {passageText}
        </div>
      )}
      <div className="space-y-4">
        {paragraphLabels.map((pLabel) => (
          <div key={pLabel} className="flex flex-wrap items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white font-bold rounded-md text-sm">
              {pLabel}
            </span>
            <span className="text-gray-600 flex-shrink-0">Paragraph {pLabel}</span>
            <select
              value={answers[pLabel] ?? ''}
              onChange={(e) => handleChange(pLabel, e.target.value)}
              className="border-2 border-gray-300 rounded px-3 py-1.5 text-sm font-medium min-w-[6rem]"
            >
              <option value="">—</option>
              {headings.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.id}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
