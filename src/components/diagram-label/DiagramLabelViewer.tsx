'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { DiagramLabelCompletionQuestion } from '@/types';

interface Props {
  data: DiagramLabelCompletionQuestion;
}

export default function DiagramLabelViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const labels = content.labels || [];
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';

  const handleChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
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
      {content.imageUrl && (
        <div className="mb-6 flex justify-center relative w-full min-h-[200px]">
          <Image
            src={content.imageUrl}
            alt={content.imageAlt ?? 'Diagram'}
            width={600}
            height={400}
            className="max-w-full h-auto border border-gray-300 rounded object-contain"
            unoptimized
          />
        </div>
      )}
      <div className="space-y-4">
        {labels.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-4">
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-full text-sm font-bold text-gray-700">
              {item.id}
            </span>
            <span className="text-gray-700">{item.label}</span>
            <input
              type="text"
              className="flex-1 max-w-xs border-b-2 border-gray-500 bg-transparent px-2 py-1 focus:border-blue-600 focus:outline-none text-gray-900"
              value={answers[item.id] ?? ''}
              onChange={(e) => handleChange(item.id, e.target.value)}
              placeholder="_____"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
