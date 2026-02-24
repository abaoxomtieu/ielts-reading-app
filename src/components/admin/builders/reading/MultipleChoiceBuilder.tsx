'use client';

import React, { useEffect, useState } from 'react';
import type { MultipleChoiceOption, MultipleChoiceQuestion } from '@/types';
import type { AnswerKey } from '@/types';

interface Props {
  question: MultipleChoiceQuestion;
  onChange: (next: MultipleChoiceQuestion) => void;
}

export default function ReadingMultipleChoiceBuilder({ question, onChange }: Props) {
  const isMultiple = question.meta.variant === 'multiple_answers';

  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [options, setOptions] = useState<MultipleChoiceOption[]>(
    question.content.options?.length
      ? question.content.options
      : [
          { id: 'A', text: 'Option A' },
          { id: 'B', text: 'Option B' },
          { id: 'C', text: 'Option C' },
        ],
  );
  const [correctOption, setCorrectOption] = useState<string>(question.content.answer.correctOption || '');
  const [correctOptions, setCorrectOptions] = useState<string[]>(
    question.content.answer.correctOptions || [],
  );
  const [explanation, setExplanation] = useState<string>(
    question.content.answer.explanation || '',
  );
  const [maxSelectable, setMaxSelectable] = useState<number>(
    question.content.validation?.minCorrectRequired ?? 2,
  );

  useEffect(() => {
    const answer = isMultiple
      ? { correctOptions, explanation }
      : { correctOption, explanation };

    const nextContent = {
      ...question.content,
      questionText,
      instructions: instructions || undefined,
      options,
      answer,
      uiHints: {
        ...(question.content.uiHints ?? {}),
        displayType: isMultiple ? 'checkbox' : 'radio',
        maxSelectable: isMultiple ? maxSelectable : undefined,
      },
      validation: {
        ...(question.content.validation ?? {}),
        minCorrectRequired: isMultiple ? maxSelectable : undefined,
      },
    };

    const answerKey: AnswerKey = {};
    answerKey[String(question.meta.questionNumber)] = isMultiple ? correctOptions : correctOption;

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [
    question,
    isMultiple,
    questionText,
    instructions,
    options,
    correctOption,
    correctOptions,
    explanation,
    maxSelectable,
    onChange,
  ]);

  const addOption = () => {
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: nextLetter, text: `Option ${nextLetter}` }]);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter((o) => o.id !== id));
    if (isMultiple) {
      setCorrectOptions((prev) => prev.filter((opt) => opt !== id));
    } else if (correctOption === id) {
      setCorrectOption('');
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const toggleCorrectOption = (id: string) => {
    if (isMultiple) {
      setCorrectOptions((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    } else {
      setCorrectOption(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Multiple Choice Settings (Common)
        </h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Question Text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Choose ONE letter"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[40px]"
          />
        </div>
        {isMultiple && (
          <div className="mt-2">
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Max selectable
            </label>
            <input
              type="number"
              value={String(maxSelectable)}
              onChange={(e) => setMaxSelectable(Number(e.target.value) || 1)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Options
        </h3>
        <div className="space-y-4">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="flex gap-2 items-center p-3 border rounded bg-gray-50 border-gray-200"
            >
              <span className="font-bold text-blue-600 w-6">{opt.id}</span>
              <input
                className="flex-1 border p-2 rounded text-black"
                value={opt.text}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                placeholder="Option text..."
              />
              <label className="flex items-center gap-1 shrink-0">
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={isMultiple ? undefined : 'correct'}
                  checked={isMultiple ? correctOptions.includes(opt.id) : correctOption === opt.id}
                  onChange={() => toggleCorrectOption(opt.id)}
                />
                <span className="text-xs font-bold text-gray-600">Correct</span>
              </label>
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            + Add Option
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Explanation
        </h3>
        <textarea
          className="w-full border border-gray-300 p-3 rounded text-black min-h-[80px]"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explanation for the correct answer(s)..."
        />
      </div>
    </div>
  );
}

