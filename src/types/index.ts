// ============================================
// IELTS Reading – Base & Question Types
// ============================================

// ============================================
// BASE TYPES
// ============================================

export interface Meta {
  questionType?: ReadingQuestionType;
  variant?: string;
  section: number;
  questionNumber: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  version?: string;
  testId?: string;
  totalQuestions?: number;
  totalTime?: string;
}

export type ReadingQuestionType =
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_information'
  | 'matching_headings'
  | 'matching_features'
  | 'matching_sentence_endings'
  | 'sentence_completion'
  | 'completion'
  | 'diagram_label_completion'
  | 'short_answer';

export type AnswerKey = Record<string, string | string[]>;

export interface Scoring {
  points: number;
  partialCredit?: boolean;
  penaltyForWrong?: number;
}

export interface UiHints {
  displayType?: string;
  showFieldNumbers?: boolean;
  showOptions?: boolean;
  dropdownForBlanks?: boolean;
  showRowNumbers?: boolean;
  showColumnHeaders?: boolean;
  showArrows?: boolean;
  verticalLayout?: boolean;
  wordLimit?: string;
  maxSelectable?: number;
}

export interface Validation {
  wordLimit?: string | null;
  minCorrectRequired?: number;
  eachOptionUsedOnce?: boolean;
}

// ============================================
// MULTIPLE CHOICE
// ============================================

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceContent {
  questionText: string;
  instructions?: string;
  options: MultipleChoiceOption[];
  answer: { correctOption?: string; correctOptions?: string[]; explanation?: string };
  uiHints?: UiHints;
  validation?: Validation;
}

