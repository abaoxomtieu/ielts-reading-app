'use client';

import React, { useState } from 'react';
import type { MatchingSentenceEndingsQuestion } from '@/types';

interface Props {
  data: MatchingSentenceEndingsQuestion;
}

export default function MatchingSentenceEndingsViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const starts = content.sentenceStarts || [];
  const endings = content.endings || [];

  const handleChange = (startId: number, endingId: string) => {
    setAnswers((prev) => ({ ...prev, [startId]: endingId }));
  };

  const letter = (i: number) => String.fromCharCode(65 + i);

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
      <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200 text-sm">
        <span className="font-semibold text-gray-800">Sentence endings: </span>
        {endings.map((e, i) => (
          <span key={e.id} className="mr-2">
            <strong>{letter(i)}</strong> {e.text}
          </span>
        ))}
      </div>
      <div className="space-y-4">
        {starts.map((st, idx) => (
          <div key={st.id} className="flex flex-wrap items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
              {idx + 1}
            </span>
            <span className="flex-1 min-w-0 text-gray-900">{st.text}</span>
            <select
              value={answers[st.id] ?? ''}
              onChange={(e) => handleChange(st.id, e.target.value)}
              className="border-2 border-gray-300 rounded px-3 py-1.5 text-sm font-medium min-w-[4rem]"
            >
              <option value="">—</option>
              {endings.map((e, i) => (
                <option key={e.id} value={e.id}>
                  {letter(i)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
