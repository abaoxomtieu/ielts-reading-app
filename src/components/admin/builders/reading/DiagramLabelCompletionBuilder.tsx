'use client';

import React, { useEffect, useState } from 'react';
import type {
  DiagramLabelCompletionQuestion,
  DiagramLabelItem,
  AnswerKey,
} from '@/types';

interface Props {
  question: DiagramLabelCompletionQuestion;
  onChange: (next: DiagramLabelCompletionQuestion) => void;
}

export default function DiagramLabelCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [imageUrl, setImageUrl] = useState<string>(question.content.imageUrl || '');
  const [imageAlt, setImageAlt] = useState<string>(question.content.imageAlt || '');
  const [labels, setLabels] = useState<DiagramLabelItem[]>(
    question.content.labels?.length
      ? question.content.labels
      : [
          {
            id: 1,
            label: 'Label 1',
            answer: '',
          },
        ],
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    const normalizedLabels = labels.map((l, idx) => {
      const id = l.id ?? idx + 1;
      if (l.answer) {
        answerKey[String(id)] = l.answer;
      }
      return {
        ...l,
        id,
      };
    });

    const nextContent: DiagramLabelCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      imageUrl: imageUrl || undefined,
      imageAlt: imageAlt || undefined,
      labels: normalizedLabels,
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, imageUrl, imageAlt, labels, onChange]);

  const addLabel = () => {
    const nextId = labels.length > 0 ? Math.max(...labels.map((l) => l.id)) + 1 : 1;
    setLabels((prev) => [
      ...prev,
      {
        id: nextId,
        label: `Label ${nextId}`,
        answer: '',
      },
    ]);
  };

  const updateLabel = (id: number, updates: Partial<DiagramLabelItem>) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const removeLabel = (id: number) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Diagram Label Completion Settings
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Image URL
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="/images/diagram.png"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Image alt text
            </label>
            <input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Labels
        </h3>
        <div className="space-y-2">
          {labels.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start border border-gray-200 rounded-lg p-2 bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => removeLabel(item.id)}
                className="absolute top-1 right-1 text-[10px] text-red-500 hover:text-red-700"
              >
                X
              </button>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  ID
                </label>
                <input
                  type="number"
                  value={item.id}
                  onChange={(e) =>
                    updateLabel(item.id, { id: Number(e.target.value) || item.id })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  Label text
                </label>
                <input
                  value={item.label}
                  onChange={(e) => updateLabel(item.id, { label: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  Answer
                </label>
                <input
                  value={item.answer}
                  onChange={(e) => updateLabel(item.id, { answer: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addLabel}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add label
          </button>
        </div>
      </div>
    </div>
  );
}

