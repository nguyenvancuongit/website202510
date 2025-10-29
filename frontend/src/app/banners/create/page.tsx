"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { BannerStatus, useCreateBanner } from "@/hooks/api/use-banners";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";
import { cn } from "@/lib/utils";

// Custom Zod validation for File objects
const fileSchema = z
  .instanceof(File, { error: "请选择有效的文件" })
  .refine((file) => file.size > 0, "请选择文件")
  .refine((file) => file.size <= 100 * 1024 * 1024, "文件大小不能超过100MB")
  .refine(
    (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    "请选择有效的图片或视频文件"
  );

// Video resolution validation function
const validateVideoResolution = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith("video/")) {
      resolve(true); // Skip validation for non-video files
      return;
    }

    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      const aspectRatio = width / height;

      // Clean up
      URL.revokeObjectURL(url);

      // Check for reasonable aspect ratios for banners
      // Reject vertical videos (aspect ratio < 1)
      // Accept landscape videos (aspect ratio >= 1.2)
      const isValidRatio = aspectRatio >= 1.2;
      resolve(isValidRatio);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    video.src = url;
  });
};

const bannerSchema = z.object({
  title: z.string().max(50, "标题不能超过50个字符").optional().or(z.literal("")),
  link_url: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      "请输入有效的链接地址"
    ),
  status: z.enum(BannerStatus),
  webMediaFile: fileSchema
    .optional()
    .refine((file) => {
      if (!file) { return false; } // Make it required
      if (file.type.startsWith("image/")) {
        return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
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
    }, "请选择Web端文件，支持的格式：JPG、PNG、GIF、MP4等")
    .refine(async (file) => {
      if (!file || !file.type.startsWith("video/")) { return true; }
      return await validateVideoResolution(file);
    }, "视频分辨率不符合要求，请使用横向视频（宽高比 ≥ 1.2:1），避免使用竖向视频"),
  mobileMediaFile: fileSchema
    .optional()
    .refine((file) => {
      if (!file) { return false; } // Make it required
      if (file.type.startsWith("image/")) {
        return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
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
    }, "请选择移动端文件，支持的格式：JPG、PNG、GIF、MP4等")
    .refine(async (file) => {
      if (!file || !file.type.startsWith("video/")) { return true; }
      return await validateVideoResolution(file);
    }, "视频分辨率不符合要求，请使用横向视频（宽高比 ≥ 1.2:1），避免使用竖向视频"),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export default function CreateBannerPage() {
  const router = useRouter();
  const createBannerMutation = useCreateBanner();

  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "Banner管理", href: "/banners" },
    { label: "创建Banner" },
  ]);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      link_url: "",
      status: BannerStatus.enabled,
      webMediaFile: undefined,
      mobileMediaFile: undefined,
    },
  });

  const handleWebMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("webMediaFile", file);
      form.trigger("webMediaFile");
    } else {
      form.setValue("webMediaFile", undefined);
      form.trigger("webMediaFile");
    }
  };

  const handleMobileMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("mobileMediaFile", file);
      form.trigger("mobileMediaFile");
    } else {
      form.setValue("mobileMediaFile", undefined);
      form.trigger("mobileMediaFile");
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    createBannerMutation.mutate(
      {
        data,
      },
      {
        onSuccess: () => {
          router.push("/banners");
        },
      }
    );
  };

  const handleCancel = () => {
    router.push("/banners");
  };

  const actions = (
    <Button variant="outline" onClick={handleCancel}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      返回列表
    </Button>
  );

  return (
    <AdminPageLayout
      title="创建Banner"
      subtitle="上传新的轮播图或广告横幅"
      actions={actions}
    >
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-8">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Banner标题</FormLabel>
                      <span
                        className={cn(
                          "text-xs",
                          (field.value?.length ?? 0) > 40
                            ? "text-orange-500"
                            : "text-gray-500",
                          (field.value?.length ?? 0) >= 50 ? "text-red-500" : ""
                        )}
                      >
                        {field.value?.length ?? 0}/50
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="输入Banner标题"
                        {...field}
                        className="h-12"
                        maxLength={50}
                      />
                    </FormControl>
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
                      Web端Banner图片 *
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG格式; 图片建议尺寸：1920px × 900px)
                      <br />
                      (视频支持格式：MP4、AVI、MOV、WMV、FLV、MKV 等格式;
                      视频大小建议：100M以内; 视频必须为横向格式，宽高比 ≥
                      1.2:1)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleWebMediaSelect}
                        allowedFileType="both"
                        maxImageSize={10}
                        maxVideoSize={100}
                        dimensions={{ width: 1920, height: 900 }}
                        placeholder="点击上传或拖拽Web端图片到这里"
                        description="支持 JPG、PNG、GIF 格式，建议尺寸 1920x900px"
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
                      H5端Banner图片 *
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG格式; 图片建议尺寸：750px × 466px)
                      <br />
                      (视频支持格式：MP4、AVI、MOV、WMV、FLV、MKV 等格式;
                      视频大小建议：100M以内; 视频必须为横向格式，宽高比 ≥
                      1.2:1)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleMobileMediaSelect}
                        allowedFileType="both"
                        maxImageSize={10}
                        maxVideoSize={100}
                        dimensions={{ width: 750, height: 466 }}
                        placeholder="点击上传或拖拽移动端图片到这里"
                        description="支持 JPG、PNG、GIF 格式，建议尺寸 750x466px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Jumplink Fields */}
            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>链接地址</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Toggle */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-4">
                  <FormControl>
                    <Switch
                      checked={field.value === BannerStatus.enabled}
                      onCheckedChange={(value) =>
                        field.onChange(
                          value ? BannerStatus.enabled : BannerStatus.disabled
                        )
                      }
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-base">立即启用</FormLabel>
                    <p className="text-sm text-gray-500">
                      启用后Banner将显示在网站首页
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button
                type="submit"
                disabled={createBannerMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {createBannerMutation.isPending ? "创建中..." : "创建Banner"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
