'use client';

import React, { useState } from 'react';
import type { MultipleChoiceQuestion } from '@/types';

interface Props {
  data: MultipleChoiceQuestion;
}

export default function MultipleChoiceViewer({ data }: Props) {
  const { meta, content } = data;
  const [selected, setSelected] = useState<string | string[]>(
    meta.variant === 'multiple_answers' ? [] : ''
  );
  const isMultiple = meta.variant === 'multiple_answers';
  const options = content.options || [];
  const maxSelectable = content.validation?.minCorrectRequired ?? 2;

  const handleSingle = (optionId: string) => {
    setSelected(optionId);
  };

  const handleMultiple = (optionId: string) => {
    setSelected((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(optionId)) return arr.filter((id) => id !== optionId);
      if (arr.length >= maxSelectable) return arr;
      return [...arr, optionId];
    });
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
      <div className="space-y-3">
        {options.map((opt, i) => {
          const isSelectedSingle = !isMultiple && selected === opt.id;
          const isSelectedMulti = isMultiple && Array.isArray(selected) && selected.includes(opt.id);
          const isSelected = isMultiple ? isSelectedMulti : isSelectedSingle;
          return (
            <label key={opt.id} className="block cursor-pointer">
              <div
                className={`w-full flex items-start p-4 border-2 rounded-lg transition-all ${
                  isSelected ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-gray-500 bg-white'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type={isMultiple ? 'checkbox' : 'radio'}
                    name="mc"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => (isMultiple ? handleMultiple(opt.id) : handleSingle(opt.id))}
                    className="w-5 h-5"
                  />
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold rounded-md bg-gray-200 text-black text-sm">
                    {letter(i)}
                  </span>
                  <span className="text-base text-black flex-1">{opt.text}</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
