"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

import { RichTextEditor } from "@/components/admin/posts/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFileTypeFromMedia } from "@/helpers";
import {
  CaseStudyStatus,
  useCaseStudyDetail,
  useCreateCaseStudy,
  useUpdateCaseStudy,
} from "@/hooks/api/use-case-studies";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";

import { CaseStudyPreview } from "./case-study-preview";

// Schema validation
const fileSchema = z
  .instanceof(File, { error: "请选择有效的文件" })
  .refine((file) => file.size > 0, "请选择文件")
  .refine((file) => file.size <= 10 * 1024 * 1024, "文件大小不能超过10MB")
  .refine((file) => file.type.startsWith("image/"), "请选择有效的图片文件");

const caseStudySchema = z.object({
  title: z.string().min(1, "请输入案例标题"),
  content: z.string().optional(),
  category_id: z.number().min(1, "请选择分类"),
  customer_name: z.string().optional(),
  key_highlights: z.array(z.string()).optional(),
  highlight_description: z.string().optional(),
  customer_feedback: z.string().optional(),
  webThumbnailFile: fileSchema.optional(),
  mobileThumbnailFile: fileSchema.optional(),
  customerLogoFile: fileSchema.optional(),
});

type CaseStudyFormData = z.infer<typeof caseStudySchema>;

interface CaseStudyFormProps {
  mode: "create" | "edit";
  id?: string;
}

