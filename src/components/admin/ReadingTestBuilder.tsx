'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import QuestionRenderer from '@/components/QuestionRenderer';
import ReadingQuestionEditor from '@/components/admin/ReadingQuestionEditor';
import type { IELTSReadingQuestion, IELTSReadingTest } from '@/types';
import PassageHtmlEditor from '@/components/admin/PassageHtmlEditor';
import {
  clearDraft,
  DRAFT_AUTO_SAVE_INTERVAL_MS,
  loadDraft,
  saveDraft,
  type DraftPayload,
} from '@/lib/draft-storage';

type BuilderTab = 'editor' | 'json';

type TemplateItem = {
  id: string;
  title: string;
  filePath: string;
};

const QUESTION_TEMPLATES: TemplateItem[] = [
  {
    id: 'mc-single',
    title: 'Multiple choice (single)',
    filePath: '/data/questionType/multiple-choice/single-answer.example.json',
  },
  {
    id: 'mc-multi',
    title: 'Multiple choice (multiple)',
    filePath: '/data/questionType/multiple-choice/multiple-answers.example.json',
  },
  {
    id: 'tfn',
    title: 'True / False / Not given',
    filePath: '/data/questionType/true-false-not-given/true-false-not-given.example.json',
  },
  {
    id: 'ynn',
    title: 'Yes / No / Not given',
    filePath: '/data/questionType/yes-no-not-given/yes-no-not-given.example.json',
  },
  {
    id: 'mi',
    title: 'Matching information',
    filePath: '/data/questionType/matching-information/matching-information.example.json',
  },
  {
    id: 'mh',
    title: 'Matching headings',
    filePath: '/data/questionType/matching-headings/matching-headings.example.json',
  },
  {
    id: 'mf',
    title: 'Matching features',
    filePath: '/data/questionType/matching-features/matching-features.example.json',
  },
  {
    id: 'mse',
    title: 'Matching sentence endings',
    filePath:
      '/data/questionType/matching-sentence-endings/matching-sentence-endings.example.json',
  },
  {
    id: 'sc',
    title: 'Sentence completion',
    filePath: '/data/questionType/sentence-completion/sentence-completion.example.json',
  },
  {
    id: 'sc-word-list',
    title: 'Sentence completion (word list)',
    filePath: '/data/questionType/sentence-completion/sentence-completion-word-list.example.json',
  },
  {
    id: 'sum',
    title: 'Summary completion',
    filePath: '/data/questionType/completion/summary-completion.example.json',
  },
  {
    id: 'sum-word-list',
    title: 'Summary completion (word list)',
    filePath: '/data/questionType/completion/summary-completion-word-list.example.json',
  },
  {
    id: 'note',
    title: 'Note completion',
    filePath: '/data/questionType/completion/note-completion.example.json',
  },
  {
    id: 'table',
    title: 'Table completion',
    filePath: '/data/questionType/completion/table-completion.example.json',
  },
  {
    id: 'flow',
    title: 'Flow-chart completion',
    filePath: '/data/questionType/completion/flowchart-completion.example.json',
  },
  {
    id: 'diagram',
    title: 'Diagram label completion',
    filePath:
      '/data/questionType/diagram-label-completion/diagram-label-completion.example.json',
  },
  {
    id: 'sa',
    title: 'Short answer',
    filePath: '/data/questionType/short-answer/short-answer.example.json',
  },
];

type BuilderQuestion = {
  localId: string;
  data: IELTSReadingQuestion;
};

type BuilderSection = {
  id: number;
  title: string;
  passageHtml: string;
  questions: BuilderQuestion[];
};

function makeLocalId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function sanitizeFilename(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, '')
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildDefaultState(): {
  info: IELTSReadingTest['info'];
  sections: BuilderSection[];
} {
  return {
    info: {
      title: 'IELTS Reading Test',
      instructions: 'You should spend about 60 minutes on this test.',
      totalDuration: '60 minutes',
    },
    sections: [
      {
        id: 1,
        title: '',
        passageHtml: '',
        questions: [],
      },
    ],
  };
}

function toExportedTest(state: {
  info: IELTSReadingTest['info'];
  sections: BuilderSection[];
}): IELTSReadingTest {
  return {
    info: state.info,
    sections: state.sections.map((s) => ({
      id: s.id,
      title: s.title || undefined,
      passageHtml: s.passageHtml || undefined,
      passageBlocks: [],
      questions: s.questions.map((q) => q.data),
    })),
  };
}

