"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Label } from "@/components/ui/label";
import { useCreateCorporateHonor } from "@/hooks/api/use-corporate-honors";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "荣誉名称不能为空")
    .max(255, "荣誉名称长度不能超过255个字符"),
  obtained_date: z.string().min(1, "获得时间不能为空"),
  image: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCorporateHonorPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createMutation = useCreateCorporateHonor();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      obtained_date: "",
    },
  });

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append(
      "obtained_date",
      new Date(data.obtained_date).toISOString()
    );
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/corporate-honors");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">管理后台</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/corporate-honors">企业荣誉管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/corporate-honors">企业荣誉列表</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>新增荣誉</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">新增荣誉</h1>
          <p className="text-gray-500">添加新的企业荣誉</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/corporate-honors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>荣誉名称 *</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入荣誉名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="obtained_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>获得时间 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>荣誉配图</Label>
              <FileUpload
                onFileSelect={handleFileSelect}
                allowedFileType="image"
                acceptedFormats="image/jpeg,image/png"
                maxImageSize={5}
                dimensions={{ width: 1920, height: 600 }}
                placeholder="点击上传荣誉配图"
                description="图片支持格式：JPG、PNG格式；图片建议尺寸：1920px × 600px"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/corporate-honors">取消</Link>
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "提交中..." : "提交"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
