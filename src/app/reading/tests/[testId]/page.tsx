import ReadingTestClient from './ReadingTestClient';

export default async function ReadingTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  return <ReadingTestClient testId={testId} />;
}

