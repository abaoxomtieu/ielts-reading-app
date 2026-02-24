'use client';

import React from 'react';
import {
  IELTSReadingQuestion,
  isMultipleChoiceQuestion,
  isTrueFalseNotGivenQuestion,
  isYesNoNotGivenQuestion,
  isMatchingInformationQuestion,
  isMatchingHeadingsQuestion,
  isMatchingFeaturesQuestion,
  isMatchingSentenceEndingsQuestion,
  isSentenceCompletionQuestion,
  isCompletionQuestion,
  isDiagramLabelCompletionQuestion,
  isShortAnswerQuestion,
  type SummaryCompletionQuestion,
  type NoteCompletionQuestion,
  type TableCompletionQuestion,
  type FlowchartCompletionQuestion,
} from '@/types';
import MultipleChoiceViewer from './multiple-choice/MultipleChoiceViewer';
import TrueFalseNotGivenViewer from './true-false-not-given/TrueFalseNotGivenViewer';
import YesNoNotGivenViewer from './yes-no-not-given/YesNoNotGivenViewer';
import MatchingInformationViewer from './matching-information/MatchingInformationViewer';
import MatchingHeadingsViewer from './matching-headings/MatchingHeadingsViewer';
import MatchingFeaturesViewer from './matching-features/MatchingFeaturesViewer';
import MatchingSentenceEndingsViewer from './matching-sentence-endings/MatchingSentenceEndingsViewer';
import SentenceCompletionViewer from './sentence-completion/SentenceCompletionViewer';
import SummaryCompletionViewer from './completion/SummaryCompletionViewer';
import NoteCompletionViewer from './completion/NoteCompletionViewer';
import TableCompletionViewer from './completion/TableCompletionViewer';
import FlowchartCompletionViewer from './completion/FlowchartCompletionViewer';
import DiagramLabelViewer from './diagram-label/DiagramLabelViewer';
import ShortAnswerViewer from './short-answer/ShortAnswerViewer';

interface QuestionRendererProps {
  data: IELTSReadingQuestion;
  showAnswers?: boolean;
  passageText?: string;
}

function AnswerKeySection({
  answerKey,
  explanation,
}: {
  answerKey: Record<string, string | string[]>;
  explanation?: string;
}) {
  return (
    <div className="mt-6 p-6 bg-gray-100 border-2 border-black rounded-lg">
      <h3 className="text-lg font-bold text-black mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Answer Key
      </h3>
      <div className="space-y-2">
        {Object.entries(answerKey)
          .sort(([a], [b]) => {
            const na = parseInt(a, 10);
            const nb = parseInt(b, 10);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
            return String(a).localeCompare(String(b));
          })
          .map(([key, answer]) => (
            <div key={key} className="flex items-start">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-black text-white text-sm font-bold rounded mr-3">
                {key}
              </span>
              <div className="flex-1 pt-1">
                <span className="text-sm font-medium text-black">
                  {Array.isArray(answer) ? answer.join(', ') : answer}
                </span>
              </div>
            </div>
          ))}
      </div>
      {explanation && (
        <div className="mt-4 pt-4 border-t border-gray-300">
          <h4 className="text-sm font-semibold text-black mb-2">Explanation:</h4>
          <p className="text-sm text-black">{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function QuestionRenderer({ data, showAnswers = false, passageText }: QuestionRendererProps) {
  const { meta, content, answerKey } = data;
  const answerKeyRecord = (answerKey || {}) as Record<string, string | string[]>;

  if (isMultipleChoiceQuestion(data)) {
    const explanation = 'answer' in content ? content.answer?.explanation : undefined;
    return (
      <div>
        <MultipleChoiceViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} explanation={explanation} />}
      </div>
    );
  }

  if (isTrueFalseNotGivenQuestion(data)) {
    return (
      <div>
        <TrueFalseNotGivenViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isYesNoNotGivenQuestion(data)) {
    return (
      <div>
        <YesNoNotGivenViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isMatchingInformationQuestion(data)) {
    return (
      <div>
        <MatchingInformationViewer data={data} passageText={passageText} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isMatchingHeadingsQuestion(data)) {
    return (
      <div>
        <MatchingHeadingsViewer data={data} passageText={passageText} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isMatchingFeaturesQuestion(data)) {
    return (
      <div>
        <MatchingFeaturesViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isMatchingSentenceEndingsQuestion(data)) {
    return (
      <div>
        <MatchingSentenceEndingsViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isSentenceCompletionQuestion(data)) {
    return (
      <div>
        <SentenceCompletionViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isCompletionQuestion(data)) {
    const variant = meta.variant;
    if (variant === 'summary_completion') {
      return (
        <div>
          <SummaryCompletionViewer data={data as SummaryCompletionQuestion} />
          {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
        </div>
      );
    }
    if (variant === 'note_completion') {
      return (
        <div>
          <NoteCompletionViewer data={data as NoteCompletionQuestion} />
          {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
        </div>
      );
    }
    if (variant === 'table_completion') {
      return (
        <div>
          <TableCompletionViewer data={data as TableCompletionQuestion} />
          {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
        </div>
      );
    }
    if (variant === 'flowchart_completion') {
      return (
        <div>
          <FlowchartCompletionViewer data={data as FlowchartCompletionQuestion} />
          {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
        </div>
      );
    }
  }

  if (isDiagramLabelCompletionQuestion(data)) {
    return (
      <div>
        <DiagramLabelViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  if (isShortAnswerQuestion(data)) {
    return (
      <div>
        <ShortAnswerViewer data={data} />
        {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{content.questionText}</h2>
      <p className="text-sm text-gray-600">Question type &quot;{meta.questionType}&quot; not implemented.</p>
      {showAnswers && <AnswerKeySection answerKey={answerKeyRecord} />}
    </div>
  );
}