function toBuilderState(payload: DraftPayload | null) {
  const fallback = buildDefaultState();
  if (!payload) return fallback;

  const safeInfo =
    payload.info &&
    typeof payload.info.title === 'string' &&
    typeof payload.info.instructions === 'string' &&
    typeof payload.info.totalDuration === 'string'
      ? payload.info
      : fallback.info;

  const inputSections = Array.isArray(payload.sections) ? payload.sections : [];

  const normalizedSections: BuilderSection[] = inputSections
    .map((sec, index) => {
      if (!sec || typeof sec !== 'object') return null;
      const s = sec as Record<string, unknown>;
      const rawId = typeof s.id === 'number' ? s.id : index + 1;
      const title = typeof s.title === 'string' ? s.title : '';
      const passageHtml = typeof s.passageHtml === 'string' ? s.passageHtml : '';
      const questionsRaw = Array.isArray(s.questions) ? s.questions : [];

      const questions: BuilderQuestion[] = questionsRaw
        .map((q) => {
          try {
            const data = q as IELTSReadingQuestion;
            return {
              localId: makeLocalId(),
              data,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as BuilderQuestion[];

      return {
        id: rawId,
        title,
        passageHtml,
        questions,
      };
    })
    .filter(Boolean) as BuilderSection[];

  const sections =
    normalizedSections.length > 0
      ? normalizedSections.map((s, idx) => ({
          ...s,
          id: idx + 1,
        }))
      : fallback.sections;

  return {
    info: safeInfo,
    sections,
  };
}

export default function ReadingTestBuilder() {
  const [tab, setTab] = useState<BuilderTab>('editor');
  const [showAnswers, setShowAnswers] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeQuestionLocalId, setActiveQuestionLocalId] = useState<string | null>(null);

  const [info, setInfo] = useState<IELTSReadingTest['info']>(() => buildDefaultState().info);
  const [sections, setSections] = useState<BuilderSection[]>(() => buildDefaultState().sections);

  const [selectedTemplateIdBySection, setSelectedTemplateIdBySection] = useState<
    Record<number, string>
  >({ 1: QUESTION_TEMPLATES[0].id, 2: QUESTION_TEMPLATES[0].id, 3: QUESTION_TEMPLATES[0].id });

  const [filename, setFilename] = useState('demo-reading-1');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [savedTestId, setSavedTestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lastAutoSaveAt = useRef<number | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [isTestInfoCollapsed, setIsTestInfoCollapsed] = useState(false);
  const [collapsedQuestionIds, setCollapsedQuestionIds] = useState<Set<string>>(
    () => new Set<string>(),
  );

  const addSection = () => {
    setSections((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          title: '',
          passageHtml: '',
          questions: [],
        },
      ];
    });
  };

  const removeSection = (sectionId: number) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== sectionId);
      return filtered.map((s, idx) => ({
        ...s,
        id: idx + 1,
        questions: s.questions.map((q) => ({
          ...q,
          data: {
            ...q.data,
            meta: {
              ...q.data.meta,
              section: idx + 1,
            },
          },
        })),
      }));
    });
  };

  const exported = useMemo(() => toExportedTest({ info, sections }), [info, sections]);
  const exportedJson = useMemo(() => JSON.stringify(exported, null, 2), [exported]);

  useEffect(() => {
    const draft = loadDraft();
    const restored = toBuilderState(draft);
    setInfo(restored.info);
    setSections(restored.sections);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const payload: DraftPayload = {
        info,
        sections: exported.sections,
      };
      saveDraft(payload);
      lastAutoSaveAt.current = Date.now();
    }, DRAFT_AUTO_SAVE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [exported.sections, info]);

  const getNextQuestionNumber = (sectionId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    const max = section?.questions.reduce((acc, q) => Math.max(acc, q.data.meta.questionNumber), 0) ?? 0;
    return max + 1;
  };

  const addQuestionFromTemplate = async (sectionId: number) => {
    try {
      setError(null);
      const templateId = selectedTemplateIdBySection[sectionId] ?? QUESTION_TEMPLATES[0].id;
      const template = QUESTION_TEMPLATES.find((t) => t.id === templateId) ?? QUESTION_TEMPLATES[0];

      const res = await fetch(template.filePath);
      if (!res.ok) throw new Error(`Failed to load template: ${res.statusText}`);
      const q = (await res.json()) as IELTSReadingQuestion;

      const questionNumber = getNextQuestionNumber(sectionId);
      const next: IELTSReadingQuestion = {
        ...q,
        meta: {
          ...q.meta,
          section: sectionId,
          questionNumber,
        },
      };

      const builderQ: BuilderQuestion = {
        localId: makeLocalId(),
        data: next,
      };

      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, questions: [...s.questions, builderQ] } : s
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add question');
    }
  };

  const removeQuestion = (sectionId: number, localId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, questions: s.questions.filter((q) => q.localId !== localId) } : s
      )
    );
  };

  const saveToFile = async () => {
    try {
      setError(null);
      setSaveStatus(null);
      setSavedTestId(null);

      const safe = sanitizeFilename(filename);
      if (!safe) {
        setError('Filename is required.');
        return;
      }

      setSaveStatus('Saving…');
      const res = await fetch('/api/admin/save-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: safe, data: exported }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Save failed: ${res.statusText}`);
      }
      setSaveStatus('Saved.');
      setSavedTestId(safe);
    } catch (e) {
      setSaveStatus(null);
      setError(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  const clearDraftAndReset = () => {
    clearDraft();
    const fresh = buildDefaultState();
    setInfo(fresh.info);
    setSections(fresh.sections);
    setError(null);
    setSaveStatus(null);
    setSavedTestId(null);
  };

  const previewSections = useMemo(
    () => sections.filter((s) => s.passageHtml.trim() || s.questions.length > 0 || s.title.trim()),
    [sections]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="w-full px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('editor')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg border ${
                tab === 'editor' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setTab('json')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg border ${
                tab === 'json' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:bg-gray-50'
              }`}
            >
              JSON
            </button>
            <div className="ml-3 text-xs text-gray-500 hidden sm:block">
              Auto-save: {lastAutoSaveAt.current ? new Date(lastAutoSaveAt.current).toLocaleTimeString() : '—'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnswers((v) => !v)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${
                showAnswers ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {showAnswers ? 'Hide answers' : 'Show answers'}
            </button>
            <button
              onClick={clearDraftAndReset}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              Clear draft
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full px-4 pt-4">
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        </div>
      )}

      <div className="w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-64px)]">
        <div className="space-y-6 h-full overflow-y-auto pr-2">
          {tab === 'editor' ? (
            <>
              <section className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900">Test info</h2>
                  <button
                    type="button"
                    onClick={() => setIsTestInfoCollapsed((v) => !v)}
                    className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                  >
                    {isTestInfoCollapsed ? 'Expand' : 'Collapse'}
                  </button>
                </div>
                {!isTestInfoCollapsed && (
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                        Title
                      </label>
                      <input
                        value={info.title}
                        onChange={(e) => setInfo((v) => ({ ...v, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                        Instructions
                      </label>
                      <textarea
                        value={info.instructions}
                        onChange={(e) => setInfo((v) => ({ ...v, instructions: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                        Total duration
                      </label>
                      <input
                        value={info.totalDuration}
                        onChange={(e) => setInfo((v) => ({ ...v, totalDuration: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Sections</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Add section
                </button>
              </div>

              {sections.map((section) => (
                <section key={section.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-gray-900">Section {section.id}</h2>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTemplateIdBySection[section.id] ?? QUESTION_TEMPLATES[0].id}
                        onChange={(e) =>
                          setSelectedTemplateIdBySection((prev) => ({
                            ...prev,
                            [section.id]: e.target.value,
                          }))
                        }
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg bg-white"
                      >
                        {QUESTION_TEMPLATES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => void addQuestionFromTemplate(section.id)}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800"
                      >
                        Add question
                      </button>
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(section.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-700 bg-white hover:bg-red-50"
                        >
                          Remove section
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                        Section title (optional)
                      </label>
                      <input
                        value={section.title}
                        onChange={(e) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            )
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                        Passage (HTML)
                      </label>
                      <PassageHtmlEditor
                        value={section.passageHtml}
                        onChange={(html) =>
                          setSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id ? { ...s, passageHtml: html } : s
                            )
                          )
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      {section.questions.length === 0 ? (
                        <div className="text-sm text-gray-500">No questions yet.</div>
                      ) : (
                        section.questions.map((q) => (
                            <div
                              key={q.localId}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveSectionId(section.id);
                                    setActiveQuestionLocalId(q.localId);
                                  }}
                                  className="text-left flex-1 text-sm font-semibold text-gray-900"
                                >
                                  Q{q.data.meta.questionNumber} •{' '}
                                  {q.data.meta.variant ?? q.data.meta.questionType}
                                </button>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCollapsedQuestionIds((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(q.localId)) {
                                          next.delete(q.localId);
                                        } else {
                                          next.add(q.localId);
                                        }
                                        return next;
                                      })
                                    }
                                    className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                                  >
                                    {collapsedQuestionIds.has(q.localId) ? 'Expand' : 'Collapse'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedQuestionId((current) =>
                                        current === q.localId ? null : q.localId,
                                      )
                                    }
                                    className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                                  >
                                    {expandedQuestionId === q.localId ? 'Hide preview' : 'Show preview'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeQuestion(section.id, q.localId)}
                                    className="px-2 py-1 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              {!collapsedQuestionIds.has(q.localId) && (
                                <div className="p-3 space-y-3">
                                  <div>
                                    <ReadingQuestionEditor
                                      question={q.data}
                                      onChange={(next) =>
                                        setSections((prev) =>
                                          prev.map((s) =>
                                            s.id === section.id
                                              ? {
                                                  ...s,
                                                  questions: s.questions.map((inner) =>
                                                    inner.localId === q.localId
                                                      ? {
                                                          ...inner,
                                                          data: next,
                                                        }
                                                      : inner,
                                                  ),
                                                }
                                              : s,
                                          ),
                                        )
                                      }
                                    />
                                  </div>

                                  {expandedQuestionId === q.localId && (
                                    <div>
                                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
                                        Preview (local)
                                      </label>
                                      <QuestionRenderer data={q.data} showAnswers={showAnswers} />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </>
          ) : (
            <section className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900">Export JSON</h2>
              </div>
              <div className="p-4 space-y-3">
                <textarea
                  readOnly
                  value={exportedJson}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs min-h-[420px]"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
                      Filename
                    </label>
                    <input
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="demo-reading-1"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      Will save to <code className="font-mono">public/data/tests/&lt;filename&gt;.json</code>
                    </div>
                  </div>
                  <button
                    onClick={() => void saveToFile()}
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-black text-white hover:bg-gray-800"
                  >
                    Save test
                  </button>
                </div>

                {saveStatus && <div className="text-sm text-gray-700">{saveStatus}</div>}
                {savedTestId && (
                  <div className="text-sm">
                    Saved as{' '}
                    <Link
                      className="font-semibold underline"
                      href={`/reading/tests/${savedTestId}`}
                      target="_blank"
                    >
                      /reading/tests/{savedTestId}
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 h-full overflow-y-auto pl-2">
          <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Full preview</h2>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
                <p className="text-sm text-gray-600">{info.instructions}</p>
                <p className="text-xs text-gray-500 mt-1">Duration: {info.totalDuration}</p>
              </div>

              {previewSections.length === 0 ? (
                <div className="text-sm text-gray-500">Nothing to preview yet.</div>
              ) : (
                previewSections.map((s) => {
                  const isActiveSection = activeSectionId === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`border border-gray-200 rounded-lg overflow-hidden transition-all ${
                        isActiveSection ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                        <div className="text-sm font-bold text-gray-900">
                          Section {s.id}
                          {s.title ? ` – ${s.title}` : ''}
                        </div>
                      </div>
                      <div className="p-3 space-y-4">
                        {s.passageHtml ? (
                          <div className="ql-snow">
                            <div
                              className="ql-editor px-0"
                              dangerouslySetInnerHTML={{ __html: s.passageHtml }}
                            />
                          </div>
                        ) : null}

                        {s.questions.map((q) => {
                          const isActiveQuestion =
                            isActiveSection && activeQuestionLocalId === q.localId;
                          return (
                            <div
                              key={q.localId}
                              className={`border-t border-gray-200 pt-4 rounded-lg transition-all ${
                                isActiveQuestion
                                  ? 'ring-2 ring-amber-500 ring-offset-2 bg-amber-50/60'
                                  : ''
                              }`}
                            >
                              <QuestionRenderer data={q.data} showAnswers={showAnswers} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

