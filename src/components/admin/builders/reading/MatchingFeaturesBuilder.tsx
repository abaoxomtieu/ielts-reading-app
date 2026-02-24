'use client';

import React, { useEffect, useState } from 'react';
import type {
  MatchingFeaturesQuestion,
  MatchingFeaturesStatement,
  MatchingFeaturesOption,
  AnswerKey,
} from '@/types';

interface Props {
  question: MatchingFeaturesQuestion;
  onChange: (next: MatchingFeaturesQuestion) => void;
}

export default function MatchingFeaturesBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [statements, setStatements] = useState<MatchingFeaturesStatement[]>(
    question.content.statements?.length
      ? question.content.statements
      : [{ id: 1, text: 'Sample statement 1' }],
  );
  const [options, setOptions] = useState<MatchingFeaturesOption[]>(
    question.content.options?.length
      ? question.content.options
      : [
          { id: 'A', text: 'Option A' },
          { id: 'B', text: 'Option B' },
        ],
  );
  const [allowReuse, setAllowReuse] = useState<boolean>(question.content.allowReuse ?? false);
  const [matches, setMatches] = useState<Record<number, string>>({});

  useEffect(() => {
    const nextContent: MatchingFeaturesQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      statements,
      options,
      allowReuse,
    };

    const answerKey: AnswerKey = {};
    statements.forEach((s, idx) => {
      const qNum = question.meta.questionNumber + idx;
      const opt = matches[s.id];
      if (opt) {
        answerKey[String(qNum)] = opt;
      }
    });

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, statements, options, allowReuse, matches, onChange]);

  const addStatement = () => {
    const nextId = statements.length > 0 ? Math.max(...statements.map((s) => s.id)) + 1 : 1;
    setStatements([...statements, { id: nextId, text: `New statement ${nextId}` }]);
  };

  const updateStatementText = (id: number, text: string) => {
    setStatements((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const removeStatement = (id: number) => {
    setStatements((prev) => prev.filter((s) => s.id !== id));
    setMatches((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const addOption = () => {
    const nextLetter = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: nextLetter, text: `Option ${nextLetter}` }]);
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setMatches((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([sid, opt]) => {
        if (opt !== id) next[Number(sid)] = opt;
      });
      return next;
    });
  };

  const setMatch = (statementId: number, optionId: string) => {
    setMatches((prev) => ({ ...prev, [statementId]: optionId }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Matching Features Settings
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
        <div className="flex items-center gap-2">
          <input
            id="allowReuse"
            type="checkbox"
            checked={allowReuse}
            onChange={(e) => setAllowReuse(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="allowReuse" className="text-xs font-semibold text-gray-700">
            Allow reuse of options
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
            Statements
          </h3>
          <div className="space-y-3">
            {statements.map((s, idx) => {
              const current = matches[s.id] ?? '';
              return (
                <div
                  key={s.id}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeStatement(s.id)}
                    className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                  <div className="text-xs font-semibold text-gray-500 mb-1">Item {idx + 1}</div>
                  <textarea
                    value={s.text}
                    onChange={(e) => updateStatementText(s.id, e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      Option
                    </span>
                    <select
                      value={current}
                      onChange={(e) => setMatch(s.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">— Select —</option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.id}: {opt.text}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addStatement}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add statement
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
            Options
          </h3>
          <div className="space-y-2">
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded">
                  {opt.id}
                </span>
                <input
                  value={opt.text}
                  onChange={(e) => updateOptionText(opt.id, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeOption(opt.id)}
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
    </div>
  );
}