export interface MultipleChoiceQuestion {
  meta: Meta;
  content: MultipleChoiceContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// TRUE / FALSE / NOT GIVEN
// ============================================

export interface TrueFalseStatement {
  id: number;
  text: string;
}

export interface TrueFalseNotGivenContent {
  questionText: string;
  instructions: string;
  statements: TrueFalseStatement[];
  uiHints?: UiHints;
}

export interface TrueFalseNotGivenQuestion {
  meta: Meta;
  content: TrueFalseNotGivenContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// YES / NO / NOT GIVEN
// ============================================

export interface YesNoStatement {
  id: number;
  text: string;
}

export interface YesNoNotGivenContent {
  questionText: string;
  instructions: string;
  statements: YesNoStatement[];
  uiHints?: UiHints;
}

export interface YesNoNotGivenQuestion {
  meta: Meta;
  content: YesNoNotGivenContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MATCHING INFORMATION (statement → paragraph)
// ============================================

export interface MatchingInfoStatement {
  id: number;
  text: string;
}

export interface MatchingInformationContent {
  questionText: string;
  instructions: string;
  statements: MatchingInfoStatement[];
  paragraphLabels: string[]; // e.g. ['A','B','C']
  uiHints?: UiHints;
}

export interface MatchingInformationQuestion {
  meta: Meta;
  content: MatchingInformationContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MATCHING HEADINGS (heading → paragraph)
// ============================================

export interface MatchingHeadingItem {
  id: string;
  text: string;
}

export interface MatchingHeadingsContent {
  questionText: string;
  instructions: string;
  headings: MatchingHeadingItem[]; // i, ii, iii...
  paragraphLabels: string[]; // A, B, C...
  uiHints?: UiHints;
}

export interface MatchingHeadingsQuestion {
  meta: Meta;
  content: MatchingHeadingsContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MATCHING FEATURES (statement → option)
// ============================================

export interface MatchingFeaturesStatement {
  id: number;
  text: string;
}

export interface MatchingFeaturesOption {
  id: string;
  text: string;
}

export interface MatchingFeaturesContent {
  questionText: string;
  instructions: string;
  statements: MatchingFeaturesStatement[];
  options: MatchingFeaturesOption[];
  allowReuse?: boolean;
  uiHints?: UiHints;
}

export interface MatchingFeaturesQuestion {
  meta: Meta;
  content: MatchingFeaturesContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// MATCHING SENTENCE ENDINGS
// ============================================

export interface SentenceEndingStart {
  id: number;
  text: string;
}

export interface SentenceEndingOption {
  id: string;
  text: string;
}

export interface MatchingSentenceEndingsContent {
  questionText: string;
  instructions: string;
  sentenceStarts: SentenceEndingStart[];
  endings: SentenceEndingOption[];
  uiHints?: UiHints;
}

export interface MatchingSentenceEndingsQuestion {
  meta: Meta;
  content: MatchingSentenceEndingsContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// SENTENCE COMPLETION
// ============================================

export interface SentenceCompletionItem {
  id: number;
  text: string;
  answer: string;
  blankPosition?: 'start' | 'middle' | 'end';
}

export interface SentenceCompletionContent {
  questionText: string;
  instructions: string;
  sentences: SentenceCompletionItem[];
  wordLimit: string;
  /**
   * Optional word list (A, B, C...) for variants
   * where candidates choose a letter instead of
   * writing the full word from the passage.
   */
  options?: SummaryOption[];
  uiHints?: UiHints;
  validation?: Validation;
}

export interface SentenceCompletionQuestion {
  meta: Meta;
  content: SentenceCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// COMPLETION (summary, note, table, flowchart)
// ============================================

export interface SummaryBlank {
  id: number;
  position: number;
  answer: string;
}

export interface SummaryData {
  text: string;
  blanks: SummaryBlank[];
}

export interface SummaryOption {
  id: string;
  text: string;
}

export interface SummaryCompletionContent {
  questionText: string;
  instructions: string;
  summary: SummaryData;
  options?: SummaryOption[];
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface SummaryCompletionQuestion {
  meta: Meta;
  content: SummaryCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

export interface NoteBulletPoint {
  id: number;
  text: string;
  answer: string;
}

export interface NoteSection {
  heading: string;
  bulletPoints: NoteBulletPoint[];
}

export interface NotesData {
  title?: string;
  sections: NoteSection[];
}

export interface NoteCompletionContent {
  questionText: string;
  instructions: string;
  notes: NotesData;
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface NoteCompletionQuestion {
  meta: Meta;
  content: NoteCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

export interface TableCell {
  value: string;
  isEditable: boolean;
  answer?: string;
}

export interface TableRow {
  id: number;
  cells: TableCell[];
}

export interface TableData {
  title?: string;
  headers: string[];
  rows: TableRow[];
}

export interface TableCompletionContent {
  questionText: string;
  instructions: string;
  table: TableData;
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface TableCompletionQuestion {
  meta: Meta;
  content: TableCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface FlowchartNode {
  id: number;
  text: string;
  answer: string;
  position: NodePosition;
}

export interface FlowchartConnection {
  from: number;
  to: number;
}

export interface FlowchartData {
  title: string;
  nodes: FlowchartNode[];
  connections: FlowchartConnection[];
}

export interface FlowchartCompletionContent {
  questionText: string;
  instructions: string;
  flowchart: FlowchartData;
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface FlowchartCompletionQuestion {
  meta: Meta;
  content: FlowchartCompletionContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// DIAGRAM LABEL COMPLETION
// ============================================

export interface DiagramLabelItem {
  id: number;
  label: string;
  answer: string;
  position?: NodePosition;
}

export interface DiagramLabelContent {
  questionText: string;
  instructions: string;
  imageUrl?: string;
  imageAlt?: string;
  labels: DiagramLabelItem[];
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface DiagramLabelCompletionQuestion {
  meta: Meta;
  content: DiagramLabelContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// SHORT ANSWER
// ============================================

export interface ShortAnswerItem {
  id: number;
  text: string;
  answer: string;
  alternativeAnswers?: string[];
}

export interface ShortAnswerContent {
  questionText: string;
  instructions: string;
  questions: ShortAnswerItem[];
  wordLimit: string;
  uiHints?: UiHints;
  validation?: Validation;
}

export interface ShortAnswerQuestion {
  meta: Meta;
  content: ShortAnswerContent;
  answerKey: AnswerKey;
  scoring: Scoring;
}

// ============================================
// UNION TYPE
// ============================================

export type IELTSReadingQuestion =
  | MultipleChoiceQuestion
  | TrueFalseNotGivenQuestion
  | YesNoNotGivenQuestion
  | MatchingInformationQuestion
  | MatchingHeadingsQuestion
  | MatchingFeaturesQuestion
  | MatchingSentenceEndingsQuestion
  | SentenceCompletionQuestion
  | SummaryCompletionQuestion
  | NoteCompletionQuestion
  | TableCompletionQuestion
  | FlowchartCompletionQuestion
  | DiagramLabelCompletionQuestion
  | ShortAnswerQuestion;

// ============================================
// TEST LEVEL TYPES
// ============================================

export interface ReadingTestInfo {
  title: string;
  instructions: string;
  totalDuration: string;
}

export type ReadingBlockType =
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'paragraph_labeled'
  | 'list';

export interface ReadingBlock {
  id: string;
  type: ReadingBlockType;
  /**
   * Optional label for labeled paragraphs (e.g. A, B, C for matching headings/information).
   */
  label?: string;
  /**
   * Text content for headings, subheadings, and paragraphs.
   */
  text?: string;
  /**
   * Items for list-type blocks.
   */
  items?: string[];
}

export interface ReadingSection {
  id: number;
  title?: string;
  /**
   * Primary storage for passage content entered by admin.
   * Stored as HTML and rendered on the test page.
   */
  passageHtml?: string;
  /**
   * Structured blocks representing the passage content.
   * This replaces the older `passageText` field.
   */
  passageBlocks?: ReadingBlock[];
  /**
   * Optional legacy plain-text passage for backwards compatibility.
   */
  passageText?: string;
  questions: IELTSReadingQuestion[];
}

export interface IELTSReadingTest {
  meta?: Meta;
  info: ReadingTestInfo;
  sections: ReadingSection[];
  answerKey?: Record<string, Record<string, string | string[]>>;
}

// ============================================
// TYPE GUARDS
// ============================================

export function isMultipleChoiceQuestion(
  q: IELTSReadingQuestion
): q is MultipleChoiceQuestion {
  return q.meta.questionType === 'multiple_choice';
}

export function isTrueFalseNotGivenQuestion(
  q: IELTSReadingQuestion
): q is TrueFalseNotGivenQuestion {
  return q.meta.questionType === 'true_false_not_given';
}

export function isYesNoNotGivenQuestion(
  q: IELTSReadingQuestion
): q is YesNoNotGivenQuestion {
  return q.meta.questionType === 'yes_no_not_given';
}

export function isMatchingInformationQuestion(
  q: IELTSReadingQuestion
): q is MatchingInformationQuestion {
  return q.meta.questionType === 'matching_information';
}

export function isMatchingHeadingsQuestion(
  q: IELTSReadingQuestion
): q is MatchingHeadingsQuestion {
  return q.meta.questionType === 'matching_headings';
}

export function isMatchingFeaturesQuestion(
  q: IELTSReadingQuestion
): q is MatchingFeaturesQuestion {
  return q.meta.questionType === 'matching_features';
}

export function isMatchingSentenceEndingsQuestion(
  q: IELTSReadingQuestion
): q is MatchingSentenceEndingsQuestion {
  return q.meta.questionType === 'matching_sentence_endings';
}

export function isSentenceCompletionQuestion(
  q: IELTSReadingQuestion
): q is SentenceCompletionQuestion {
  return q.meta.questionType === 'sentence_completion';
}

export function isCompletionQuestion(
  q: IELTSReadingQuestion
): q is
  | SummaryCompletionQuestion
  | NoteCompletionQuestion
  | TableCompletionQuestion
  | FlowchartCompletionQuestion {
  return q.meta.questionType === 'completion';
}

export function isDiagramLabelCompletionQuestion(
  q: IELTSReadingQuestion
): q is DiagramLabelCompletionQuestion {
  return q.meta.questionType === 'diagram_label_completion';
}

export function isShortAnswerQuestion(
  q: IELTSReadingQuestion
): q is ShortAnswerQuestion {
  return q.meta.questionType === 'short_answer';
}
