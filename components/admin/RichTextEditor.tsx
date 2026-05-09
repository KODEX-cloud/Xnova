"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useRef, useState } from "react";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Link2, Image as ImageIcon,
  List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo,
  RemoveFormatting, Quote, Code2, Youtube, Loader2,
} from "lucide-react";

// ── Video embed helpers ───────────────────────────────────────────────────────

function toEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

// React component rendered inside the editor for each video node
const VideoNodeView = ({ node }: NodeViewProps) => (
  <NodeViewWrapper>
    <div
      className="relative my-8 aspect-video w-full overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10"
      contentEditable={false}
    >
      <iframe
        src={node.attrs.src as string}
        title={(node.attrs.title as string) || "Vidéo intégrée"}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </NodeViewWrapper>
);

// Tiptap custom node for embedded videos
const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      title: { default: "Vidéo intégrée" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-video-embed]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-video-embed": "true" }, HTMLAttributes),
      [
        "iframe",
        {
          src: HTMLAttributes.src,
          frameborder: "0",
          allowfullscreen: "true",
          class: "w-full aspect-video rounded-2xl",
        },
      ],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },
});

// ── Toolbar helpers ───────────────────────────────────────────────────────────

const Btn = ({
  onClick, active, title, disabled, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded-md transition-all duration-150 ${
      active
        ? "bg-nova-red text-white shadow-sm"
        : "text-white/50 hover:text-white hover:bg-white/10"
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Sep = () => <span className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />;

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Commencez à écrire votre article…",
  minHeight = 420,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapImage.configure({ allowBase64: true, inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
      VideoEmbed,
    ],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-prose focus:outline-none",
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]); // eslint-disable-line

  // ── Image upload ──────────────────────────────────────────────────────────

  const handleImageFile = useCallback(async (file: File) => {
    if (!editor) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      }
    } finally {
      setUploading(false);
    }
  }, [editor]);

  // ── Video embed ───────────────────────────────────────────────────────────

  const insertVideo = useCallback(() => {
    if (!editor) return;
    const raw = window.prompt("Collez un lien YouTube ou Vimeo :");
    if (!raw) return;
    const embedSrc = toEmbedUrl(raw.trim());
    if (!embedSrc) {
      alert("Lien non reconnu. Collez un lien YouTube ou Vimeo valide.");
      return;
    }
    editor.chain().focus().insertContent({
      type: "videoEmbed",
      attrs: { src: embedSrc },
    }).run();
  }, [editor]);

  // ── Link ──────────────────────────────────────────────────────────────────

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL du lien :");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0D1117] flex flex-col">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 border-b border-white/10 bg-[#111827] sticky top-0 z-10">
        {/* Inline styles */}
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras (Ctrl+B)">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique (Ctrl+I)">
          <Italic size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné (Ctrl+U)">
          <UnderlineIcon size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré">
          <Strikethrough size={14} />
        </Btn>

        <Sep />

        {/* Headings */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Titre 1">
          <Heading1 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Titre 2">
          <Heading2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Titre 3">
          <Heading3 size={14} />
        </Btn>

        <Sep />

        {/* Lists & blocks */}
        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste à puces">
          <List size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Liste numérotée">
          <ListOrdered size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citation">
          <Quote size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Bloc de code">
          <Code2 size={14} />
        </Btn>

        <Sep />

        {/* Media */}
        <Btn onClick={addLink} active={editor.isActive("link")} title="Insérer un lien">
          <Link2 size={14} />
        </Btn>
        <Btn onClick={() => fileInputRef.current?.click()} title="Uploader une image" disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </Btn>
        <Btn onClick={insertVideo} title="Insérer une vidéo YouTube / Vimeo">
          <Youtube size={14} />
        </Btn>

        <Sep />

        {/* History */}
        <Btn onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)">
          <Undo size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Y)">
          <Redo size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Effacer le formatage">
          <RemoveFormatting size={14} />
        </Btn>
      </div>

      {/* ── Editor content ────────────────────────────────────────────────── */}
      <EditorContent editor={editor} className="tiptap-editor flex-1" />

      {/* ── Hidden file input ─────────────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleImageFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
