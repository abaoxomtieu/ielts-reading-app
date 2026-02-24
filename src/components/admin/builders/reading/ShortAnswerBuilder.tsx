'use client';

import React, { useEffect, useState } from 'react';
import type { ShortAnswerQuestion, ShortAnswerItem, AnswerKey } from '@/types';

interface Props {
  question: ShortAnswerQuestion;
  onChange: (next: ShortAnswerQuestion) => void;
}

export default function ShortAnswerBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [items, setItems] = useState<ShortAnswerItem[]>(
    question.content.questions?.length
      ? question.content.questions
      : [
          {
            id: question.meta.questionNumber,
            text: 'Sample short-answer question',
            answer: '',
            alternativeAnswers: [],
          },
        ],
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    const normalizedItems = items.map((item, idx) => {
      const id = question.meta.questionNumber + idx;
      const alternatives = item.alternativeAnswers ?? [];
      if (alternatives.length > 0) {
        answerKey[String(id)] = [item.answer, ...alternatives].filter(Boolean);
      } else if (item.answer) {
        answerKey[String(id)] = item.answer;
      }
      return {
        ...item,
        id,
      };
    });

    const nextContent: ShortAnswerQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      questions: normalizedItems,
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, items, onChange]);

  const addItem = () => {
    const nextId = items.length
      ? Math.max(...items.map((i) => i.id)) + 1
      : question.meta.questionNumber;
    setItems([
      ...items,
      {
        id: nextId,
        text: `Question ${items.length + 1}`,
        answer: '',
        alternativeAnswers: [],
      },
    ]);
  };

  const updateItem = (id: number, updates: Partial<ShortAnswerItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Short Answer Settings
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
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">Questions</h3>
        <div className="space-y-3">
          {items.map((q, idx) => (
            <div
              key={q.id}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative"
            >
              <button
                type="button"
                onClick={() => removeItem(q.id)}
                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              <div className="text-xs font-semibold text-gray-500 mb-1">Item {idx + 1}</div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Prompt
                </label>
                <textarea
                  value={q.text}
                  onChange={(e) => updateItem(q.id, { text: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Answer
                  </label>
                  <input
                    value={q.answer}
                    onChange={(e) => updateItem(q.id, { answer: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Alternative answers (comma separated)
                  </label>
                  <input
                    value={(q.alternativeAnswers ?? []).join(', ')}
                    onChange={(e) =>
                      updateItem(q.id, {
                        alternativeAnswers: e.target.value
                          ? e.target.value.split(',').map((s) => s.trim())
                          : [],
                      })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add question
          </button>
        </div>
      </div>
    </div>
  );
}

