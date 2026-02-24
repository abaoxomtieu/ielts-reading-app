'use client';

import React, { useEffect, useState } from 'react';
import type {
  NoteCompletionQuestion,
  NoteSection,
  NoteBulletPoint,
  AnswerKey,
} from '@/types';
import PassageHtmlEditor from '@/components/admin/PassageHtmlEditor';

interface Props {
  question: NoteCompletionQuestion;
  onChange: (next: NoteCompletionQuestion) => void;
}

export default function NoteCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [title, setTitle] = useState<string>(question.content.notes?.title || '');
  const [sections, setSections] = useState<NoteSection[]>(
    question.content.notes?.sections?.length ? question.content.notes.sections : [],
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    let counter = question.meta.questionNumber;

    const normalizedSections = sections.map((section) => ({
      ...section,
      bulletPoints: section.bulletPoints.map((bp) => {
        const id = counter++;
        if (bp.answer) {
          answerKey[String(id)] = bp.answer;
        }
        return {
          ...bp,
          id,
        };
      }),
    }));

    const nextContent: NoteCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      notes: {
        title,
        sections: normalizedSections,
      },
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, title, sections, onChange]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: 'New section',
        bulletPoints: [],
      },
    ]);
  };

  const updateSectionHeading = (index: number, heading: string) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, heading } : s)));
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const addBulletPoint = (sectionIndex: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              bulletPoints: [
                ...s.bulletPoints,
                { id: Date.now(), text: 'New point with [______]', answer: '' } as NoteBulletPoint,
              ],
            }
          : s,
      ),
    );
  };

  const updateBulletPoint = (
    sectionIndex: number,
    bulletIndex: number,
    updates: Partial<NoteBulletPoint>,
  ) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              bulletPoints: s.bulletPoints.map((bp, j) =>
                j === bulletIndex ? { ...bp, ...updates } : bp,
              ),
            }
          : s,
      ),
    );
  };

  const removeBulletPoint = (sectionIndex: number, bulletIndex: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? {
              ...s,
              bulletPoints: s.bulletPoints.filter((_, j) => j !== bulletIndex),
            }
          : s,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Note Completion Settings
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
          Notes structure
        </h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Notes title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-3">
          {sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-3 relative"
            >
              <button
                type="button"
                onClick={() => removeSection(sIdx)}
                className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove section
              </button>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Section heading
                </label>
                <input
                  value={section.heading}
                  onChange={(e) => updateSectionHeading(sIdx, e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div className="space-y-2 pl-2 border-l-2 border-blue-100">
                {section.bulletPoints.map((bp, bpIdx) => (
                  <div
                    key={bpIdx}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start bg-white border border-gray-200 rounded-lg p-2 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeBulletPoint(sIdx, bpIdx)}
                      className="absolute top-1 right-1 text-[10px] text-red-500 hover:text-red-700"
                    >
                      X
                    </button>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Text (use [______] for blank)
                      </label>
                      <textarea
                        value={bp.text}
                        onChange={(e) =>
                          updateBulletPoint(sIdx, bpIdx, { text: e.target.value })
                        }
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Answer
                      </label>
                      <input
                        value={bp.answer}
                        onChange={(e) =>
                          updateBulletPoint(sIdx, bpIdx, { answer: e.target.value })
                        }
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBulletPoint(sIdx)}
                  className="px-2 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            + Add section
          </button>
        </div>
      </div>
    </div>
  );
}

