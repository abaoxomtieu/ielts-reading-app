'use client';

import React, { useEffect, useState } from 'react';
import QuestionRenderer from '@/components/QuestionRenderer';
import type { IELTSReadingTest, ReadingSection, IELTSReadingQuestion } from '@/types';

async function loadTest(testId: string): Promise<IELTSReadingTest> {
  const res = await fetch(`/data/tests/${testId}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load test: ${res.statusText}`);
  }
  return res.json();
}

export default function ReadingTestClient({ testId }: { testId: string }) {
  const [test, setTest] = useState<IELTSReadingTest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    loadTest(testId)
      .then((data) => {
        setTest(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load test');
        setTest(null);
      });
  }, [testId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-xl p-6 border border-red-200 bg-red-50 rounded-lg text-red-800">
          {error}
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600 text-sm">Loading test…</div>
      </div>
    );
  }

  const renderPassageHtml = (section: ReadingSection) => {
    if (!section.passageHtml) return null;
    return (
      <div className="ql-snow">
        <div
          className="ql-editor px-0"
          dangerouslySetInnerHTML={{ __html: section.passageHtml }}
        />
      </div>
    );
  };

  const renderPassageBlocks = (section: ReadingSection) => {
    if (!section.passageBlocks || section.passageBlocks.length === 0) {
      return null;
    }

    return section.passageBlocks.map((block) => {
      if (block.type === 'heading') {
        return (
          <h2 key={block.id} className="text-xl font-bold text-gray-900 mb-3">
            {block.text}
          </h2>
        );
      }
      if (block.type === 'subheading') {
        return (
          <h3 key={block.id} className="text-lg font-semibold text-gray-800 mb-2">
            {block.text}
          </h3>
        );
      }
      if (block.type === 'list' && block.items) {
        return (
          <ul key={block.id} className="list-disc list-inside mb-3 text-gray-800">
            {block.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={block.id} className="mb-3 text-gray-800 leading-relaxed">
          {block.label && <span className="font-bold mr-2">{block.label}</span>}
          {block.text}
        </p>
      );
    });
  };

  const renderPassage = (section: ReadingSection) => {
    if (section.passageHtml) return renderPassageHtml(section);
    if (section.passageBlocks && section.passageBlocks.length > 0)
      return renderPassageBlocks(section);
    if (section.passageText) {
      return (
        <p className="mb-3 text-gray-800 leading-relaxed">{section.passageText}</p>
      );
    }
    return null;
  };

  const renderSectionQuestions = (section: ReadingSection) => {
    const sorted = [...section.questions].sort(
      (a, b) => a.meta.questionNumber - b.meta.questionNumber
    );

    return sorted.map((q: IELTSReadingQuestion) => (
      <div key={`${q.meta.section}-${q.meta.questionNumber}`} className="mb-8">
        <QuestionRenderer data={q} showAnswers={showAnswers} />
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {test.info.title} – {testId}
            </h1>
            <p className="text-sm text-gray-600">{test.info.instructions}</p>
          </div>
          <button
            onClick={() => setShowAnswers((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              showAnswers
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-black hover:bg-gray-300'
            }`}
          >
            {showAnswers ? 'Hide answers' : 'Show answers'}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
          {test.sections.map((section) => (
            <section
              key={section.id}
              className="border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">
                  Section {section.id}
                  {section.title ? ` – ${section.title}` : ''}
                </h2>
              </div>
              <div className="px-6 py-4 grid gap-6">
                <article className="border-b border-gray-200 pb-4">
                  {renderPassage(section)}
                </article>
                <div>{renderSectionQuestions(section)}</div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