export function CaseStudyForm({ mode, id }: CaseStudyFormProps) {
  const router = useRouter();
  const [keyHighlights, setKeyHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Media removal flags
  const [removeWebThumbnail, setRemoveWebThumbnail] = useState(false);
  const [removeMobileThumbnail, setRemoveMobileThumbnail] = useState(false);
  const [removeCustomerLogo, setRemoveCustomerLogo] = useState(false);
  const createCaseStudyMutation = useCreateCaseStudy();
  const updateCaseStudyMutation = useUpdateCaseStudy();

  // Hooks
  const { data: caseStudy, isLoading: loading } = useCaseStudyDetail(
    mode === "edit" && id ? Number(id) : undefined
  );

  const { data: categoriesResponse } = useCategories(CategoryType.CASE_STUDY, {
    limit: 100,
  });

  const categories = categoriesResponse?.data || [];

  const form = useForm<CaseStudyFormData>({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: 0,
      customer_name: "",
      key_highlights: [],
      highlight_description: "",
      customer_feedback: "",
    },
  });

  // Load data for edit mode
  useEffect(() => {
    if (mode === "edit" && caseStudy && id) {
      // Use setValue instead of reset to maintain better control
      form.setValue("title", caseStudy.title || "");
      form.setValue("content", caseStudy.content || "");
      form.setValue("category_id", parseInt(caseStudy.category_id) || 0);
      form.setValue("customer_name", caseStudy.customer_name || "");
      form.setValue(
        "highlight_description",
        caseStudy.highlight_description || ""
      );
      form.setValue("customer_feedback", caseStudy.customer_feedback || "");

      setKeyHighlights(caseStudy.key_highlights || []);
    }
  }, [mode, caseStudy, id, form]);

  const handleWebThumbnailSelect = (file: File | null) => {
    if (file) {
      form.setValue("webThumbnailFile", file);
      form.trigger("webThumbnailFile");
      clearFieldError("webThumbnailFile");
      setRemoveWebThumbnail(false);
    } else {
      form.setValue("webThumbnailFile", undefined);
      form.trigger("webThumbnailFile");
      // If we have existing image and user clicked remove, mark it for removal
      if (mode === "edit" && caseStudy?.web_thumbnail && !removeWebThumbnail) {
        setRemoveWebThumbnail(true);
      }
    }
  };

  const handleMobileThumbnailSelect = (file: File | null) => {
    if (file) {
      form.setValue("mobileThumbnailFile", file);
      form.trigger("mobileThumbnailFile");
      clearFieldError("mobileThumbnailFile");
      setRemoveMobileThumbnail(false);
    } else {
      form.setValue("mobileThumbnailFile", undefined);
      form.trigger("mobileThumbnailFile");
      // If we have existing image and user clicked remove, mark it for removal
      if (
        mode === "edit" &&
        caseStudy?.mobile_thumbnail &&
        !removeMobileThumbnail
      ) {
        setRemoveMobileThumbnail(true);
      }
    }
  };

  const handleCustomerLogoSelect = (file: File | null) => {
    if (file) {
      form.setValue("customerLogoFile", file);
      form.trigger("customerLogoFile");
      clearFieldError("customerLogoFile");
      setRemoveCustomerLogo(false);
    } else {
      form.setValue("customerLogoFile", undefined);
      form.trigger("customerLogoFile");
      // If we have existing image and user clicked remove, mark it for removal
      if (mode === "edit" && caseStudy?.customer_logo && !removeCustomerLogo) {
        setRemoveCustomerLogo(true);
      }
    }
  };

  const submitWithStatus = async (status: CaseStudyStatus) => {
    const formData = form.getValues();
    const {
      webThumbnailFile,
      mobileThumbnailFile,
      customerLogoFile,
      ...restData
    } = formData;

    // First validate basic required fields (title and category)
    if (!restData.title || restData.title.trim() === "") {
      toast.error("请输入案例标题");
      form.setError("title", { message: "请输入案例标题" });
      return;
    }

    if (!restData.category_id || restData.category_id === 0) {
      toast.error("请选择分类");
      form.setError("category_id", { message: "请选择分类" });
      return;
    }

    // Additional validation for publishing or unpublishing
    const isDrafting = status === CaseStudyStatus.DRAFT;

    if (!isDrafting) {
      // Validate content for publishing
      if (!restData.content || restData.content.trim().length < 10) {
        toast.error("发布案例需要填写详细内容（至少10个字符）");
        form.setError("content", {
          message: "发布案例需要填写详细内容（至少10个字符）",
        });
        return;
      }

      // Validate customer information for publishing or unpublishing
      if (!restData.customer_name || restData.customer_name.trim() === "") {
        toast.error("发布案例需要填写客户名称");
        form.setError("customer_name", { message: "请输入客户名称" });
        return;
      }

      // Validate key highlights for publishing or unpublishing
      if (
        !keyHighlights ||
        keyHighlights.filter((h) => h.trim() !== "").length === 0
      ) {
        toast.error("发布案例需要添加至少一个核心亮点");
        return;
      }

      // Validate files for publishing or unpublishing
      if (mode === "create") {
        // For create mode, require new files
        if (!webThumbnailFile) {
          toast.error("发布案例需要上传PC端缩略图");
          form.setError("webThumbnailFile", { message: "请上传PC端缩略图" });
          return;
        }

        if (!mobileThumbnailFile) {
          toast.error("发布案例需要上传移动端缩略图");
          form.setError("mobileThumbnailFile", {
            message: "请上传移动端缩略图",
          });
          return;
        }

        if (!customerLogoFile) {
          toast.error("发布案例需要上传客户Logo");
          form.setError("customerLogoFile", { message: "请上传客户Logo" });
          return;
        }
      } else if (mode === "edit") {
        // For edit mode, check if we have either new files or existing files (not marked for removal)
        const hasWebThumbnail =
          webThumbnailFile || (caseStudy?.web_thumbnail && !removeWebThumbnail);
        const hasMobileThumbnail =
          mobileThumbnailFile ||
          (caseStudy?.mobile_thumbnail && !removeMobileThumbnail);
        const hasCustomerLogo =
          customerLogoFile || (caseStudy?.customer_logo && !removeCustomerLogo);

        if (!hasWebThumbnail) {
          toast.error("发布案例需要PC端缩略图");
          form.setError("webThumbnailFile", { message: "请上传PC端缩略图" });
          return;
        }

        if (!hasMobileThumbnail) {
          toast.error("发布案例需要移动端缩略图");
          form.setError("mobileThumbnailFile", {
            message: "请上传移动端缩略图",
          });
          return;
        }

        if (!hasCustomerLogo) {
          toast.error("发布案例需要客户Logo");
          form.setError("customerLogoFile", { message: "请上传客户Logo" });
          return;
        }
      }
    }

    const updatedData = {
      ...restData,
      status,
      featured: false,
      content: restData.content || "", // Ensure content is always string
      key_highlights: keyHighlights.filter((h) => h.trim() !== ""),
    };

    if (mode === "edit" && id) {
      // Update existing case study
      const updateFiles: any = {};
      if (webThumbnailFile) {
        updateFiles.webThumbnail = webThumbnailFile;
      }
      if (mobileThumbnailFile) {
        updateFiles.mobileThumbnail = mobileThumbnailFile;
      }
      if (customerLogoFile) {
        updateFiles.customerLogo = customerLogoFile;
      }

      // Always include removal flags when updating
      const updateDataWithRemoval = {
        ...updatedData,
        removeWebThumbnail: removeWebThumbnail || false,
        removeMobileThumbnail: removeMobileThumbnail || false,
        removeCustomerLogo: removeCustomerLogo || false,
      };

      updateCaseStudyMutation.mutate(
        {
          id: Number(id),
          data: updateDataWithRemoval,
          files: updateFiles,
        },
        {
          onSuccess: () => {
            toast.success("案例更新成功");
            router.push("/case-studies/posts");
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "更新案例时出错，请重试"
            );
          },
        }
      );
    } else {
      // Create new case study
      const createFiles: any = {};
      if (webThumbnailFile) {
        createFiles.webThumbnail = webThumbnailFile;
      }
      if (mobileThumbnailFile) {
        createFiles.mobileThumbnail = mobileThumbnailFile;
      }
      if (customerLogoFile) {
        createFiles.customerLogo = customerLogoFile;
      }

      createCaseStudyMutation.mutate(
        {
          data: updatedData,
          files: createFiles,
        },
        {
          onSuccess: () => {
            toast.success(
              status === CaseStudyStatus.PUBLISHED
                ? "案例发布成功"
                : "草稿保存成功"
            );
            router.push("/case-studies/posts");
          },
          onError: (error) => {
            console.error("保存案例失败:", error);
            toast.error("保存案例失败");
          },
        }
      );
    }
  };

  const handleSaveDraft = () => {
    submitWithStatus(CaseStudyStatus.DRAFT);
  };

  const handleSaveAndPublish = () => {
    submitWithStatus(CaseStudyStatus.PUBLISHED);
  };

  const addKeyHighlight = () => {
    if (newHighlight.trim() && !keyHighlights.includes(newHighlight.trim())) {
      const updatedHighlights = [
        ...keyHighlights.filter((h) => h.trim() !== ""),
        newHighlight.trim(),
      ];
      setKeyHighlights(updatedHighlights);
      setNewHighlight("");

      // Clear validation error if we now have highlights
      if (updatedHighlights.length > 0) {
        // Note: We can't clear errors for keyHighlights directly since it's not a form field
        // The validation will pass on next submit
      }
    }
  };

  const removeKeyHighlight = (indexToRemove: number) => {
    setKeyHighlights(
      keyHighlights.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyHighlight();
    }
  };

  // Clear errors when fields are updated
  const clearFieldError = (fieldName: keyof CaseStudyFormData) => {
    form.clearErrors(fieldName);
  };

  if (mode === "edit" && !loading && (!caseStudy || caseStudy.status === CaseStudyStatus.PUBLISHED)) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>案例标题 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="输入案例标题"
                    {...field}
                    className="h-12"
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.trim()) {
                        clearFieldError("title");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Field */}
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>所属分类 *</FormLabel>
                  <Select
                    value={
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    onValueChange={(value) => {
                      // Only process non-empty values to prevent reset to 0
                      if (value && value.trim() !== "") {
                        const numValue = parseInt(value);
                        field.onChange(numValue);
                        if (numValue > 0) {
                          clearFieldError("category_id");
                        }
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="请选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="placeholder" disabled>
                          暂无可用分类
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Cover Images Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">封面图片</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Thumbnail Upload */}
              <FormField
                control={form.control}
                name="webThumbnailFile"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      PC端 *
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG、WebP格式; 图片建议尺寸：1920px ×
                      600px)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleWebThumbnailSelect}
                        allowedFileType="image"
                        maxImageSize={5}
                        dimensions={{ width: 1920, height: 600 }}
                        placeholder="点击上传或拖拽PC端缩略图到这里"
                        description="支持 JPG、PNG、建议尺寸 1920x600px"
                        acceptedFormats="image/jpeg,image/png"
                        initialPreviewUrl={
                          !removeWebThumbnail
                            ? caseStudy?.web_thumbnail?.path
                            : undefined
                        }
                        initialFileName={
                          !removeWebThumbnail && caseStudy?.web_thumbnail
                            ? "当前PC端缩略图"
                            : undefined
                        }
                        initialFileType={
                          !removeWebThumbnail
                            ? getFileTypeFromMedia(
                              caseStudy?.web_thumbnail ?? null
                            )
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Thumbnail Upload */}
              <FormField
                control={form.control}
                name="mobileThumbnailFile"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      H5端 *
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG; 图片建议尺寸：750px × 400px)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleMobileThumbnailSelect}
                        allowedFileType="image"
                        maxImageSize={5}
                        dimensions={{ width: 750, height: 400 }}
                        placeholder="点击上传或拖拽移动端缩略图到这里"
                        description="支持 JPG、PNG，建议尺寸 750x400px"
                        acceptedFormats="image/jpeg,image/png"
                        initialPreviewUrl={
                          !removeMobileThumbnail
                            ? caseStudy?.mobile_thumbnail?.path
                            : undefined
                        }
                        initialFileName={
                          !removeMobileThumbnail && caseStudy?.mobile_thumbnail
                            ? "当前移动端缩略图"
                            : undefined
                        }
                        initialFileType={
                          !removeMobileThumbnail
                            ? getFileTypeFromMedia(
                              caseStudy?.mobile_thumbnail ?? null
                            )
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Customer Name */}
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>客户名称 *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="输入客户名称"
                    {...field}
                    className="h-12"
                    onChange={(e) => {
                      field.onChange(e);
                      if (e.target.value.trim()) {
                        clearFieldError("customer_name");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Logo Upload */}
          <FormField
            control={form.control}
            name="customerLogoFile"
            render={() => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  客户Logo *
                </FormLabel>
                <p className="text-sm text-gray-500 mb-4">
                  (图片支持格式：JPG、PNG 图片建议尺寸：400px × 400px)
                </p>
                <FormControl>
                  <FileUpload
                    onFileSelect={handleCustomerLogoSelect}
                    allowedFileType="image"
                    maxImageSize={5}
                    acceptedFormats="image/jpeg,image/png"
                    dimensions={{ width: 400, height: 400 }}
                    previewMode="fixed"
                    placeholder="点击上传或拖拽客户Logo到这里"
                    description="支持 JPG、PNG，建议尺寸 400x400px"
                    initialPreviewUrl={
                      !removeCustomerLogo
                        ? caseStudy?.customer_logo?.path
                        : undefined
                    }
                    initialFileName={
                      !removeCustomerLogo && caseStudy?.customer_logo
                        ? "当前客户Logo"
                        : undefined
                    }
                    initialFileType={
                      !removeCustomerLogo
                        ? getFileTypeFromMedia(caseStudy?.customer_logo ?? null)
                        : undefined
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key Highlights */}
          <FormItem>
            <FormLabel className="text-base font-medium">核心亮点 *</FormLabel>

            {/* Display existing highlights as badges */}
            {keyHighlights.filter((h) => h.trim() !== "").length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {keyHighlights
                  .filter((h) => h.trim() !== "")
                  .map((highlight, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1"
                    >
                      {highlight}
                      <button
                        type="button"
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => removeKeyHighlight(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            )}

            {/* Input for new highlight */}
            <div className="flex gap-2">
              <Input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入核心亮点，按 Enter 添加"
                className="flex-1 h-12"
              />
            </div>
          </FormItem>

          {/* Highlight Description */}
          <FormField
            control={form.control}
            name="highlight_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>亮点描述</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="请输入亮点描述..."
                    minHeight="200px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Feedback */}
          <FormField
            control={form.control}
            name="customer_feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>客户反馈</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="请输入客户反馈..."
                    minHeight="200px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>案例文章 *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value && value.trim().length >= 10) {
                        clearFieldError("content");
                      }
                    }}
                    placeholder="请输入案例详细内容..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-center space-x-4 pt-6">
            {/* Preview */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  预览
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <CaseStudyPreview
                  data={{
                    ...form.watch(),
                    content: form.watch("content") || "",
                    key_highlights: keyHighlights.filter(
                      (h) => h.trim() !== ""
                    ),
                    featured: false,
                    status: CaseStudyStatus.DRAFT,
                  }}
                  categories={categories || []}
                />
              </DialogContent>
            </Dialog>

            {/* Save Draft */}
            <Button
              type="button"
              variant="outline"
              disabled={
                createCaseStudyMutation.isPending ||
                updateCaseStudyMutation.isPending
              }
              onClick={handleSaveDraft}
            >
              保存草稿
            </Button>

            {/* Save and Publish */}
            <Button
              type="button"
              disabled={
                createCaseStudyMutation.isPending ||
                updateCaseStudyMutation.isPending
              }
              onClick={handleSaveAndPublish}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {createCaseStudyMutation.isPending ||
                updateCaseStudyMutation.isPending
                ? "发布中..."
                : "保存并发布"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
