'use client';

// ============================================================
// RichTextEditor Component - TipTap-based WYSIWYG
// Hỗ trợ: Bold, Italic, Underline, Lists, Links, Headings,
//          Image Upload (button + paste clipboard)
// Output: HTML string
// ============================================================

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Heading1, Heading2,
  Undo, Redo, Quote, Minus, ImagePlus, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface RichTextEditorProps {
  /** Giá trị HTML */
  value?: string;
  /** Callback khi thay đổi */
  onChange: (html: string) => void;
  /** Label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
}

/** Upload file lên /api/upload → trả về URL */
const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('files', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Upload thất bại');
  }

  const data = await res.json();
  return data.urls[0];
};

const RichTextEditor = ({
  value = '',
  onChange,
  label = 'Mô tả chi tiết',
  placeholder = 'Nhập mô tả sản phẩm...',
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-4 outline-none text-text-secondary leading-relaxed',
      },
      // Xử lý paste ảnh từ clipboard
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file);
            }
            return true;
          }
        }
        return false;
      },
      // Xử lý drop ảnh vào editor
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        for (const file of files) {
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  // Upload ảnh → chèn URL vào editor
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ upload ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn, tối đa 5MB');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImageToServer(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      toast.success('Đã chèn ảnh');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Lỗi upload ảnh');
    } finally {
      setUploading(false);
    }
  }, [editor]);

  // Click button → mở file picker
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // File picker chọn xong
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Nhập URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  // Toolbar button helper
  const ToolBtn = ({
    onClick,
    isActive,
    children,
    title,
    disabled,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        'p-1.5 rounded transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-text-muted hover:bg-bg-secondary hover:text-navy',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <div className="border border-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
        {/* Hidden file input cho image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-2 border-b border-border-light bg-bg-secondary/50 flex-wrap">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
            <Bold size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
            <Italic size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
            <UnderlineIcon size={15} />
          </ToolBtn>

          <div className="w-px h-5 bg-border mx-1" />

          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
            <Heading1 size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
            <Heading2 size={15} />
          </ToolBtn>

          <div className="w-px h-5 bg-border mx-1" />

          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <List size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
            <ListOrdered size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <Quote size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus size={15} />
          </ToolBtn>

          <div className="w-px h-5 bg-border mx-1" />

          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <AlignLeft size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <AlignCenter size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <AlignRight size={15} />
          </ToolBtn>

          <div className="w-px h-5 bg-border mx-1" />

          <ToolBtn onClick={setLink} isActive={editor.isActive('link')} title="Link">
            <LinkIcon size={15} />
          </ToolBtn>

          {/* Nút upload ảnh */}
          <ToolBtn onClick={handleImageButtonClick} title="Chèn ảnh" disabled={uploading}>
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
          </ToolBtn>

          <div className="flex-1" />

          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={15} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={15} />
          </ToolBtn>
        </div>

        {/* Uploading indicator */}
        {uploading && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-xs text-primary border-b border-border-light">
            <Loader2 size={12} className="animate-spin" />
            Đang upload ảnh...
          </div>
        )}

        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
      <p className="text-xs text-text-muted mt-1.5">
        💡 Mẹo: Bạn có thể paste ảnh trực tiếp từ clipboard (Ctrl+V) hoặc kéo thả ảnh vào editor
      </p>
    </div>
  );
};

export default RichTextEditor;
