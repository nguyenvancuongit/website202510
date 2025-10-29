"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

import { RichTextEditor } from "@/components/admin/posts/rich-text-editor";
import { Button } from "@/components/ui/button";
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
import { useRecruitmentPostTypes } from "@/hooks/api/use-recruitment-post-types";
import {
  JobType,
  RecruitmentPostStatus,
  useCreateRecruitmentPost,
  useRecruitmentPost,
  useUpdateRecruitmentPost,
} from "@/hooks/api/use-recruitment-posts";

const formSchema = z.object({
  job_title: z.string().trim().min(10, "职位名称不能为空").max(255, "职位名称不能超过255个字符"),
  job_description: z.string().trim().min(10, "职位详情不能为空"),
  recruitment_post_type_id: z.string().min(1, "请选择职位类型"),
  job_type: z.enum([JobType.FULL_TIME, JobType.INTERNSHIP]),
});

type FormValues = z.infer<typeof formSchema>;

interface RecruitmentPostFormProps {
  mode: "create" | "edit";
  id?: string;
}

const JOB_TYPE_OPTIONS = [
  { label: "全职", value: JobType.FULL_TIME },
  { label: "实习", value: JobType.INTERNSHIP },
];

export function RecruitmentPostForm({ mode, id }: RecruitmentPostFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: recruitmentPostTypesResponse } = useRecruitmentPostTypes({ limit: 100 });
  const { data: recruitmentPost, isLoading: isLoadingPost } = useRecruitmentPost(id || "");
  const createMutation = useCreateRecruitmentPost();
  const updateMutation = useUpdateRecruitmentPost();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      job_description: "",
      recruitment_post_type_id: "",
      job_type: JobType.FULL_TIME,
    },
  });

  // Reset form when recruitmentPost data is loaded
  useEffect(() => {
    if (isEdit && recruitmentPost) {
      form.reset({
        job_title: recruitmentPost.job_title,
        job_description: recruitmentPost.job_description,
        recruitment_post_type_id: recruitmentPost.recruitment_post_type_id,
        job_type: recruitmentPost.job_type,
      })
    }
  }, [isEdit, recruitmentPost, form]);

  const submitWithStatus = async (status: RecruitmentPostStatus) => {
    const formData = form.getValues();

    // First validate basic required fields (title, job type, and recruitment post type)
    if (!formData.job_title || formData.job_title.trim() === "") {
      toast.error("请输入职位名称");
      form.setError("job_title", { message: "请输入职位名称" });
      return;
    }

    if (!formData.recruitment_post_type_id || formData.recruitment_post_type_id === "") {
      toast.error("请选择职位类型");
      form.setError("recruitment_post_type_id", { message: "请选择职位类型" });
      return;
    }

    // Additional validation for publishing
    const isDrafting = status === RecruitmentPostStatus.DRAFT;

    if (!isDrafting) {
      // Validate job description for publishing
      if (!formData.job_description || formData.job_description.trim().length < 10) {
        toast.error("发布职位需要填写详细的职位描述（至少10个字符）");
        form.setError("job_description", {
          message: "发布职位需要填写详细的职位描述（至少10个字符）",
        });
        return;
      }
    }

    const updatedData = {
      ...formData,
      status,
      job_description: formData.job_description || "", // Ensure description is always string
    };

    setIsSubmitting(true);
    try {
      if (isEdit && id) {
        // Update existing recruitment post
        await updateMutation.mutateAsync({
          id,
          data: updatedData,
        });
      } else {
        // Create new recruitment post
        await createMutation.mutateAsync(updatedData);
        toast.success(
          status === RecruitmentPostStatus.PUBLISHED
            ? "职位发布成功"
            : "草稿保存成功"
        );
      }
      // Navigate back to the list page
      router.push("/recruitment/posts");
    } catch (error: any) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    submitWithStatus(RecruitmentPostStatus.DRAFT);
  };

  const handleSaveAndPublish = () => {
    submitWithStatus(RecruitmentPostStatus.PUBLISHED);
  };

  const handleSaveAndUnpublish = () => {
    submitWithStatus(RecruitmentPostStatus.UNPUBLISHED);
  };

  const handleCancel = () => {
    router.push("/recruitment/posts");
  };

  // Clear errors when fields are updated
  const clearFieldError = (fieldName: keyof FormValues) => {
    form.clearErrors(fieldName);
  };

  if (isEdit && isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (isEdit && (!recruitmentPost || recruitmentPost.status === RecruitmentPostStatus.PUBLISHED)) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">基本信息</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Job Title */}
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职位名称 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入职位名称"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.trim()) {
                            clearFieldError("job_title");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Type and Recruitment Post Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="recruitment_post_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>职位类型 *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            // Only process non-empty values to prevent reset to 0
                            if (value && value.trim() !== "") {
                              const numValue = parseInt(value);
                              field.onChange(numValue);
                            }
                          }}
                          value={field.value?.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="请选择职位类型" />
                          </SelectTrigger>
                          <SelectContent>
                            {recruitmentPostTypesResponse?.data?.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>职位性质 *</FormLabel>
                      <FormControl>
                        <Select
                          key={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="请选择职位性质" />
                          </SelectTrigger>
                          <SelectContent>
                            {JOB_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">职位详情</h3>
            <FormField
              control={form.control}
              name="job_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>职位详情 *</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        if (value && value.trim().length >= 10) {
                          clearFieldError("job_description");
                        }
                      }}
                      minHeight="300px"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-center space-x-4 pt-6">
            {/* Cancel */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              取消
            </Button>

            {/* Save Draft */}
            <Button
              type="button"
              variant="outline"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting
              }
              onClick={handleSaveDraft}
            >
              保存草稿
            </Button>

            {/* Save and Publish */}
            <Button
              type="button"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting
              }
              onClick={handleSaveAndPublish}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              {isSubmitting ? "发布中..." : "保存并发布"}
            </Button>

            {/* Save and Unpublish - Only show in edit mode when current status is published */}
            {isEdit && recruitmentPost?.status === RecruitmentPostStatus.PUBLISHED && (
              <Button
                type="button"
                variant="destructive"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  isSubmitting
                }
                onClick={handleSaveAndUnpublish}
              >
                {isSubmitting ? "下架中..." : "保存并下架"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}