import { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading2, Undo, Redo, Link as LinkIcon, Unlink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return; // cancelled

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
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
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            'p-2 rounded hover:bg-gray-200 transition-colors',
            editor.isActive('heading', { level: 2 }) && 'bg-gray-300'
          )}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </button>
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
          onClick={setLink}
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
            onClick={() => editor.chain().focus().unsetLink().run()}
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

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[150px] focus:outline-none"
      />
    </div>
  );
}
