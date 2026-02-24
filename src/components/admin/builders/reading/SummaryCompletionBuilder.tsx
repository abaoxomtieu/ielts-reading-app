'use client';

import React, { useEffect, useState } from 'react';
import type {
  SummaryCompletionQuestion,
  SummaryBlank,
  SummaryOption,
  AnswerKey,
} from '@/types';

interface Props {
  question: SummaryCompletionQuestion;
  onChange: (next: SummaryCompletionQuestion) => void;
}

export default function SummaryCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [summaryText, setSummaryText] = useState<string>(question.content.summary?.text || '');
  const [blanks, setBlanks] = useState<SummaryBlank[]>(
    question.content.summary?.blanks?.length ? question.content.summary.blanks : [],
  );
  const [options, setOptions] = useState<SummaryOption[]>(
    question.content.options?.length ? question.content.options : [],
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    const normalizedBlanks = blanks.map((b, idx) => {
      const id = b.id ?? idx + 1;
      if (b.answer) {
        answerKey[String(id)] = b.answer;
      }
      return {
        ...b,
        id,
      };
    });

    const nextContent: SummaryCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      summary: {
        text: summaryText,
        blanks: normalizedBlanks,
      },
      options,
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, summaryText, blanks, options, onChange]);

  const addBlank = () => {
    const nextId = blanks.length > 0 ? Math.max(...blanks.map((b) => b.id)) + 1 : 1;
    setBlanks([
      ...blanks,
      {
        id: nextId,
        position: summaryText.length,
        answer: '',
      },
    ]);
  };

  const updateBlank = (id: number, updates: Partial<SummaryBlank>) => {
    setBlanks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const removeBlank = (id: number) => {
    setBlanks((prev) => prev.filter((b) => b.id !== id));
  };

  const addOption = () => {
    const nextId = options.length > 0 ? `O${options.length + 1}` : 'O1';
    setOptions([...options, { id: nextId, text: `Option ${nextId}` }]);
  };

  const updateOption = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Summary Completion Settings
        </h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Question text
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[40px]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Word limit
          </label>
          <input
            value={wordLimit}
            onChange={(e) => setWordLimit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">Summary</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Summary text
          </label>
          <textarea
            value={summaryText}
            onChange={(e) => setSummaryText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase">Blanks</span>
            <button
              type="button"
              onClick={addBlank}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              + Add blank
            </button>
          </div>
          {blanks.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center border border-gray-200 rounded-lg p-2 bg-gray-50"
            >
              <div className="text-xs font-semibold text-gray-600">Blank #{b.id}</div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  Position (index in text)
                </label>
                <input
                  type="number"
                  value={b.position}
                  onChange={(e) =>
                    updateBlank(b.id, { position: Number(e.target.value) || 0 })
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  Answer
                </label>
                <input
                  value={b.answer}
                  onChange={(e) => updateBlank(b.id, { answer: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => removeBlank(b.id)}
                className="mt-1 md:mt-0 px-2 py-1 text-xs text-red-500 hover:text-red-700 md:col-span-3 text-right"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Options (optional)
        </h3>
        <div className="space-y-2">
          {options.map((o) => (
            <div key={o.id} className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded">
                {o.id}
              </span>
              <input
                value={o.text}
                onChange={(e) => updateOption(o.id, e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
              />
              <button
                type="button"
                onClick={() => removeOption(o.id)}
                className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add option
          </button>
        </div>
      </div>
    </div>
  );
}

