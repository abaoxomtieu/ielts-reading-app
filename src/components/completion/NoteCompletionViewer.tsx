'use client';

import React, { useState } from 'react';
import type { NoteCompletionQuestion } from '@/types';

interface Props {
  data: NoteCompletionQuestion;
}

export default function NoteCompletionViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const notes = content.notes;
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const renderTextWithInput = (text: string, bulletId: number) => {
    const parts = text.split('[______]');
    return (
      <div className="inline-flex items-center flex-wrap gap-1">
        <span className="text-gray-900">{parts[0]}</span>
        <input
          type="text"
          className="inline-block w-32 border-b-2 border-gray-500 bg-transparent px-2 py-0.5 focus:border-blue-600 focus:outline-none text-gray-900 text-center"
          value={answers[bulletId] ?? ''}
          onChange={(e) => handleChange(bulletId, e.target.value)}
          placeholder="_____"
        />
        {parts[1] && <span className="text-gray-900">{parts[1]}</span>}
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
      {notes?.title && <h3 className="text-lg font-bold text-gray-800 mb-4">{notes.title}</h3>}
      <div className="space-y-6">
        {notes?.sections?.map((section) => (
          <div key={section.heading}>
            <h4 className="text-sm font-bold text-gray-800 mb-2">{section.heading}</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-900">
              {section.bulletPoints.map((bp) => (
                <li key={bp.id}>{renderTextWithInput(bp.text, bp.id)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
