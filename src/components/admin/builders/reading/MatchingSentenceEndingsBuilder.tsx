'use client';

import React, { useEffect, useState } from 'react';
import type {
  MatchingSentenceEndingsQuestion,
  SentenceEndingStart,
  SentenceEndingOption,
  AnswerKey,
} from '@/types';

interface Props {
  question: MatchingSentenceEndingsQuestion;
  onChange: (next: MatchingSentenceEndingsQuestion) => void;
}

export default function MatchingSentenceEndingsBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [starts, setStarts] = useState<SentenceEndingStart[]>(
    question.content.sentenceStarts?.length
      ? question.content.sentenceStarts
      : [{ id: 1, text: 'Sentence start 1' }],
  );
  const [endings, setEndings] = useState<SentenceEndingOption[]>(
    question.content.endings?.length
      ? question.content.endings
      : [
          { id: 'A', text: 'Ending A' },
          { id: 'B', text: 'Ending B' },
        ],
  );
  const [matches, setMatches] = useState<Record<number, string>>({});

  useEffect(() => {
    const nextContent: MatchingSentenceEndingsQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      sentenceStarts: starts,
      endings,
    };

    const answerKey: AnswerKey = {};
    starts.forEach((s, idx) => {
      const qNum = question.meta.questionNumber + idx;
      const endingId = matches[s.id];
      if (endingId) {
        answerKey[String(qNum)] = endingId;
      }
    });

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, starts, endings, matches, onChange]);

  const addStart = () => {
    const nextId = starts.length > 0 ? Math.max(...starts.map((s) => s.id)) + 1 : 1;
    setStarts([...starts, { id: nextId, text: `Sentence start ${nextId}` }]);
  };

  const updateStartText = (id: number, text: string) => {
    setStarts((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const removeStart = (id: number) => {
    setStarts((prev) => prev.filter((s) => s.id !== id));
    setMatches((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addEnding = () => {
    const nextLetter = String.fromCharCode(65 + endings.length);
    setEndings([...endings, { id: nextLetter, text: `Ending ${nextLetter}` }]);
  };

  const updateEndingText = (id: string, text: string) => {
    setEndings((prev) => prev.map((e) => (e.id === id ? { ...e, text } : e)));
  };

  const removeEnding = (id: string) => {
    setEndings((prev) => prev.filter((e) => e.id !== id));
    setMatches((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([sid, endId]) => {
        if (endId !== id) next[Number(sid)] = endId;
      });
      return next;
    });
  };

  const setMatch = (startId: number, endingId: string) => {
    setMatches((prev) => ({ ...prev, [startId]: endingId }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Matching Sentence Endings Settings
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
            Sentence starts
          </h3>
          <div className="space-y-3">
            {starts.map((s, idx) => {
              const current = matches[s.id] ?? '';
              return (
                <div
                  key={s.id}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeStart(s.id)}
                    className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Item {idx + 1}</div>
                  <textarea
                    value={s.text}
                    onChange={(e) => updateStartText(s.id, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Ending
                    </span>
                    <select
                      value={current}
                      onChange={(e) => setMatch(s.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">— Select —</option>
                      {endings.map((end) => (
                        <option key={end.id} value={end.id}>
                          {end.id}: {end.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addStart}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add sentence start
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
            Endings
          </h3>
          <div className="space-y-2">
            {endings.map((end) => (
              <div key={end.id} className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded">
                  {end.id}
                </span>
                <input
                  value={end.text}
                  onChange={(e) => updateEndingText(end.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeEnding(end.id)}
                  className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEnding}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add ending
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

