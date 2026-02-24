'use client';

import React, { useState } from 'react';
import type { MatchingInformationQuestion } from '@/types';

interface Props {
  data: MatchingInformationQuestion;
  passageText?: string;
}

export default function MatchingInformationViewer({ data, passageText }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const statements = content.statements || [];
  const paragraphLabels = content.paragraphLabels || ['A', 'B', 'C', 'D', 'E'];

  const handleChange = (statementId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [statementId]: value }));
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
      {passageText && (
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
          {passageText}
        </div>
      )}
      <div className="space-y-4">
        {statements.map((st) => (
          <div key={st.id} className="flex flex-wrap items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
              {st.id}
            </span>
            <span className="flex-1 min-w-0 text-gray-900">{st.text}</span>
            <select
              value={answers[st.id] ?? ''}
              onChange={(e) => handleChange(st.id, e.target.value)}
              className="border-2 border-gray-300 rounded px-3 py-1.5 text-sm font-medium min-w-[4rem]"
            >
              <option value="">—</option>
              {paragraphLabels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
