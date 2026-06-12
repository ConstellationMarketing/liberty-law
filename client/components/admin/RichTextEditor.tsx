import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Undo, Redo, Link as LinkIcon, Unlink, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
}: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [blockFormat, setBlockFormat] = useState('paragraph');
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  useEffect(() => {
    if (!editor) return;

    const updateBlockFormat = () => {
      const activeHeading = headingLevels.find((level) =>
        editor.isActive('heading', { level }),
      );
      setBlockFormat(activeHeading ? `heading-${activeHeading}` : 'paragraph');
    };

    updateBlockFormat();
    editor.on('selectionUpdate', updateBlockFormat);
    editor.on('transaction', updateBlockFormat);

    return () => {
      editor.off('selectionUpdate', updateBlockFormat);
      editor.off('transaction', updateBlockFormat);
    };
  }, [editor]);

  const applyBlockFormat = useCallback((value: string) => {
    if (!editor) return;

    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
      setBlockFormat('paragraph');
      return;
    }

    const level = Number(value.replace('heading-', '')) as HeadingLevel;
    if (headingLevels.includes(level)) {
      editor.chain().focus().setHeading({ level }).run();
      setBlockFormat(value);
    }
  }, [editor]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setShowLinkInput(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().unsetUnderline().run();
      onChange(editor.getHTML());
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run();
    }

    setShowLinkInput(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setShowLinkInput(false);
    setLinkUrl('');
    editor?.chain().focus().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('bold') && 'bg-gray-300'
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('italic') && 'bg-gray-300'
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('underline') && 'bg-gray-300'
          )}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <select
          value={blockFormat}
          onChange={(event) => applyBlockFormat(event.target.value)}
          className="h-9 rounded border border-gray-300 bg-white px-2 font-outfit text-sm text-gray-700 outline-none transition-colors hover:bg-gray-50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          title="Heading level"
          aria-label="Heading level"
        >
          <option value="paragraph">Paragraph</option>
          {headingLevels.map((level) => (
            <option key={level} value={`heading-${level}`}>
              Heading {level} {level === 1 ? '(H1)' : `(H${level})`}
            </option>
          ))}
        </select>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('bulletList') && 'bg-gray-300'
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('orderedList') && 'bg-gray-300'
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={openLinkInput}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('link') && 'bg-gray-300'
          )}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().extendMarkRange('link').unsetLink().unsetUnderline().run();
              onChange(editor.getHTML());
            }}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Remove Link"
          >
            <Unlink className="h-4 w-4" />
          </button>
        )}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* Inline link input bar */}
      {showLinkInput && (
        <div className="border-b bg-blue-50 px-3 py-2 flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-gray-500 shrink-0" />
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              }
              if (e.key === 'Escape') {
                cancelLink();
              }
            }}
            placeholder="Enter URL (e.g. https://example.com)"
            className="flex-1 text-sm px-2 py-1 border rounded bg-white outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={applyLink}
            className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title="Apply link"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={cancelLink}
            className="p-1.5 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[150px] focus:outline-none"
      />
    </div>
  );
}
