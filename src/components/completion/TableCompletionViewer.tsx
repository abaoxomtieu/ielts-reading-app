'use client';

import React, { useState } from 'react';
import type { TableCompletionQuestion } from '@/types';

interface Props {
  data: TableCompletionQuestion;
}

export default function TableCompletionViewer({ data }: Props) {
  const { meta, content } = data;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const table = content.table;
  const wordLimit = content.wordLimit || 'NO MORE THAN TWO WORDS';

  const handleChange = (rowId: number, cellIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [`${rowId}-${cellIndex}`]: value }));
  };

  if (!table) return null;

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
      {table.title && <h3 className="text-lg font-bold text-gray-800 mb-4">{table.title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              {table.headers?.map((h, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2 text-left font-bold bg-gray-100 text-gray-800">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows?.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-gray-900">
                    {cell.isEditable ? (
                      <input
                        type="text"
                        className="w-full border-b-2 border-gray-500 bg-transparent px-2 py-0.5 focus:border-blue-600 focus:outline-none"
                        value={answers[`${row.id}-${cellIndex}`] ?? ''}
                        onChange={(e) => handleChange(row.id, cellIndex, e.target.value)}
                        placeholder="_____"
                      />
                    ) : (
                      cell.value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
