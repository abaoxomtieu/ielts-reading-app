import React from 'react';
import type {
  IELTSReadingQuestion,
  Meta,
  MultipleChoiceQuestion,
  TrueFalseNotGivenQuestion,
  YesNoNotGivenQuestion,
  ShortAnswerQuestion,
  MatchingInformationQuestion,
  MatchingHeadingsQuestion,
  MatchingFeaturesQuestion,
  MatchingSentenceEndingsQuestion,
  SentenceCompletionQuestion,
  SummaryCompletionQuestion,
  NoteCompletionQuestion,
  TableCompletionQuestion,
  FlowchartCompletionQuestion,
  DiagramLabelCompletionQuestion,
} from '@/types';
import {
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
} from '@/types';
import ReadingMultipleChoiceBuilder from '@/components/admin/builders/reading/MultipleChoiceBuilder';
import TrueFalseNotGivenBuilder from '@/components/admin/builders/reading/TrueFalseNotGivenBuilder';
import YesNoNotGivenBuilder from '@/components/admin/builders/reading/YesNoNotGivenBuilder';
import ShortAnswerBuilder from '@/components/admin/builders/reading/ShortAnswerBuilder';
import MatchingInformationBuilder from '@/components/admin/builders/reading/MatchingInformationBuilder';
import MatchingHeadingsBuilder from '@/components/admin/builders/reading/MatchingHeadingsBuilder';
import MatchingFeaturesBuilder from '@/components/admin/builders/reading/MatchingFeaturesBuilder';
import MatchingSentenceEndingsBuilder from '@/components/admin/builders/reading/MatchingSentenceEndingsBuilder';
import SentenceCompletionBuilder from '@/components/admin/builders/reading/SentenceCompletionBuilder';
import SummaryCompletionBuilder from '@/components/admin/builders/reading/SummaryCompletionBuilder';
import NoteCompletionBuilder from '@/components/admin/builders/reading/NoteCompletionBuilder';
import TableCompletionBuilder from '@/components/admin/builders/reading/TableCompletionBuilder';
import FlowchartCompletionBuilder from '@/components/admin/builders/reading/FlowchartCompletionBuilder';
import DiagramLabelCompletionBuilder from '@/components/admin/builders/reading/DiagramLabelCompletionBuilder';

interface Props {
  question: IELTSReadingQuestion;
  onChange: (next: IELTSReadingQuestion) => void;
}

interface MetaEditorProps {
  meta: Meta;
  onChange: (next: Meta) => void;
}

function QuestionMetaEditor({ meta, onChange }: MetaEditorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
          Question #
        </label>
        <input
          type="number"
          value={meta.questionNumber}
          onChange={(e) =>
            onChange({
              ...meta,
              questionNumber: Number(e.target.value) || 0,
            })
          }
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
          Section
        </label>
        <input
          type="number"
          value={meta.section}
          onChange={(e) =>
            onChange({
              ...meta,
              section: Number(e.target.value) || 1,
            })
          }
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
          Type
        </label>
        <input
          value={meta.questionType ?? ''}
          disabled
          className="w-full px-2 py-1.5 border border-gray-200 bg-gray-50 rounded-md text-xs text-gray-500"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
          Variant
        </label>
        <input
          value={meta.variant ?? ''}
          onChange={(e) =>
            onChange({
              ...meta,
              variant: e.target.value || undefined,
            })
          }
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
        />
      </div>
    </div>
  );
}

export default function ReadingQuestionEditor({ question, onChange }: Props) {
  const updateMeta = (nextMeta: Meta) => {
    onChange({
      ...question,
      meta: nextMeta,
    } as IELTSReadingQuestion);
  };

  const updateContent = (updater: (content: any) => any) => {
    onChange({
      ...question,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content: updater((question as any).content),
    } as IELTSReadingQuestion);
  };

  const updateScoring = (updater: (scoring: any) => any) => {
    onChange({
      ...question,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      scoring: updater((question as any).scoring),
    } as IELTSReadingQuestion);
  };

  return (
    <div className="space-y-4">
      <QuestionMetaEditor meta={question.meta} onChange={updateMeta} />

      <div className="border-t border-gray-200 pt-4 space-y-3">
        {isMultipleChoiceQuestion(question) && (
          <ReadingMultipleChoiceBuilder
            question={question as MultipleChoiceQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isTrueFalseNotGivenQuestion(question) && (
          <TrueFalseNotGivenBuilder
            question={question as TrueFalseNotGivenQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isYesNoNotGivenQuestion(question) && (
          <YesNoNotGivenBuilder
            question={question as YesNoNotGivenQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isShortAnswerQuestion(question) && (
          <ShortAnswerBuilder
            question={question as ShortAnswerQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isMatchingInformationQuestion(question) && (
          <MatchingInformationBuilder
            question={question as MatchingInformationQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isMatchingHeadingsQuestion(question) && (
          <MatchingHeadingsBuilder
            question={question as MatchingHeadingsQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isMatchingFeaturesQuestion(question) && (
          <MatchingFeaturesBuilder
            question={question as MatchingFeaturesQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isMatchingSentenceEndingsQuestion(question) && (
          <MatchingSentenceEndingsBuilder
            question={question as MatchingSentenceEndingsQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isSentenceCompletionQuestion(question) && (
          <SentenceCompletionBuilder
            question={question as SentenceCompletionQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        {isCompletionQuestion(question) && (() => {
          const anyQ = question as any;
          if (anyQ.content?.summary) {
            return (
              <SummaryCompletionBuilder
                question={question as SummaryCompletionQuestion}
                onChange={(next) => onChange(next)}
              />
            );
          }
          if (anyQ.content?.notes) {
            return (
              <NoteCompletionBuilder
                question={question as NoteCompletionQuestion}
                onChange={(next) => onChange(next)}
              />
            );
          }
          if (anyQ.content?.table) {
            return (
              <TableCompletionBuilder
                question={question as TableCompletionQuestion}
                onChange={(next) => onChange(next)}
              />
            );
          }
          if (anyQ.content?.flowchart) {
            return (
              <FlowchartCompletionBuilder
                question={question as FlowchartCompletionQuestion}
                onChange={(next) => onChange(next)}
              />
            );
          }
          return null;
        })()}

        {isDiagramLabelCompletionQuestion(question) && (
          <DiagramLabelCompletionBuilder
            question={question as DiagramLabelCompletionQuestion}
            onChange={(next) => onChange(next)}
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-dashed border-gray-200">
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">
              Points
            </label>
            <input
              type="number"
              value={(question as any).scoring?.points ?? 1}
              onChange={(e) =>
                updateScoring((s: any) => ({
                  points: Number(e.target.value) || 0,
                  ...s,
                }))
              }
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

