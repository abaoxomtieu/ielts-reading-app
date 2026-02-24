'use client';

import React, { useEffect, useState } from 'react';
import type {
  FlowchartCompletionQuestion,
  FlowchartData,
  FlowchartNode,
  AnswerKey,
} from '@/types';

interface Props {
  question: FlowchartCompletionQuestion;
  onChange: (next: FlowchartCompletionQuestion) => void;
}

export default function FlowchartCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [flowchart, setFlowchart] = useState<FlowchartData>(
    question.content.flowchart || {
      title: '',
      nodes: [],
      connections: [],
    },
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};
    const normalizedNodes = flowchart.nodes.map((n) => {
      if (n.answer) {
        answerKey[String(n.id)] = n.answer;
      }
      return n;
    });

    const nextContent: FlowchartCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      flowchart: {
        ...flowchart,
        nodes: normalizedNodes,
      },
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, flowchart, onChange]);

  const updateFlowchart = (updater: (current: FlowchartData) => FlowchartData) => {
    setFlowchart((prev) => updater(prev));
  };

  const addBlankNode = () => {
    updateFlowchart((current) => {
      const nextId =
        current.nodes.length > 0 ? Math.max(...current.nodes.map((n) => n.id)) + 1 : 1;
      const node: FlowchartNode = {
        id: nextId,
        text: 'New node with [______]',
        answer: '',
        position: { x: 0, y: 0 },
      };
      return { ...current, nodes: [...current.nodes, node] };
    });
  };

  const addInfoNode = () => {
    updateFlowchart((current) => {
      const nextId =
        current.nodes.length > 0 ? Math.max(...current.nodes.map((n) => n.id)) + 1 : 1;
      const node: FlowchartNode = {
        id: nextId,
        text: 'Information node',
        answer: '',
        position: { x: 0, y: 0 },
      };
      return { ...current, nodes: [...current.nodes, node] };
    });
  };

  const updateNode = (id: number, updates: Partial<FlowchartNode>) => {
    updateFlowchart((current) => ({
      ...current,
      nodes: current.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  };

  const removeNode = (id: number) => {
    updateFlowchart((current) => ({
      ...current,
      nodes: current.nodes.filter((n) => n.id !== id),
      connections: current.connections.filter(
        (c) => c.from !== id && c.to !== id,
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Flowchart Completion Settings
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
          Flowchart
        </h3>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Title
          </label>
          <input
            value={flowchart.title}
            onChange={(e) =>
              updateFlowchart((current) => ({ ...current, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="space-y-3">
          {flowchart.nodes.map((node) => {
            const hasBlank = node.text.includes('[______]');
            return (
              <div
                key={node.id}
                className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2 relative"
              >
                <button
                  type="button"
                  onClick={() => removeNode(node.id)}
                  className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <div className="text-xs font-semibold text-gray-500 mb-1">
                  Node {node.id} {hasBlank ? '(question)' : '(info)'}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                    Text (use [______] for blank)
                  </label>
                  <textarea
                    value={node.text}
                    onChange={(e) => updateNode(node.id, { text: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                {hasBlank && (
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Answer
                    </label>
                    <input
                      value={node.answer}
                      onChange={(e) => updateNode(node.id, { answer: e.target.value })}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={addBlankNode}
              className="flex flex-col items-center justify-center py-3 border-2 border-dashed border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 text-xs font-semibold"
            >
              + Add blank node
            </button>
            <button
              type="button"
              onClick={addInfoNode}
              className="flex flex-col items-center justify-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-semibold"
            >
              + Add info node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

