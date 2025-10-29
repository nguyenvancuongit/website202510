"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
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
import { getFileTypeFromMedia } from "@/helpers";
import {
  BannerStatus,
  useBanner,
  useUpdateBanner,
} from "@/hooks/api/use-banners";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";
import { cn } from "@/lib/utils";

// Custom Zod validation for File objects (optional for edit)
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
  status: z.enum([BannerStatus.enabled, BannerStatus.disabled]),
  webMedia: fileSchema
    .optional()
    .refine((file) => {
      if (!file) { return true; } // Optional for edit
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
    }, "Web端文件格式不支持")
    .refine(async (file) => {
      if (!file || !file.type.startsWith("video/")) { return true; }
      return await validateVideoResolution(file);
    }, "视频分辨率不符合要求，请使用横向视频（宽高比 ≥ 1.2:1），避免使用竖向视频"),
  mobileMedia: fileSchema
    .optional()
    .refine((file) => {
      if (!file) { return true; } // Optional for edit
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
    }, "移动端文件格式不支持")
    .refine(async (file) => {
      if (!file || !file.type.startsWith("video/")) { return true; }
      return await validateVideoResolution(file);
    }, "视频分辨率不符合要求，请使用横向视频（宽高比 ≥ 1.2:1），避免使用竖向视频"),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = parseInt(params.id as string);

  const { data: banner, isLoading, error } = useBanner(bannerId);
  const updateBannerMutation = useUpdateBanner();

  const [webMediaRemoved, setWebMediaRemoved] = useState(false);
  const [mobileMediaRemoved, setMobileMediaRemoved] = useState(false);

  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "Banner管理", href: "/banners" },
    { label: "编辑Banner" },
  ]);

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      link_url: "",
      status: BannerStatus.enabled,
      webMedia: undefined,
      mobileMedia: undefined,
    },
  });

  // Update form when banner data is loaded
  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title || "",
        link_url: banner.link_url || "",
        status: banner.status,
        webMedia: undefined,
        mobileMedia: undefined,
      });
      setWebMediaRemoved(false);
      setMobileMediaRemoved(false);
    }
  }, [banner, form]);

  const handleWebMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("webMedia", file);
      form.trigger("webMedia");
      setWebMediaRemoved(false);
    } else {
      form.setValue("webMedia", undefined);
      form.trigger("webMedia");
      if (banner?.web_media) {
        setWebMediaRemoved(true);
      }
    }
  };

  const handleMobileMediaSelect = (file: File | null) => {
    if (file) {
      form.setValue("mobileMedia", file);
      form.trigger("mobileMedia");
      setMobileMediaRemoved(false);
    } else {
      form.setValue("mobileMedia", undefined);
      form.trigger("mobileMedia");
      if (banner?.mobile_media) {
        setMobileMediaRemoved(true);
      }
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    if (!banner) { return; }

    // Check if required files are present (either existing or newly uploaded)
    const hasWebMedia = data.webMedia || (banner.web_media && !webMediaRemoved);
    const hasMobileMedia =
      data.mobileMedia || (banner.mobile_media && !mobileMediaRemoved);

    if (!hasWebMedia) {
      form.setError("webMedia", {
        type: "manual",
        message: "Web端文件是必填项，请上传文件",
      });
      return;
    }

    if (!hasMobileMedia) {
      form.setError("mobileMedia", {
        type: "manual",
        message: "移动端文件是必填项，请上传文件",
      });
      return;
    }

    updateBannerMutation.mutate(
      {
        id: banner.id,
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

  // Loading state
  if (isLoading) {
    return (
      <AdminPageLayout title="编辑Banner" subtitle="修改轮播图或广告横幅信息">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      </AdminPageLayout>
    );
  }

  // Error state
  if (error || !banner) {
    return (
      <AdminPageLayout title="编辑Banner" subtitle="修改轮播图或广告横幅信息">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error?.message || "Banner不存在或加载失败"}
          </p>
          <Button onClick={handleCancel} variant="outline">
            返回列表
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  if (banner.status === BannerStatus.enabled) {
    notFound()
  }

  const actions = (
    <Button variant="outline" onClick={handleCancel}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      返回列表
    </Button>
  );

  return (
    <AdminPageLayout
      title="编辑Banner"
      subtitle="修改轮播图或广告横幅信息"
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
                        maxLength={50}
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Web Media Upload */}
              <FormField
                control={form.control}
                name="webMedia"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Web端Banner图片
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG格式; 图片建议尺寸：1920px × 900px)
                      <br />
                      (视频支持格式：MP4、AVI、MOV、WMV、FLV、MKV 等格式;
                      视频大小建议：100M以内)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleWebMediaSelect}
                        allowedFileType="both"
                        maxImageSize={10}
                        maxVideoSize={100}
                        dimensions={{ width: 1920, height: 900 }}
                        placeholder="点击上传或拖拽新的Web端图片到这里"
                        description="支持 JPG、PNG、GIF、MP4 等格式，建议尺寸 1920x900px"
                        initialPreviewUrl={banner.web_media?.path}
                        initialFileName={
                          banner.web_media ? "当前Web端图片" : undefined
                        }
                        initialFileType={getFileTypeFromMedia(banner.web_media)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Media Upload */}
              <FormField
                control={form.control}
                name="mobileMedia"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      H5端Banner图片
                    </FormLabel>
                    <p className="text-sm text-gray-500 mb-4">
                      (图片支持格式：JPG、PNG格式; 图片建议尺寸：750px × 466px)
                      <br />
                      (视频支持格式：MP4、AVI、MOV、WMV、FLV、MKV 等格式;
                      视频大小建议：100M以内)
                    </p>
                    <FormControl>
                      <FileUpload
                        onFileSelect={handleMobileMediaSelect}
                        allowedFileType="both"
                        maxImageSize={10}
                        maxVideoSize={100}
                        dimensions={{ width: 750, height: 466 }}
                        placeholder="点击上传或拖拽新的移动端图片到这里"
                        description="支持 JPG、PNG、GIF、MP4 等格式，建议尺寸 750x466px"
                        initialPreviewUrl={banner.mobile_media?.path}
                        initialFileName={
                          banner.mobile_media ? "当前移动端图片" : undefined
                        }
                        initialFileType={getFileTypeFromMedia(
                          banner.mobile_media
                        )}
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
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked ? BannerStatus.enabled : BannerStatus.disabled
                        )
                      }
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <FormLabel className="text-base">启用状态</FormLabel>
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
                disabled={updateBannerMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                {updateBannerMutation.isPending ? "更新中..." : "保存更改"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
