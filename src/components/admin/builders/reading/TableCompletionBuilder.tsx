'use client';

import React, { useEffect, useState } from 'react';
import type { TableCompletionQuestion, TableData, TableRow, TableCell, AnswerKey } from '@/types';

interface Props {
  question: TableCompletionQuestion;
  onChange: (next: TableCompletionQuestion) => void;
}

export default function TableCompletionBuilder({ question, onChange }: Props) {
  const [questionText, setQuestionText] = useState<string>(question.content.questionText || '');
  const [instructions, setInstructions] = useState<string>(question.content.instructions || '');
  const [wordLimit, setWordLimit] = useState<string>(question.content.wordLimit || '');
  const [table, setTable] = useState<TableData>(
    question.content.table || {
      title: '',
      headers: ['Column 1', 'Column 2'],
      rows: [
        {
          id: 1,
          cells: [
            { value: '', isEditable: false },
            { value: '', isEditable: true, answer: '' },
          ],
        },
      ],
    },
  );

  useEffect(() => {
    const answerKey: AnswerKey = {};

    table.rows.forEach((row) => {
      row.cells.forEach((cell, idx) => {
        if (cell.isEditable && cell.answer) {
          answerKey[`${row.id}-${idx}`] = cell.answer;
        }
      });
    });

    const nextContent: TableCompletionQuestion['content'] = {
      ...question.content,
      questionText,
      instructions,
      wordLimit,
      table,
    };

    onChange({
      ...question,
      content: nextContent,
      answerKey,
    });
  }, [question, questionText, instructions, wordLimit, table, onChange]);

  const updateTable = (updater: (current: TableData) => TableData) => {
    setTable((prev) => updater(prev));
  };

  const addRow = () => {
    updateTable((current) => {
      const nextId = current.rows.length > 0 ? Math.max(...current.rows.map((r) => r.id)) + 1 : 1;
      const baseCells =
        current.rows[0]?.cells ??
        current.headers.map<TableCell>(() => ({ value: '', isEditable: false }));
      const newRow: TableRow = {
        id: nextId,
        cells: baseCells.map((c) => ({ ...c })),
      };
      return { ...current, rows: [...current.rows, newRow] };
    });
  };

  const removeRow = (rowId: number) => {
    updateTable((current) => ({
      ...current,
      rows: current.rows.filter((r) => r.id !== rowId),
    }));
  };

  const addColumn = () => {
    updateTable((current) => {
      const headers = [...current.headers, `Column ${current.headers.length + 1}`];
      const rows = current.rows.map((row) => ({
        ...row,
        cells: [
          ...row.cells,
          {
            value: '',
            isEditable: current.rows[0]?.cells[current.rows[0].cells.length - 1]?.isEditable ??
              true,
          },
        ],
      }));
      return { ...current, headers, rows };
    });
  };

  const removeColumn = (index: number) => {
    updateTable((current) => ({
      ...current,
      headers: current.headers.filter((_, i) => i !== index),
      rows: current.rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, i) => i !== index),
      })),
    }));
  };

  const updateHeader = (index: number, value: string) => {
    updateTable((current) => ({
      ...current,
      headers: current.headers.map((h, i) => (i === index ? value : h)),
    }));
  };

  const updateCell = (
    rowId: number,
    cellIndex: number,
    updates: Partial<TableCell>,
  ) => {
    updateTable((current) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: row.cells.map((cell, idx) =>
                idx === cellIndex ? { ...cell, ...updates } : cell,
              ),
            }
          : row,
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
          Table Completion Settings
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
          Table structure
        </h3>

        <div className="space-y-2">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Table title
            </label>
            <input
              value={table.title ?? ''}
              onChange={(e) =>
                updateTable((current) => ({ ...current, title: e.target.value || undefined }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Headers
            </label>
            <div className="space-y-2">
              {table.headers.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={h}
                    onChange={(e) => updateHeader(idx, e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                  />
                  {table.headers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(idx)}
                      className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addColumn}
                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                + Add column
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 uppercase">Rows</span>
            <button
              type="button"
              onClick={addRow}
              className="px-2 py-1 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              + Add row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-xs">
              <thead>
                <tr>
                  {table.headers.map((h, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-300 px-2 py-1 bg-gray-100 text-left font-semibold text-gray-800"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="border border-gray-300 px-2 py-1 bg-gray-100" />
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.id}>
                    {row.cells.map((cell, idx) => (
                      <td key={idx} className="border border-gray-300 px-2 py-1 align-top">
                        <div className="space-y-1">
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">
                              Value
                            </label>
                            <input
                              value={cell.value}
                              onChange={(e) =>
                                updateCell(row.id, idx, { value: e.target.value })
                              }
                              className="w-full px-1.5 py-1 border border-gray-300 rounded-md text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={cell.isEditable}
                              onChange={(e) =>
                                updateCell(row.id, idx, { isEditable: e.target.checked })
                              }
                              className="w-3 h-3"
                            />
                            <span className="text-[10px] text-gray-600">Editable</span>
                          </div>
                          {cell.isEditable && (
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-0.5">
                                Answer
                              </label>
                              <input
                                value={cell.answer ?? ''}
                                onChange={(e) =>
                                  updateCell(row.id, idx, { answer: e.target.value })
                                }
                                className="w-full px-1.5 py-1 border border-gray-300 rounded-md text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="border border-gray-300 px-2 py-1 align-top">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="px-2 py-1 text-[10px] text-red-500 hover:text-red-700"
                      >
                        Remove row
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

