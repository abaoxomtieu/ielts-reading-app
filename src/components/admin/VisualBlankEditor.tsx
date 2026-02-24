'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VisualBlankEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function VisualBlankEditor({
  value,
  onChange,
  placeholder,
  className,
}: VisualBlankEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isInternalUpdate) {
      setIsInternalUpdate(false);
      return;
    }

    if (editorRef.current) {
      const html = convertToHtml(value);
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
    }
  }, [value, isInternalUpdate]);

  const convertToHtml = (text: string) => {
    if (!text) return '';
    return text.replace(
      /\[______\]/g,
      '<span contenteditable="false" draggable="true" class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 mx-1 cursor-grab active:cursor-grabbing hover:bg-blue-200 transition-all shadow-sm select-none" data-blank="true">BLANK</span>',
    );
  };

  const convertToText = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    let result = '';
    const traverse = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.dataset.blank === 'true') {
          result += '[______]';
        } else {
          el.childNodes.forEach(traverse);
        }
      }
    };

    temp.childNodes.forEach(traverse);
    return result;
  };

  const handleInput = () => {
    if (editorRef.current) {
      const text = convertToText(editorRef.current.innerHTML);
      setIsInternalUpdate(true);
      onChange(text);
    }
  };

  const insertBlank = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        const temp = document.createElement('div');
        temp.innerHTML = convertToHtml('[______]');
        editorRef.current.appendChild(temp.firstChild!);
      } else {
        const pillHtml = convertToHtml('[______]');
        const fragment = range.createContextualFragment(pillHtml);
        range.deleteContents();
        range.insertNode(fragment);
      }

      handleInput();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset.blank === 'true') {
      setDraggedElement(target);
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => {
        target.classList.add('opacity-0');
      }, 0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!editorRef.current || !draggedElement) return;

    if (!editorRef.current.contains(e.target as Node)) {
      draggedElement.classList.remove('opacity-0');
      setDraggedElement(null);
      return;
    }

    let range: Range | null = null;
    if ((document as any).caretRangeFromPoint) {
      range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
    } else if ((e as any).rangeParent) {
      range = document.createRange();
      range.setStart((e as any).rangeParent, (e as any).rangeOffset);
    }

    if (range && editorRef.current.contains(range.commonAncestorContainer)) {
      range.insertNode(draggedElement);
    }

    draggedElement.classList.remove('opacity-0');
    setDraggedElement(null);
    handleInput();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (editorRef.current) {
      let range: Range | null = null;
      if ((document as any).caretRangeFromPoint) {
        range = (document as any).caretRangeFromPoint(e.clientX, e.clientY);
      }
      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  const handleDragEnd = () => {
    if (draggedElement) {
      draggedElement.classList.remove('opacity-0');
      setDraggedElement(null);
    }
  };

  return (
    <div className={`relative group ${className ?? ''}`}>
      <div className="flex bg-gray-100 border-b p-1 gap-2 items-center rounded-t-lg">
        <button
          onMouseDown={insertBlank}
          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors shadow-sm"
          title="Insert Blank capsule at cursor"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Blank
        </button>
        <div className="text-[10px] text-gray-400 font-medium ml-auto px-2">Visual Editor</div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onBlur={handleInput}
        className="w-full min-h-[42px] border rounded-b-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 border-gray-300 transition-all leading-relaxed"
        style={{ wordBreak: 'break-word' }}
      />
      {(!value || value === '') && (
        <div className="absolute top-10 left-3 text-gray-400 pointer-events-none text-sm italic">
          {placeholder || 'Type text or add blanks...'}
        </div>
      )}
    </div>
  );
}

