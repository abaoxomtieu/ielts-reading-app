'use client';

import React, { useEffect, useState } from 'react';
import type {
  MatchingHeadingsQuestion,
  MatchingHeadingItem,
  AnswerKey,
} from '@/types';

interface Props {
  question: MatchingHeadingsQuestion;
  onChange: (next: MatchingHeadingsQuestion) => void;
}

export default function MatchingHeadingsBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [headings, setHeadings] = useState<MatchingHeadingItem[]>(
    question.content.headings?.length
      ? question.content.headings
      : [
          { id: 'i', text: 'Heading i' },
          { id: 'ii', text: 'Heading ii' },
        ],
  );
  const [paragraphLabels, setParagraphLabels] = useState<string[]>(
    question.content.paragraphLabels?.length
      ? question.content.paragraphLabels
      : ['A', 'B', 'C'],
  );
  const [matches, setMatches] = useState<Record<string, string>>({});

  useEffect(() => {
    const nextContent: MatchingHeadingsQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      headings,
      paragraphLabels,
    };

    const answerKey: AnswerKey = {};
    paragraphLabels.forEach((label) => {
      const headingId = matches[label];
      if (headingId) {
        answerKey[label] = headingId;
      }
    });

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, headings, paragraphLabels, matches, onChange]);

  const addHeading = () => {
    const nextIndex = headings.length + 1;
    const id = `${'i'.repeat(nextIndex)}`;
    setHeadings([...headings, { id, text: `Heading ${id}` }]);
  };

  const updateHeadingText = (id: string, text: string) => {
    setHeadings((prev) => prev.map((h) => (h.id === id ? { ...h, text } : h)));
  };

  const removeHeading = (id: string) => {
    setHeadings((prev) => prev.filter((h) => h.id !== id));
    setMatches((prev) => {
      const next: Record<string, string> = {};
      Object.entries(prev).forEach(([label, hId]) => {
        if (hId !== id) next[label] = hId;
      });
      return next;
    });
  };

  const addParagraphLabel = () => {
    const nextLetter = String.fromCharCode(65 + paragraphLabels.length);
    setParagraphLabels([...paragraphLabels, nextLetter]);
  };

  const updateParagraphLabel = (index: number, value: string) => {
    setParagraphLabels((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const removeParagraphLabel = (index: number) => {
    const label = paragraphLabels[index];
    setParagraphLabels((prev) => prev.filter((_, i) => i !== index));
    setMatches((prev) => {
      const next = { ...prev };
      delete next[label];
      return next;
    });
  };

  const setMatch = (label: string, headingId: string) => {
    setMatches((prev) => ({ ...prev, [label]: headingId }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Matching Headings Settings
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
            Headings
          </h3>
          <div className="space-y-2">
            {headings.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded">
                  {h.id}
                </span>
                <input
                  value={h.text}
                  onChange={(e) => updateHeadingText(h.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeHeading(h.id)}
                  className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHeading}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add heading
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
            Paragraph labels & matches
          </h3>
          <div className="space-y-2">
            {paragraphLabels.map((label, idx) => {
              const current = matches[label] ?? '';
              return (
                <div key={`${label}-${idx}`} className="flex items-center gap-2">
                  <input
                    value={label}
                    onChange={(e) => updateParagraphLabel(idx, e.target.value)}
                    className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={current}
                    onChange={(e) => setMatch(label, e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                  >
                    <option value="">— Heading —</option>
                    {headings.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.id}: {h.text}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeParagraphLabel(idx)}
                    className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addParagraphLabel}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add paragraph label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

