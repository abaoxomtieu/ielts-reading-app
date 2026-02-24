'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type Quill from 'quill-next';

const QuillEditor = dynamic(() => import('quill-next-react'), { ssr: false });

export interface PassageHtmlEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function PassageHtmlEditor({ value, onChange }: PassageHtmlEditorProps) {
  const quillRef = useRef<Quill | null>(null);
  const lastExternalHtml = useRef<string>('');
  const [ready, setReady] = useState(false);

  const config = useMemo(
    () => ({
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
        ],
      },
    }),
    []
  );

  useEffect(() => {
    if (!quillRef.current) return;
    if (!ready) return;

    const next = value ?? '';
    if (next === lastExternalHtml.current) return;

    const current = quillRef.current.root?.innerHTML ?? '';
    if (current === next) {
      lastExternalHtml.current = next;
      return;
    }

    try {
      quillRef.current.setSelection(0, 0, 'silent');
      quillRef.current.clipboard.dangerouslyPasteHTML(0, next, 'silent');
      lastExternalHtml.current = next;
    } catch {
      // ignore
    }
  }, [ready, value]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <QuillEditor
        className="min-h-[220px]"
        config={config}
        onReady={(quill) => {
          quillRef.current = quill;
          lastExternalHtml.current = value ?? '';
          setReady(true);
        }}
        onTextChange={() => {
          const html = quillRef.current?.root?.innerHTML ?? '';
          lastExternalHtml.current = html;
          onChange(html);
        }}
        dangerouslySetInnerHTML={{ __html: value ?? '' }}
      />
    </div>
  );
}

