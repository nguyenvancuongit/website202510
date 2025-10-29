"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import { Extension, mergeAttributes, Node } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo,
  Space,
  Strikethrough,
  SubscriptIcon,
  SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo,
  Video as VideoIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/error-handler";
import { uploadAPI } from "@/services/api";
import { useAuthStore } from "@/store/auth-store";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#84CC16",
];

const LINE_HEIGHTS = ["1", "1.1", "1.2", "1.3", "1.4", "1.5", "2"];

const FONT_SIZES = [
  { value: "12px", label: "12px" },
  { value: "14px", label: "14px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px" },
  { value: "28px", label: "28px" },
  { value: "32px", label: "32px" },
  { value: "36px", label: "36px" },
  { value: "48px", label: "48px" },
];

const FONT_FAMILIES = [
  { value: "Source Han Sans", label: "Source Han Sans" },
  { value: "Alibaba PuHuiTi-R", label: "Alibaba PuHuiTi-R" },
];

const BULLET_LIST_STYLES = [
  { value: "disc", label: "实心圆点 (•)", cssClass: "list-disc" },
  { value: "circle", label: "空心圆点 (○)", cssClass: "list-circle" },
  { value: "square", label: "方块 (▪)", cssClass: "list-square" },
];

const ORDERED_LIST_STYLES = [
  { value: "decimal", label: "数字 (1, 2, 3...)", cssClass: "list-decimal" },
  { value: "lower-alpha", label: "小写字母 (a, b, c...)", cssClass: "list-lower-alpha" },
  { value: "upper-alpha", label: "大写字母 (A, B, C...)", cssClass: "list-upper-alpha" },
  { value: "lower-roman", label: "小写罗马数字 (i, ii, iii...)", cssClass: "list-lower-roman" },
  { value: "upper-roman", label: "大写罗马数字 (I, II, III...)", cssClass: "list-upper-roman" }
]

// Custom BulletList Extension with style support
const BulletListWithStyle = Node.create({
  name: "bulletList",
  group: "block list",
  content: "listItem+",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      listStyleType: {
        default: "disc",
        parseHTML: (element) => {
          const style = element.style.listStyleType;
          const className = element.className;
          if (style) return style;
          if (className.includes("list-circle")) return "circle";
          if (className.includes("list-square")) return "square";
          return "disc";
        },
        renderHTML: (attributes) => {
          return {
            style: `list-style-type: ${attributes.listStyleType}`,
            class: `list-${attributes.listStyleType}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "ul" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      toggleBulletList:
        () =>
          ({ commands }: { commands: any }) => {
            return commands.toggleList(this.name, "listItem");
          },
      setBulletListStyle:
        (listStyleType: string) =>
          ({ commands }: { commands: any }) => {
            return commands.updateAttributes(this.name, { listStyleType });
          },
    };
  },
});

const OrderedListWithStyle = Node.create({
  name: "orderedList",
  group: "block list",
  content: "listItem+",
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  addAttributes() {
    return {
      listStyleType: {
        default: "disc",
        parseHTML: (element) => {
          const style = element.style.listStyleType;
          const className = element.className;
          if (style) return style;
          // if (className.includes("decimal")) return "decimal";
          if (className.includes("lower-alpha")) return "lower-alpha";
          if (className.includes("upper-alpha")) return "upper-alpha";
          if (className.includes("lower-roman")) return "lower-roman";
          if (className.includes("upper-roman")) return "upper-roman";
          return "decimal";
        },
        renderHTML: (attributes) => {
          return {
            style: `list-style-type: ${attributes.listStyleType}`,
            class: `list-${attributes.listStyleType}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "ul" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addCommands() {
    return {
      toggleOrderedList:
        () =>
          ({ commands }: { commands: any }) => {
            return commands.toggleList(this.name, "listItem");
          },
      setOrderedListStyle:
        (listStyleType: string) =>
          ({ commands }: { commands: any }) => {
            return commands.updateAttributes(this.name, { listStyleType });
          },
    };
  },
});

// Line Height Extension
const LineHeightExtension = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { lineHeight })
              .updateAttributes("paragraph", { lineHeight })
              .updateAttributes("heading", { lineHeight })
              .run();
          },
      unsetLineHeight:
        () =>
          ({ chain }) => {
            return chain()
              .setMark("textStyle", { lineHeight: null })
              .updateAttributes("paragraph", { lineHeight: null })
              .updateAttributes("heading", { lineHeight: null })
              .run();
          },
    };
  },
});

