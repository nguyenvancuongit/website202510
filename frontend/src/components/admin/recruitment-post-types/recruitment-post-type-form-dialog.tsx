"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  type RecruitmentPostType,
  useCreateRecruitmentPostType,
  useUpdateRecruitmentPostType,
} from "@/hooks/api/use-recruitment-post-types";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "职位类型名称不能为空")
    .max(255, "职位类型名称不能超过255个字符"),
});

type FormData = z.infer<typeof formSchema>;

interface RecruitmentPostTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recruitmentPostType?: RecruitmentPostType | null;
  mode: "create" | "edit";
}

export function RecruitmentPostTypeFormDialog({
  open,
  onOpenChange,
  recruitmentPostType,
  mode,
}: RecruitmentPostTypeFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useCreateRecruitmentPostType();
  const updateMutation = useUpdateRecruitmentPostType();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when dialog opens/closes or recruitmentPostType changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && recruitmentPostType) {
        form.reset({
          name: recruitmentPostType.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, mode, recruitmentPostType, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync({
          name: data.name,
        });
      } else if (mode === "edit" && recruitmentPostType) {
        await updateMutation.mutateAsync({
          id: recruitmentPostType.id,
          data: {
            name: data.name,
          },
        });
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "添加职位类型" : "编辑职位类型"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>职位类型名称</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入职位类型名称"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mode === "create" ? "添加" : "保存"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}