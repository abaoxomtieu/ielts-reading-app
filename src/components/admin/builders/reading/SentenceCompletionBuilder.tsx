'use client';

import React, { useEffect, useState } from 'react';
import type { SentenceCompletionQuestion, SentenceCompletionItem, AnswerKey } from '@/types';

interface Props {
  question: SentenceCompletionQuestion;
  onChange: (next: SentenceCompletionQuestion) => void;
}

export default function SentenceCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [sentences, setSentences] = useState<SentenceCompletionItem[]>(
    question.content.sentences?.length
      ? question.content.sentences
      : [
          {
            id: 1,
            text: 'The history of [______] is very long.',
            answer: '',
            blankPosition: 'middle',
          },
        ],
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    const normalized = sentences.map((s, idx) => {
      const id = question.meta.questionNumber + idx;
      if (s.answer) {
        answerKey[String(id)] = s.answer;
      }
      return {
        ...s,
        id,
      };
    });

    const nextContent: SentenceCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      sentences: normalized,
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, sentences, onChange]);

  const addSentence = () => {
    const nextId = sentences.length > 0 ? Math.max(...sentences.map((s) => s.id)) + 1 : 1;
    setSentences([
      ...sentences,
      {
        id: nextId,
        text: `New sentence ${nextId} with [______]`,
        answer: '',
        blankPosition: 'middle',
      },
    ]);
  };

  const updateSentence = (id: number, updates: Partial<SentenceCompletionItem>) => {
    setSentences((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeSentence = (id: number) => {
    setSentences((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Sentence Completion Settings
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
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Sentences
        </h3>
        <div className="space-y-3">
          {sentences.map((s, idx) => (
            <div
              key={s.id}
              className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative"
            >
              <button
                type="button"
                onClick={() => removeSentence(s.id)}
                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
              <div className="text-xs font-semibold text-gray-500 mb-1">Item {idx + 1}</div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Sentence text (use [______] for blank)
                </label>
                <textarea
                  value={s.text}
                  onChange={(e) => updateSentence(s.id, { text: e.target.value })}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Answer
                  </label>
                  <input
                    value={s.answer}
                    onChange={(e) => updateSentence(s.id, { answer: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Blank position
                  </label>
                  <select
                    value={s.blankPosition ?? 'middle'}
                    onChange={(e) =>
                      updateSentence(s.id, { blankPosition: e.target.value as any })
                    }
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white"
                  >
                    <option value="start">Start</option>
                    <option value="middle">Middle</option>
                    <option value="end">End</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSentence}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add sentence
          </button>
        </div>
      </div>
    </div>
  );
}

