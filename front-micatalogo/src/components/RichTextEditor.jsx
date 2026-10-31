import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
  ['link', 'image'],
  ['clean'],
];

const isEmpty = (quill) => quill.getLength() <= 1 && !quill.root.querySelector('img');

// Quill 2 mounted directly on a ref: React 19 removed findDOMNode, which react-quill required.
export default function RichTextEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const emittedRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    const quill = new Quill(container.appendChild(document.createElement('div')), {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: {
          container: TOOLBAR,
          handlers: {
            // Store image links instead of embedding base64 files in the post.
            image() {
              const url = window.prompt('URL de la imagen (https://...)');
              if (!url) return;
              if (!/^https?:\/\//i.test(url.trim())) {
                window.alert('La imagen debe ser una URL http o https.');
                return;
              }
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url.trim(), 'user');
              quill.setSelection(range.index + 1, 0, 'silent');
            },
          },
        },
      },
    });

    quill.on('text-change', () => {
      const html = isEmpty(quill) ? '' : quill.getSemanticHTML();
      emittedRef.current = html;
      onChangeRef.current(html);
    });
    quillRef.current = quill;
    emittedRef.current = null;

    return () => {
      quillRef.current = null;
      container.innerHTML = '';
    };
  }, [placeholder]);

  // Load content coming from the parent (a fetched post) without resetting the cursor on each keystroke.
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill || (value || '') === emittedRef.current) return;
    quill.setContents(quill.clipboard.convert({ html: value || '' }), 'silent');
    emittedRef.current = value || '';
  }, [value]);

  return <div ref={containerRef} className="rich-text-editor" />;
}
