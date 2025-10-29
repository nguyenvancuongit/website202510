"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

import { RichTextEditor } from "@/components/admin/posts/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { getFileTypeFromMedia } from "@/helpers";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";
import {
  LatestNewsStatus,
  useCreateLatestNews,
  useLatestNewsDetail,
  useUpdateLatestNews,
} from "@/hooks/api/use-latest-news";
import { cn } from "@/lib/utils";

import { LatestNewsPreview } from "./latest-news-preview";

// Custom Zod validation for File objects
const fileSchema = z
  .instanceof(File, { error: "请选择有效的文件" })
  .refine((file) => file.size > 0, "请选择文件")
  .refine((file) => file.size <= 500 * 1024 * 1024, "文件大小不能超过500MB")
  .refine(
    (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    "请选择有效的图片或视频文件"
  );

const latestNewsSchema = z.object({
  title: z.string().min(1, "请输入资讯标题").max(50, "标题不能超过50个字符"),
  content: z.string().min(10, "内容不能少于10个字符"),
  category_id: z.string().min(1, "请选择分类"),
  description: z.string().min(10, "请输入资讯描述"),
  published_date: z.date().optional(),
  webMediaFile: fileSchema.optional().refine((file) => {
    if (!file) { return true; } // Optional field
    if (file.type.startsWith("image/")) {
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    }
    if (file.type.startsWith("video/")) {
      return [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
      ].includes(file.type);
    }
    return false;
  }, "请选择Web端文件，支持的格式：JPG、PNG、WebP、MP4等"),
  mobileMediaFile: fileSchema.optional().refine((file) => {
    if (!file) { return true; } // Optional field
    if (file.type.startsWith("image/")) {
      return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    }
    if (file.type.startsWith("video/")) {
      return [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/flv",
        "video/mkv",
      ].includes(file.type);
    }
    return false;
  }, "请选择移动端文件，支持的格式：JPG、PNG、WebP、MP4等"),
});

type LatestNewsFormData = z.infer<typeof latestNewsSchema>;

interface LatestNewsFormProps {
  id?: number;
}

export default function LatestNewsForm({ id }: LatestNewsFormProps) {
  const router = useRouter();
  const createLatestNewsMutation = useCreateLatestNews();
  const updateLatestNewsMutation = useUpdateLatestNews();
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: categories } = useCategories(CategoryType.LATEST_NEW, {
    limit: 100,
  });
  const { data: latestNews, isLoading: loading } = useLatestNewsDetail(id);

  const form = useForm<LatestNewsFormData>({
    resolver: zodResolver(latestNewsSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: "",
      webMediaFile: undefined,
      mobileMediaFile: undefined,
      description: "",
      published_date: new Date(), // Default to today
    },
  });

  useEffect(() => {
    if (latestNews && id) {
      form.setValue("title", latestNews.title);
      form.setValue("content", latestNews.content);
      form.setValue("category_id", latestNews.category_id);
      form.setValue("description", latestNews.description);
      // Parse published_date to Date object
      if (latestNews.published_date) {
        try {
          const publishedDate = parseISO(
            latestNews.published_date || new Date().toISOString()
          );
          if (isValid(publishedDate)) {
            form.setValue("published_date", publishedDate);
          }
        } catch (error) {
          console.warn(
            "Invalid published_date format:",
            latestNews.published_date
          );
        }
      }
    }
  }, [latestNews, id, form]);

  const handleWebMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("webMediaFile", file);
      form.trigger("webMediaFile");
    } else {
      // form.setValue("webMediaFile", undefined);
      form.trigger("webMediaFile");
    }
  };

  const handleMobileMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("mobileMediaFile", file);
      form.trigger("mobileMediaFile");
    } else {
      // form.setValue("mobileMediaFile", );
      form.trigger("mobileMediaFile");
    }
  };

  const submitWithStatus = async (status: LatestNewsStatus) => {
    // Trigger validation before submission
    const isValid = await form.trigger();

    if (!isValid) {
      toast.error("请检查表单错误并修正后再提交");
      return;
    }

    const { webMediaFile, mobileMediaFile, published_date, ...restData } =
      form.getValues();
    const updatedData = {
      ...restData,
      status,
      featured: false,
      published_date: published_date
        ? format(published_date, "yyyy-MM-dd")
        : undefined,
    };

    if (id) {
      // Update existing latest news
      updateLatestNewsMutation.mutate(
        {
          id,
          data: updatedData,
          files: {
            webThumbnail: webMediaFile,
            mobileThumbnail: mobileMediaFile,
          },
        },
        {
          onSuccess: () => {
            toast.success("资讯更新成功");
            router.push("/latest-news/posts");
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "更新资讯时出错，请重试"
            );
          },
        }
      );
    } else {
      // For new posts, ensure required files are provided
      if (!webMediaFile) {
        form.setError("webMediaFile", {
          type: "manual",
          message: "Web端封面媒体是必填项",
        });
        toast.error("请上传Web端封面媒体");
        return;
      }
      if (!mobileMediaFile) {
        form.setError("mobileMediaFile", {
          type: "manual",
          message: "移动端封面媒体是必填项",
        });
        toast.error("请上传移动端封面媒体");
        return;
      }

      // Create new latest news
      createLatestNewsMutation.mutate(
        {
          data: updatedData,
          files: {
            webThumbnail: webMediaFile!,
            mobileThumbnail: mobileMediaFile!,
          },
        },
        {
          onSuccess: () => {
            toast.success(
              status === LatestNewsStatus.PUBLISHED
                ? "资讯发布成功"
                : "草稿保存成功"
            );
            router.push("/latest-news/posts");
          },
        }
      );
    }
  };

  const handleSaveDraft = () => {
    submitWithStatus(LatestNewsStatus.DRAFT);
  };

  const handlePublish = () => {
    submitWithStatus(LatestNewsStatus.PUBLISHED);
  };

  const onSubmit = () => {
    handlePublish();
  };

  if (id && !loading && (!latestNews || latestNews.status === LatestNewsStatus.PUBLISHED)) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>资讯标题 *</FormLabel>
                  <span
                    className={cn(
                      "text-xs",
                      field.value?.length > 40
                        ? "text-orange-500"
                        : "text-gray-500",
                      field.value?.length >= 50 ? "text-red-500" : ""
                    )}
                  >
                    {field.value?.length || 0}/50
                  </span>
                </div>
                <FormControl>
                  <Input
                    placeholder="输入资讯标题"
                    {...field}
                    className="h-12"
                    maxLength={50}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>分类 *</FormLabel>
                <Select
                  value={field.value ? field.value.toString() : undefined}
                  onValueChange={(value) => {
                    return field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="请选择分类" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.data && categories.data.length > 0 ? (
                      categories.data.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
            )}
          />

          {/* Web Media Upload */}
          <FormField
            control={form.control}
            name="webMediaFile"
            render={() => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Web端封面媒体
                </FormLabel>
                <p className="text-sm text-gray-500 mb-4">
                  (图片支持格式：JPG、PNG 图片建议尺寸：1920px × 600px)
                </p>
                <FormControl>
                  <FileUpload
                    onFileSelect={handleWebMediaSelect}
                    maxImageSize={500}
                    allowedFileType="image"
                    dimensions={{ width: 1920, height: 600 }}
                    placeholder="点击上传或拖拽Web端媒体文件到这里"
                    description="支持 JPG、PNG 格式，建议尺寸 1920x600px"
                    initialPreviewUrl={latestNews?.web_thumbnail?.path}
                    initialFileName={
                      latestNews?.web_thumbnail ? "当前Web端图片" : undefined
                    }
                    initialFileType={getFileTypeFromMedia(
                      latestNews?.web_thumbnail ?? null
                    )}
                    acceptedFormats="image/jpeg,image/png"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Media Upload */}
          <FormField
            control={form.control}
            name="mobileMediaFile"
            render={() => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  H5端封面媒体
                </FormLabel>
                <p className="text-sm text-gray-500 mb-4">
                  (图片支持格式：JPG、PNG、WebP格式; 图片建议尺寸：1920px ×
                  600px)
                </p>
                <FormControl>
                  <FileUpload
                    onFileSelect={handleMobileMediaSelect}
                    maxImageSize={100}
                    allowedFileType="image"
                    acceptedFormats="image/jpeg,image/png"
                    dimensions={{ width: 750, height: 400 }}
                    placeholder="点击上传或拖拽移动端媒体文件到这里"
                    description="支持 JPG、PNG 格式，建议尺寸 750x400px"
                    initialPreviewUrl={latestNews?.mobile_thumbnail?.path}
                    initialFileName={
                      latestNews?.mobile_thumbnail
                        ? "当前移动端图片"
                        : undefined
                    }
                    initialFileType={getFileTypeFromMedia(
                      latestNews?.mobile_thumbnail ?? null
                    )}
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
                <FormLabel>资讯内容 *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="请输入资讯内容..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>资讯描述 *</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="请输入资讯内容..."
                    minHeight="200px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Published Date Field */}
          <FormField
            control={form.control}
            name="published_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>发布日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-12 pl-3 text-left font-normal justify-start",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "yyyy年MM月dd日")
                        ) : (
                          <span>选择发布日期</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          // Set time to noon to avoid timezone issues
                          date.setHours(12, 0, 0, 0);
                        }
                        field.onChange(date);
                      }}
                      disabled={(date: Date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                <LatestNewsPreview
                  data={{
                    ...form.watch(),
                    featured: false,
                    status: LatestNewsStatus.DRAFT,
                  }}
                  categories={
                    Array.isArray(categories?.data) ? categories.data : []
                  }
                />
              </DialogContent>
            </Dialog>

            {/* Save Draft */}
            <Button
              type="button"
              variant="outline"
              disabled={createLatestNewsMutation.isPending}
              onClick={handleSaveDraft}
            >
              保存草稿
            </Button>

            {/* Save and Publish */}
            <Button
              type="button"
              disabled={createLatestNewsMutation.isPending}
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {createLatestNewsMutation.isPending ? "发布中..." : "保存并发布"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
