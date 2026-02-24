'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QuestionRenderer from '@/components/QuestionRenderer';
import type { IELTSReadingQuestion } from '@/types';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  category: string;
  filePath: string;
  questionType: string;
  variant?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'single-answer', title: 'Multiple choice (single)', description: 'Choose one answer A–D', category: 'Multiple choice', filePath: '/data/questionType/multiple-choice/single-answer.example.json', questionType: 'multiple_choice', variant: 'single_answer' },
  { id: 'multiple-answers', title: 'Multiple choice (multiple)', description: 'Choose two or more answers', category: 'Multiple choice', filePath: '/data/questionType/multiple-choice/multiple-answers.example.json', questionType: 'multiple_choice', variant: 'multiple_answers' },
  { id: 'true-false-not-given', title: 'True / False / Not given', description: 'Identifying information', category: 'Identifying information', filePath: '/data/questionType/true-false-not-given/true-false-not-given.example.json', questionType: 'true_false_not_given' },
  { id: 'yes-no-not-given', title: 'Yes / No / Not given', description: "Identifying writer's views", category: "Writer's views", filePath: '/data/questionType/yes-no-not-given/yes-no-not-given.example.json', questionType: 'yes_no_not_given' },
  { id: 'matching-information', title: 'Matching information', description: 'Match statements to paragraphs', category: 'Matching', filePath: '/data/questionType/matching-information/matching-information.example.json', questionType: 'matching_information' },
  { id: 'matching-headings', title: 'Matching headings', description: 'Match headings to paragraphs', category: 'Matching', filePath: '/data/questionType/matching-headings/matching-headings.example.json', questionType: 'matching_headings' },
  { id: 'matching-features', title: 'Matching features', description: 'Match statements to options', category: 'Matching', filePath: '/data/questionType/matching-features/matching-features.example.json', questionType: 'matching_features' },
  { id: 'matching-sentence-endings', title: 'Matching sentence endings', description: 'Complete sentences with correct endings', category: 'Matching', filePath: '/data/questionType/matching-sentence-endings/matching-sentence-endings.example.json', questionType: 'matching_sentence_endings' },
  { id: 'sentence-completion', title: 'Sentence completion', description: 'Fill gaps in sentences from passage', category: 'Completion', filePath: '/data/questionType/sentence-completion/sentence-completion.example.json', questionType: 'sentence_completion' },
  { id: 'summary-completion', title: 'Summary completion', description: 'Complete a summary with words from passage', category: 'Completion', filePath: '/data/questionType/completion/summary-completion.example.json', questionType: 'completion', variant: 'summary_completion' },
  { id: 'note-completion', title: 'Note completion', description: 'Complete notes with words from passage', category: 'Completion', filePath: '/data/questionType/completion/note-completion.example.json', questionType: 'completion', variant: 'note_completion' },
  { id: 'table-completion', title: 'Table completion', description: 'Complete a table with words from passage', category: 'Completion', filePath: '/data/questionType/completion/table-completion.example.json', questionType: 'completion', variant: 'table_completion' },
  { id: 'flowchart-completion', title: 'Flow-chart completion', description: 'Complete a flowchart from passage', category: 'Completion', filePath: '/data/questionType/completion/flowchart-completion.example.json', questionType: 'completion', variant: 'flowchart_completion' },
  { id: 'diagram-label-completion', title: 'Diagram label completion', description: 'Label a diagram from passage', category: 'Completion', filePath: '/data/questionType/diagram-label-completion/diagram-label-completion.example.json', questionType: 'diagram_label_completion' },
  { id: 'short-answer', title: 'Short-answer questions', description: 'Answer questions in few words', category: 'Short answer', filePath: '/data/questionType/short-answer/short-answer.example.json', questionType: 'short_answer' },
];

export default function Home() {
  const [selectedQuestion, setSelectedQuestion] = useState<IELTSReadingQuestion | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestion(MENU_ITEMS[0].filePath);
    setSelectedItemId(MENU_ITEMS[0].id);
  }, []);

  const loadQuestion = async (filePath: string) => {
    try {
      setError(null);
      setShowAnswers(false);
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load: ${response.statusText}`);
      const data: IELTSReadingQuestion = await response.json();
      setSelectedQuestion(data);
      const item = MENU_ITEMS.find((i) => i.filePath === filePath);
      if (item) setSelectedItemId(item.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load question');
      setSelectedQuestion(null);
    }
  };

  const categories = ['all', ...Array.from(new Set(MENU_ITEMS.map((i) => i.category)))];
  const filteredItems =
    selectedCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === selectedCategory);

  return (
    <div className="flex h-screen bg-white">
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-black mb-1">IELTS Reading</h1>
          <p className="text-sm text-gray-600">Question type examples (14 types)</p>
        </div>
        <div className="p-4 border-b border-gray-200">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
            Filter by category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {cat === 'all' ? 'All types' : cat}
              </button>
            ))}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => loadQuestion(item.filePath)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedItemId === item.id
                    ? 'border-black bg-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <span className="text-sm font-bold text-gray-900 block mb-1">{item.title}</span>
                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
              </button>
            ))}
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>
              {selectedQuestion && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {selectedQuestion.content.questionText}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Section {selectedQuestion.meta.section} •{' '}
                    {selectedQuestion.meta.variant?.replace('_', ' ') ?? selectedQuestion.meta.questionType?.replace('_', ' ')}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg font-medium text-sm bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Admin
              </Link>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  showAnswers ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {showAnswers ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Hide answers
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Show answers
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="max-w-5xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}
          {selectedQuestion ? (
            <div className="max-w-5xl mx-auto">
              <QuestionRenderer data={selectedQuestion} showAnswers={showAnswers} />
            </div>
          ) : !error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600">Select a question type from the sidebar.</p>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
