'use client';

import React, { useEffect, useState } from 'react';
import type {
  MatchingInformationQuestion,
  MatchingInfoStatement,
  AnswerKey,
} from '@/types';

interface Props {
  question: MatchingInformationQuestion;
  onChange: (next: MatchingInformationQuestion) => void;
}

export default function MatchingInformationBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [statements, setStatements] = useState<MatchingInfoStatement[]>(
    question.content.statements?.length
      ? question.content.statements
      : [{ id: 1, text: 'Sample statement 1' }],
  );
  const [paragraphLabels, setParagraphLabels] = useState<string[]>(
    question.content.paragraphLabels?.length
      ? question.content.paragraphLabels
      : ['A', 'B', 'C'],
  );
  const [matches, setMatches] = useState<Record<number, string>>({});

  useEffect(() => {
    const nextContent: MatchingInformationQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      statements,
      paragraphLabels,
    };

    const answerKey: AnswerKey = {};
    statements.forEach((s, idx) => {
      const qNum = question.meta.questionNumber + idx;
      const label = matches[s.id];
      if (label) {
        answerKey[String(qNum)] = label;
      }
    });

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, statements, paragraphLabels, matches, onChange]);

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

  const addParagraphLabel = () => {
    const nextLetter = String.fromCharCode(65 + paragraphLabels.length);
    setParagraphLabels([...paragraphLabels, nextLetter]);
  };

  const updateParagraphLabel = (index: number, value: string) => {
    setParagraphLabels((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const removeParagraphLabel = (index: number) => {
    const value = paragraphLabels[index];
    setParagraphLabels((prev) => prev.filter((_, i) => i !== index));
    setMatches((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([sid, label]) => {
        if (label !== value) {
          next[Number(sid)] = label;
        }
      });
      return next;
    });
  };

  const setMatch = (statementId: number, label: string) => {
    setMatches((prev) => ({ ...prev, [statementId]: label }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Matching Information Settings
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
                      Paragraph
                    </span>
                    <select
                      value={current}
                      onChange={(e) => setMatch(s.id, e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white"
                    >
                      <option value="">— Select —</option>
                      {paragraphLabels.map((label) => (
                        <option key={label} value={label}>
                          {label}
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
            Paragraph labels
          </h3>
          <div className="space-y-2">
            {paragraphLabels.map((label, idx) => (
              <div key={`${label}-${idx}`} className="flex items-center gap-2">
                <input
                  value={label}
                  onChange={(e) => updateParagraphLabel(idx, e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeParagraphLabel(idx)}
                  className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addParagraphLabel}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              + Add label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

