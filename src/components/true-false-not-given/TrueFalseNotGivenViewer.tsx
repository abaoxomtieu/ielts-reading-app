'use client';

import React, { useState } from 'react';
import type { TrueFalseNotGivenQuestion } from '@/types';

interface Props {
  data: TrueFalseNotGivenQuestion;
}

const OPTIONS = ['True', 'False', 'Not given'] as const;

export default function TrueFalseNotGivenViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const statements = content.statements || [];

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
      <div className="space-y-4">
        {statements.map((st) => (
          <div key={st.id} className="flex flex-wrap items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
              {st.id}
            </span>
            <span className="flex-1 min-w-0 text-gray-900">{st.text}</span>
            <div className="flex gap-2 flex-shrink-0">
              {OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`tfn-${st.id}`}
                    value={opt}
                    checked={answers[st.id] === opt}
                    onChange={() => handleChange(st.id, opt)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
