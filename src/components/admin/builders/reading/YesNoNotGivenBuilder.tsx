'use client';

import React, { useEffect, useState } from 'react';
import type { YesNoNotGivenQuestion, YesNoStatement, AnswerKey } from '@/types';

interface Props {
  question: YesNoNotGivenQuestion;
  onChange: (next: YesNoNotGivenQuestion) => void;
}

type YNNValue = 'yes' | 'no' | 'not_given';

export default function YesNoNotGivenBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [statements, setStatements] = useState<YesNoStatement[]>(
    question.content.statements?.length
      ? question.content.statements
      : [{ id: 1, text: 'Sample statement 1.' }],
  );
  const [answers, setAnswers] = useState<Record<number, YNNValue>>({});

  useEffect(() => {
    const nextContent: YesNoNotGivenQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      statements,
    };

    const answerKey: AnswerKey = {};
    statements.forEach((s, idx) => {
      const qNum = question.meta.questionNumber + idx;
      const value = answers[s.id];
      if (value) {
        answerKey[String(qNum)] = value;
      }
    });

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, statements, answers, onChange]);

  const addStatement = () => {
    const nextId = statements.length > 0 ? Math.max(...statements.map((s) => s.id)) + 1 : 1;
    setStatements([...statements, { id: nextId, text: `New statement ${nextId}` }]);
  };

  const updateStatementText = (id: number, text: string) => {
    setStatements((prev) => prev.map((s) => (s.id === id ? { ...s, text } : s)));
  };

  const removeStatement = (id: number) => {
    setStatements((prev) => prev.filter((s) => s.id !== id));
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setAnswer = (id: number, value: YNNValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Yes / No / Not given
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

      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Statements
        </h3>
        <div className="space-y-3">
          {statements.map((s, idx) => (
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
                <span className="text-xs font-semibold text-gray-600 uppercase">Answer</span>
                <select
                  value={answers[s.id] ?? ''}
                  onChange={(e) => setAnswer(s.id, e.target.value as YNNValue)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-white"
                >
                  <option value="">— Select —</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not_given">Not Given</option>
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addStatement}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add statement
          </button>
        </div>
      </div>
    </div>
  );
}