// Video Extension
const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      poster: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "video",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        style: "max-width: 100%; height: auto;",
      }),
    ];
  },
  addCommands() {
    return {
      setVideo:
        (options: any) =>
          ({ commands }: any) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            });
          },
    } as any;
  },
});

// Block-level Image with alignment & selection support
const BlockImage = Image.extend({
  name: "image",
  inline() {
    return false;
  },
  group() {
    return "block";
  },
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      ...(this as any).parent?.(),
      align: {
        default: "left",
        parseHTML: (element: HTMLElement) => {
          const fromAttr = element.getAttribute("data-align");
          if (
            fromAttr === "center" ||
            fromAttr === "right" ||
            fromAttr === "left"
          ) {
            return fromAttr;
          }
          const style = element.getAttribute("style") || "";
          const hasMlAuto = /margin-left:\s*auto/i.test(style);
          const hasMrAuto = /margin-right:\s*auto/i.test(style);
          if (hasMlAuto && hasMrAuto) {
            return "center";
          }
          if (hasMlAuto) {
            return "right";
          }
          return "left";
        },
        renderHTML: (attributes: any) => {
          return { "data-align": attributes.align };
        },
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    } as any;
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: any }) {
    const attrs: any = { ...HTMLAttributes };
    const align = attrs.align || attrs["data-align"] || "left";
    delete attrs["data-align"];

    let style = "max-width: 100%; height: auto;";
    if (align === "center") {
      style += " display: block; margin-left: auto; margin-right: auto;";
    } else if (align === "right") {
      style += " display: block; margin-left: auto;";
    } else {
      style += " display: block;";
    }

    return [
      "img",
      mergeAttributes(attrs, {
        style,
        class: "rounded-lg",
      }),
    ];
  },
  addCommands() {
    return {
      setImageAlign:
        (alignment: "left" | "center" | "right") =>
          ({ commands }: any) => {
            return commands.updateAttributes("image", { align: alignment });
          },
    } as any;
  },
});

