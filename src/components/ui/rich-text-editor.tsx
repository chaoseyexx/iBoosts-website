"use client";

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo,
    RemoveFormatting
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const ToolbarButton = ({ editor, format, icon: Icon, onClick, active }: { editor: Editor | null, format?: string, icon: any, onClick?: () => void, active?: boolean }) => {
    if (!editor) return null;

    const isActive = active !== undefined ? active : (format ? editor.isActive(format) : false);
    const handleClick = onClick || (format ? () => editor.chain().focus().toggleMark(format).run() : undefined);

    if (!handleClick) return null;

    return (
        <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={handleClick}
            className="h-8 w-8 p-0 text-[#9ca3af] hover:text-[#fdfcf0] hover:bg-[#2d333b] data-[state=on]:bg-[#f5a623]/20 data-[state=on]:text-[#f5a623]"
        >
            <Icon className="h-4 w-4" />
        </Toggle>
    );
};

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const addImage = useCallback(() => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);


    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#2d333b] bg-[#161b22] rounded-t-lg">

            {/* History */}
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="h-8 w-8 text-[#9ca3af] hover:text-[#fdfcf0]">
                <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="h-8 w-8 text-[#9ca3af] hover:text-[#fdfcf0]">
                <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1 bg-[#2d333b]" />

            {/* Formatting */}
            <ToolbarButton editor={editor} format="bold" icon={Bold} onClick={() => editor.chain().focus().toggleBold().run()} />
            <ToolbarButton editor={editor} format="italic" icon={Italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
            <ToolbarButton editor={editor} format="underline" icon={UnderlineIcon} onClick={() => editor.chain().focus().toggleUnderline().run()} />
            <ToolbarButton editor={editor} format="strike" icon={Strikethrough} onClick={() => editor.chain().focus().toggleStrike().run()} />

            <Separator orientation="vertical" className="h-6 mx-1 bg-[#2d333b]" />

            {/* Alignment */}
            <ToolbarButton editor={editor} icon={AlignLeft} onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} />
            <ToolbarButton editor={editor} icon={AlignCenter} onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} />
            <ToolbarButton editor={editor} icon={AlignRight} onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} />

            <Separator orientation="vertical" className="h-6 mx-1 bg-[#2d333b]" />

            {/* Headings */}
            <ToolbarButton editor={editor} icon={Heading1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} />
            <ToolbarButton editor={editor} icon={Heading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} />

            <Separator orientation="vertical" className="h-6 mx-1 bg-[#2d333b]" />

            {/* Lists */}
            <ToolbarButton editor={editor} icon={List} onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} />
            <ToolbarButton editor={editor} icon={ListOrdered} onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} />
            <ToolbarButton editor={editor} icon={Quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} />

            <Separator orientation="vertical" className="h-6 mx-1 bg-[#2d333b]" />

            {/* Links & Media */}
            <ToolbarButton editor={editor} icon={LinkIcon} onClick={setLink} active={editor.isActive('link')} />
            <ToolbarButton editor={editor} icon={ImageIcon} onClick={addImage} active={editor.isActive('image')} />
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().unsetAllMarks().run()} className="h-8 w-8 text-[#9ca3af] hover:text-[#fdfcf0]">
                <RemoveFormatting className="h-4 w-4" />
            </Button>
        </div>
    );
};

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: placeholder || 'Write something...' }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "min-h-[150px] w-full bg-[#0a0e13] px-3 py-2 text-[#fdfcf0] focus:outline-none prose prose-invert max-w-none prose-p:my-1 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2",
                    className
                ),
            },
        },
        immediatelyRender: false,
    });

    return (
        <div className="w-full border border-[#2d333b] rounded-lg overflow-hidden bg-[#0a0e13] focus-within:border-[#f5a623]/50 transition-colors">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
