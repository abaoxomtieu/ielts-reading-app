'use client';

import React, { useState } from 'react';
import type { FlowchartCompletionQuestion } from '@/types';

interface Props {
  data: FlowchartCompletionQuestion;
}

export default function FlowchartCompletionViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const flowchart = content.flowchart;
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';

  const handleChange = (nodeId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [nodeId]: value }));
  };

  const renderNodeText = (text: string, nodeId: number) => {
    if (!text.includes('[______]')) {
      return <span className="text-gray-900 font-semibold">{text}</span>;
    }
    const parts = text.split('[______]');
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-gray-900">{parts[0]}</span>
        <input
          type="text"
          className="w-32 border-b-2 border-gray-500 bg-transparent px-2 py-1 text-center focus:border-blue-600 focus:outline-none text-gray-900"
          value={answers[nodeId] ?? ''}
          onChange={(e) => handleChange(nodeId, e.target.value)}
          placeholder="_____"
        />
        {parts[1] && <span className="text-gray-900">{parts[1]}</span>}
      </div>
    );
  };

  if (!flowchart) return null;

  const nodes = flowchart.nodes || [];

  return (
    <div className="w-full bg-white border border-gray-300 shadow-sm p-8 rounded-lg">
      <div className="mb-6 pb-4 border-b-2 border-gray-400">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white font-bold rounded-md">
            {meta.questionNumber}
          </div>
          <h2 className="text-xl font-semibold text-black flex-1">{content.questionText}</h2>
        </div>
        {content.instructions && (
          <p className="text-sm text-gray-600 ml-13">{content.instructions}</p>
        )}
      </div>
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm font-semibold text-blue-800">{wordLimit}</p>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-6">{flowchart.title}</h3>
      <div className="flex flex-col items-center gap-2">
        {nodes.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div className="relative p-4 rounded-lg border-2 border-gray-300 shadow-sm bg-white min-w-[200px] text-center">
              {renderNodeText(node.text, node.id)}
            </div>
            {idx < nodes.length - 1 && content.uiHints?.showArrows !== false && (
              <div className="flex justify-center py-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                  <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