export function RichTextEditor({
  content,
  onChange,
  // placeholder = "开始输入...",
  minHeight = "400px",
}: RichTextEditorProps) {
  const { token } = useAuthStore();
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [customColor, setCustomColor] = useState("#000000");
  const [customBgColor, setCustomBgColor] = useState("#ffff00");
  const [bulletListStyle, setBulletListStyle] = useState("");
  const [orderListStyle, setOrderListStyle] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: false, // Disable default bulletList
        listItem: false, // Disable default listItem
        orderedList: false
      }),
      ListItem,
      BulletListWithStyle,
      OrderedListWithStyle,
      BlockImage.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Video,
      Subscript,
      Superscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Color,
      TextStyle,
      FontSize,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
      LineHeightExtension,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate [&_img]:mx-auto max-w-none p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        style: `min-height: ${minHeight}`,
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) {
          return false;
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf("image") !== -1) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              uploadImage(file);
            }
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor
        .chain()
        .focus()
        .insertContent({ type: "image", attrs: { src: imageUrl } })
        .updateAttributes("image", { align: "left" })
        .run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  }, [editor, imageUrl]);

  const addVideo = useCallback(() => {
    if (videoUrl && editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "video",
          attrs: { src: videoUrl },
        })
        .run();
      setVideoUrl("");
      setShowVideoDialog(false);
    }
  }, [editor, videoUrl]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!token) {
        toast.error("需要登录才能上传图片");
        return;
      }

      setUploadingImage(true);
      try {
        const result = await uploadAPI.uploadImage(file, token);
        const imageUrl = result.data.url;

        if (editor) {
          editor
            .chain()
            .focus()
            .insertContent({ type: "image", attrs: { src: imageUrl } })
            .updateAttributes("image", { align: "left" })
            .run();
        }

        toast.success("图片上传成功");
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = getErrorMessage(error, "图片上传失败");
        toast.error(errorMessage);
      } finally {
        setUploadingImage(false);
      }
    },
    [editor, token]
  );

  const uploadVideo = useCallback(
    async (file: File) => {
      if (!token) {
        toast.error("需要登录才能上传视频");
        return;
      }

      setUploadingVideo(true);
      try {
        const result = await uploadAPI.uploadVideo(file, token);
        const videoUrl = result.data.url;

        if (editor) {
          editor
            .chain()
            .focus()
            .insertContent({
              type: "video",
              attrs: { src: videoUrl },
            })
            .run();
        }

        toast.success("视频上传成功");
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage = getErrorMessage(error, "视频上传失败");
        toast.error(errorMessage);
      } finally {
        setUploadingVideo(false);
      }
    },
    [editor, token]
  );

  const handleFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleVideoUpload = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("请选择图片文件");
          return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("图片大小不能超过5MB");
          return;
        }

        uploadImage(file);
      }
      // Reset input
      event.target.value = "";
    },
    [uploadImage]
  );

  const handleVideoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("video/")) {
          toast.error("请选择视频文件");
          return;
        }

        // Validate file size (100MB)
        if (file.size > 100 * 1024 * 1024) {
          toast.error("视频大小不能超过100MB");
          return;
        }

        uploadVideo(file);
      }
      // Reset input
      event.target.value = "";
    },
    [uploadVideo]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg">
      {/* Selected image highlight and editor-specific styles */}
      <style jsx global>{`
        .prose img.ProseMirror-selectednode {
          outline: 2px solid #3b82f6; /* tailwind blue-600 */
          border-radius: 0.5rem;
        }
        /* Bullet list styles */
        .prose ul.list-disc {
          list-style-type: disc;
        }
        .prose ul.list-circle {
          list-style-type: circle;
        }
        .prose ul.list-square {
          list-style-type: square;
        }
      `}</style>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant={editor.isActive("bold") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("strike") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant={
              editor.isActive("image")
                ? (editor.getAttributes("image").align || "left") === "left"
                  ? "default"
                  : "ghost"
                : editor.isActive({ textAlign: "left" })
                  ? "default"
                  : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.isActive("image")
                ? editor
                  .chain()
                  .focus()
                  .command(({ commands }: any) =>
                    commands.updateAttributes("image", { align: "left" })
                  )
                  .run()
                : editor.chain().focus().setTextAlign("left").run()
            }
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("image")
                ? (editor.getAttributes("image").align || "left") === "center"
                  ? "default"
                  : "ghost"
                : editor.isActive({ textAlign: "center" })
                  ? "default"
                  : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.isActive("image")
                ? editor
                  .chain()
                  .focus()
                  .command(({ commands }: any) =>
                    commands.updateAttributes("image", { align: "center" })
                  )
                  .run()
                : editor.chain().focus().setTextAlign("center").run()
            }
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("image")
                ? (editor.getAttributes("image").align || "left") === "right"
                  ? "default"
                  : "ghost"
                : editor.isActive({ textAlign: "right" })
                  ? "default"
                  : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.isActive("image")
                ? editor
                  .chain()
                  .focus()
                  .command(({ commands }: any) =>
                    commands.updateAttributes("image", { align: "right" })
                  )
                  .run()
                : editor.chain().focus().setTextAlign("right").run()
            }
          >
            <AlignRight className="w-4 h-4" />
          </Button>
          {editor.isActive("image") && (
            <span className="ml-2 text-xs text-gray-600">
              图片对齐：
              {(() => {
                const a = (editor.getAttributes("image").align || "left") as
                  | "left"
                  | "center"
                  | "right";
                return a === "left" ? "居左" : a === "center" ? "居中" : "居右";
              })()}
            </span>
          )}
        </div>

        {/* Subscript & Superscript */}
        <div className="flex gap-1 border-r border-gray-300 pr-2 mr-2">
          <Button
            size={"sm"}
            type="button"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            variant={editor.isActive("subscript") ? "default" : "ghost"}
            title="Subscript"
          >
            <SubscriptIcon size={18} />
          </Button>
          <Button
            size={"sm"}
            type="button"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            variant={editor.isActive("superscript") ? "default" : "ghost"}
            title="Superscript"
          >
            <SuperscriptIcon size={18} />
          </Button>
        </div>

        {/* Line Height */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Select
            onValueChange={(value) => {
              editor.chain().focus().setLineHeight(value).run();
            }}
          >
            <SelectTrigger className="h-9 w-auto gap-1 px-2 border-none bg-transparent hover:bg-accent hover:text-accent-foreground">
              <Space className="w-4 h-4" />
              <SelectValue placeholder="行高" />
            </SelectTrigger>
            <SelectContent>
              {LINE_HEIGHTS.map((height) => (
                <SelectItem key={height} value={height}>
                  {height}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Select
            onValueChange={(value) => {
              editor.chain().focus().setFontSize(value).run();
            }}
          >
            <SelectTrigger className="h-9 w-auto gap-1 px-2 border-none bg-transparent hover:bg-accent hover:text-accent-foreground">
              <SelectValue placeholder="字号" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Family */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Select
            onValueChange={(value) => {
              editor.chain().focus().setFontFamily(value).run();
            }}
          >
            <SelectTrigger className="h-9 w-auto gap-1 px-2 border-none bg-transparent hover:bg-accent hover:text-accent-foreground">
              <SelectValue placeholder="字体" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists and Quote */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className="gap-0"
                variant={editor.isActive("bulletList") ? "default" : "ghost"}
                size="sm"

              >
                <List className="w-4 h-4" />
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2">
              <DropdownMenuRadioGroup className="space-y-1">
                {BULLET_LIST_STYLES.map((style) => (
                  <DropdownMenuRadioItem
                    key={style.value}
                    value={style.value}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-accent transition-colors ${bulletListStyle === style.value ? "bg-accent" : ""
                      }`}
                    onClick={() => {
                      setBulletListStyle(style.value);
                      const editorChain = editor
                        .chain()
                        .focus()
                      if (!editor.isActive("bulletList")) {
                        editorChain.toggleBulletList();
                      }
                      editorChain.command(({ commands }: { commands: any }) =>
                        commands.updateAttributes("bulletList", {
                          listStyleType: style.value,
                        })
                      )
                        .run();
                    }}
                  >
                    {style.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                className="gap-0"
                variant={editor.isActive("orderedList") ? "default" : "ghost"}
                size="sm"

              >
                <ListOrdered className="size-4" />
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-2">
              <DropdownMenuRadioGroup className="space-y-1">
                {ORDERED_LIST_STYLES.map((style) => (
                  <DropdownMenuRadioItem
                    key={style.value}
                    value={style.value}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-accent transition-colors ${orderListStyle === style.value ? "bg-accent" : ""
                      }`}
                    onClick={() => {
                      setOrderListStyle(style.value);
                      const editorChain = editor
                        .chain()
                        .focus()
                      if (!editor.isActive("orderedList")) {
                        editorChain.toggleOrderedList();
                      }
                      editorChain.command(({ commands }: { commands: any }) =>
                        commands.updateAttributes("orderedList", {
                          listStyleType: style.value,
                        })
                      )
                        .run();
                    }}
                  >
                    {style.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant={editor.isActive("blockquote") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("code") ? "default" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        {/* Color */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">预设颜色</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          editor.chain().focus().setColor(color).run()
                        }
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-2">自定义颜色</h4>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-9 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1 h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        editor.chain().focus().setColor(customColor).run();
                      }}
                    >
                      应用
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Background Color */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <Highlighter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">预设背景色</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHighlight({ color })
                            .run()
                        }
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium mb-2">自定义背景色</h4>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      className="w-12 h-9 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      placeholder="#ffff00"
                      className="flex-1 h-9"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .toggleHighlight({ color: customBgColor })
                          .run();
                      }}
                    >
                      应用
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Link, Image and Video */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={editor.isActive("link") ? "default" : "ghost"}
                size="sm"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">添加链接</h4>
                <Input
                  placeholder="输入链接地址"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addLink}>
                    添加
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLinkDialog(false)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showImageDialog} onOpenChange={setShowImageDialog}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">添加图片</h4>

                {/* Upload section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    {uploadingImage ? "上传中..." : "点击上传图片或拖拽到此处"}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleFileUpload}
                    disabled={uploadingImage}
                    className="mb-2"
                  >
                    选择文件
                  </Button>
                  <p className="text-xs text-gray-500">
                    支持 JPG, PNG, GIF, WebP，最大 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center text-gray-500 text-sm">或</div>

                <Input
                  placeholder="输入图片地址"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addImage}>
                    添加
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageDialog(false)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={showVideoDialog} onOpenChange={setShowVideoDialog}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <VideoIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">添加视频</h4>

                {/* Upload section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <VideoIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    {uploadingVideo ? "上传中..." : "点击上传视频或拖拽到此处"}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleVideoUpload}
                    disabled={uploadingVideo}
                    className="mb-2"
                  >
                    选择文件
                  </Button>
                  <p className="text-xs text-gray-500">
                    支持 MP4, WebM, OGG, MOV，最大 100MB
                  </p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center text-gray-500 text-sm">或</div>

                <Input
                  placeholder="输入视频地址"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addVideo();
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addVideo}>
                    添加
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVideoDialog(false)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
