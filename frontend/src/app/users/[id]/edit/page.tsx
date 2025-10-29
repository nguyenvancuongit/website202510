"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useParams,useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

import { AdminPageLayout } from "@/components/admin/common/admin-page-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Permission,
  usePermissions,
  useUpdateUser,
  useUser,
} from "@/hooks/api/use-users";
import { useBreadcrumbEffect } from "@/hooks/use-breadcrumb-effect";
import { usePermissions as useUserPermissions } from "@/hooks/use-permissions";
import { Permission as PermissionEnum } from "@/types/permissions";

// Form data type without email
type EditUserFormData = {
  username: string;
  phone: string;
  status: "active" | "disabled";
  permissions: string[];
};

const userSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  phone: z.string().min(1, "手机号不能为空"),
  status: z.enum(["active", "disabled"]),
  permissions: z.array(z.string()).min(1, "请至少选择一个权限"),
});

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const { data: userData, isLoading } = useUser(userId);
  const { data: permissionsData } = usePermissions();
  const updateUserMutation = useUpdateUser();
  const { hasPermission } = useUserPermissions();
  
  // Check if user has permission to manage permissions
  const canManagePermissions = hasPermission([PermissionEnum.MANAGE_PERMISSIONS]);

  // Set breadcrumbs for this page
  useBreadcrumbEffect([
    { label: "后台用户权限管理", href: "/users" },
    { label: "编辑用户" },
  ]);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      phone: "",
      status: "active" as const,
      permissions: [],
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData) {
      const formData = {
        username: userData.username || "",
        phone: userData.phone || "",
        status: (userData.status === "active" ? "active" : "disabled") as
          | "active"
          | "disabled",
        permissions: userData.permissions || [],
      };

      form.reset(formData);

      // Force set status field specifically
      setTimeout(() => {
        form.setValue(
          "status",
          userData.status === "active" ? "active" : "disabled"
        );
      }, 50);
    }
  }, [userData, form]);

  const onSubmit = async (data: EditUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        data: {
          username: data.username,
          phone: data.phone,
          status: data.status,
          permissions: data.permissions,
        },
      });

      router.push("/users");
    } catch (error) {
      toast.error("更新用户失败");
    }
  };

  const handleBack = () => {
    router.push("/users");
  };

  const actions = (
    <Button variant="outline" onClick={handleBack}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      返回列表
    </Button>
  );

  if (isLoading) {
    return (
      <AdminPageLayout title="编辑用户" actions={actions}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载用户信息中...</div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="编辑用户" actions={actions}>
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>手机号 *</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入手机号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>用户状态</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || userData?.status || "active"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择用户状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">正常</SelectItem>
                        <SelectItem value="disabled">禁用</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {canManagePermissions && (
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => {
                const currentValue = Array.isArray(field.value)
                  ? field.value
                  : [];
                const allPermissionIds =
                  permissionsData?.map((p: Permission) => p.value) || [];
                const isAllSelected =
                  allPermissionIds.length > 0 &&
                  allPermissionIds.every((id) => currentValue.includes(id));
                const isPartialSelected =
                  currentValue.length > 0 && !isAllSelected;

                const handleSelectAll = (checked: boolean) => {
                  if (checked) {
                    field.onChange(allPermissionIds);
                  } else {
                    field.onChange([]);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel>用户权限 *</FormLabel>
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                      {/* Select All Checkbox */}
                      <div className="flex items-center space-x-2 pb-2 border-b">
                        <Checkbox
                          id="select-all"
                          checked={isAllSelected}
                          onCheckedChange={handleSelectAll}
                          className={
                            isPartialSelected
                              ? "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-blue-100"
                              : ""
                          }
                        />
                        <Label
                          htmlFor="select-all"
                          className="text-sm font-medium cursor-pointer"
                        >
                          全部权限 {isPartialSelected && "(部分选中)"}
                        </Label>
                      </div>

                      {/* Individual Permission Checkboxes */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {permissionsData?.map((permission: Permission) => (
                          <div
                            key={permission.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={permission.value}
                              checked={currentValue.includes(permission.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  const newValue = [
                                    ...currentValue,
                                    permission.value,
                                  ];
                                  field.onChange(newValue);
                                } else {
                                  const newValue = currentValue.filter(
                                    (id: string) => id !== permission.value
                                  );
                                  field.onChange(newValue);
                                }
                              }}
                            />
                            <Label
                              htmlFor={permission.value}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        )) || <div>加载权限中...</div>}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                取消
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateUserMutation.isPending ? "保存中..." : "保存修改"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
