"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddressAutoFill,
  useCities,
  useDistricts,
} from "@/hooks/use-address";
import { chinesePhoneRegExp, cn } from "@/lib/utils";
import { createCustomer } from "@/services/customer.service";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const COOPERATION_TYPES = [
  {
    label: "产品服务购买",
    value: 0,
  },
  {
    label: "代理合作",
    value: 1,
  },
  {
    label: "个人咨询",
    value: 2,
  },
  {
    label: "其他业务合作",
    value: 3,
  },
];

const REQUIREMENT_OPTIONS = [
  {
    label: "购买自助探索设备",
    value: 0,
  },
  {
    label: "学生发展指导平台",
    value: 1,
  },
  {
    label: "生涯游园会服务",
    value: 2,
  },
  {
    label: "师资队伍培训考证",
    value: 3,
  },
  {
    label: "区域大规模筛查",
    value: 4,
  },
  {
    label: "个人生涯教育咨询",
    value: 5,
  },
  {
    label: "企业人才发展服务",
    value: 6,
  },
  {
    label: "企业数字化转型",
    value: 7,
  },
  {
    label: "联合市场营销活动",
    value: 8,
  },
  {
    label: "其他业务咨询",
    value: 9,
  },
];

// Zod schema for form validation
const cooperationFormSchema = z.object({
  name: z
    .string()
    .min(1, "请输入联系人姓名")
    .max(20, "联系人姓名不能超过20个字符"),
  email: z
    .string()
    .email("请输入正确的邮箱地址")
    .max(50, "邮箱地址不能超过50个字符")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(11, "请输入有效的联系电话")
    .max(20, "请输入有效的联系电话")
    .regex(chinesePhoneRegExp, "请输入有效的联系电话"),
  company: z
    .string()
    .min(1, "请输入单位名称")
    .max(50, "单位名称不能超过50个字符"),
  cooperationType: z.number().min(0, "请选择合作类型"), // Single value for form
  cooperationRequirements: z.array(z.number()).min(1, "请至少选择一个合作需求"),
  title: z.string().max(20, "标题不能超过20个字符").optional(),
  requestNote: z.string().max(200, "备注不能超过500个字符").optional(),
  // Keep form-specific fields for building the address and arrays
  province: z.string().min(1, "请选择省份"),
  city: z.string().min(1, "请选择城市"),
  district: z.string().optional(),
});

type CooperationFormData = z.infer<typeof cooperationFormSchema>;

interface CooperationFormModalProps {
  children: React.ReactNode;
}

export function CooperationFormModal({ children }: CooperationFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CooperationFormData>({
    resolver: zodResolver(cooperationFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      cooperationType: 0, // Set to valid default value
      cooperationRequirements: [],
      title: "",
      requestNote: "",
      province: "",
      city: "",
      district: "",
    },
  });

  // Use React Query hooks for clean address management
  const { provinces, isAutoFilling } = useAddressAutoFill(form, isOpen);

  // Watch form values for dynamic loading
  const selectedProvince = form.watch("province");
  const selectedCity = form.watch("city");

  // Get cities when province is selected
  const { data: cities = [], isLoading: loadingCities } =
    useCities(selectedProvince);

  // Get districts when both province and city are selected
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(
    selectedProvince,
    selectedCity
  );

  // Clear dependent fields when parent changes
  useEffect(() => {
    if (selectedProvince) {
      form.setValue("city", "");
      form.setValue("district", "");
    }
  }, [selectedProvince, form]);

  useEffect(() => {
    if (selectedCity) {
      form.setValue("district", "");
    }
  }, [selectedCity, form]);

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success("提交成功！客服顾问将在1个工作日内与您联系");
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("提交失败，请稍后重试");
    },
  });

  const onSubmit = async (data: CooperationFormData) => {
    // Build address from province, city, district
    const address = [data.province, data.city, data.district]
      .filter(Boolean)
      .join("");

    // Prepare payload for API
    const payload = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      company: data.company,
      title: data.title || "",
      address: address,
      cooperationTypes: [data.cooperationType], // Convert single value to array
      cooperationRequirements: data.cooperationRequirements,
      requestNote: data.requestNote || undefined,
    };

    createCustomerMutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:min-w-[580px] p-0 rounded-3xl border-0 max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="absolute top-0 w-full h-[1000px] -z-1"
          style={{
            background:
              "linear-gradient(180deg, #C1E3FF 1.25%, #E1F8FF 9.83%, #FFF 20.08%, #FFF 100%)",
          }}
        />
        <DialogHeader className="flex flex-col items-start md:items-center mx-4 pt-10 pb-4 text-left md:text-center border-b-[1px] border-b-[#CDE9FB]">
          <DialogTitle className="text-2xl font-bold text-charcoal mb-3">
            合作咨询
          </DialogTitle>
          <p className="text-sm md:text-[16px] text-medium-dark-blue-grey">
            请完善以下信息，客服顾问将在1个工作日内与您联系
          </p>
        </DialogHeader>
        <div className="py-6 px-6 md:px-10 flex-grow overflow-y-auto">
          <Form {...form}>
            <form
              id="cooperation-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Cooperation Type */}
              <FormField
                control={form.control}
                name="cooperationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      合作类型
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value.toString()}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        className="grid grid-cols-2 md:flex md:flex-wrap gap-6 mt-3"
                      >
                        {COOPERATION_TYPES.map((type) => (
                          <div
                            className="flex items-center space-x-2"
                            key={type.value}
                          >
                            <RadioGroupItem
                              value={type.value.toString()}
                              id={`cooperation-type-${type.value}`}
                              className="border-medium-dark-blue-grey text-vibrant-blue data-[state=checked]:border-vibrant-blue"
                            />
                            <Label
                              htmlFor={`cooperation-type-${type.value}`}
                              className="text-medium-dark-blue-grey"
                            >
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      所在城市
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 items-start">
                        <FormItem>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isAutoFilling}
                            >
                              <SelectTrigger className="bg-white border-[#d9d9d9] w-full !h-full">
                                <SelectValue
                                  placeholder={
                                    isAutoFilling ? "加载中..." : "请选择"
                                  }
                                  className="truncate"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!selectedProvince || loadingCities}
                                >
                                  <SelectTrigger className="bg-white border-[#d9d9d9] w-full !h-full">
                                    <SelectValue
                                      placeholder={
                                        loadingCities
                                          ? "加载中..."
                                          : "请选择"
                                      }
                                      className="truncate"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cities.map((city) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
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
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Combobox
                                  options={districts}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!selectedCity || loadingDistricts}
                                  placeholder={
                                    loadingDistricts
                                      ? "加载中..."
                                      : "请选择"
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      单位名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入单位名称"
                        className="mt-3 bg-white border-[#d9d9d9]"
                      // maxLength={50}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={50}
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      职务
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入职务"
                        className="mt-3 bg-white border-[#d9d9d9]"
                      // maxLength={20}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={20}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      联系人
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入姓名"
                        className="mt-3 bg-white border-[#d9d9d9]"
                      // maxLength={20}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={20}
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Contact Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      联系人电话
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入联系电话"
                        className="mt-3 bg-white border-[#d9d9d9]"
                      // maxLength={20}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={20}
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      邮箱
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="请输入邮箱"
                        className="mt-3 bg-white border-[#d9d9d9]"
                      // maxLength={50}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={50}
                      />
                    </div>
                  </FormItem>
                )}
              />

              {/* Cooperation Requirements */}
              <FormField
                control={form.control}
                name="cooperationRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      <span className="text-red-500">*</span>
                      合作需求
                      <span className="text-medium-dark-blue-grey font-normal">
                        （可多选）
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        {REQUIREMENT_OPTIONS.map((requirement) => (
                          <div
                            key={requirement.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={requirement.label}
                              checked={field.value.includes(requirement.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...field.value,
                                    requirement.value,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (req) => req !== requirement.value
                                    )
                                  );
                                }
                              }}
                            />
                            <Label
                              htmlFor={requirement.label}
                              className="text-medium-dark-blue-grey text-sm"
                            >
                              {requirement.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestNote"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="gap-0 text-black font-medium">
                      备注
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="请填写备注信息"
                        className="mt-3 bg-white border-[#d9d9d9] min-h-[100px]"
                      // maxLength={200}
                      />
                    </FormControl>
                    <div
                      className={cn("flex items-center", {
                        "justify-between": !!fieldState.error,
                        "justify-end": !fieldState.error,
                      })}
                    >
                      <FormMessage />
                      {/* <p className="text-xs text-medium-dark-blue-grey text-right">
                        {field.value?.length || 0}/200
                      </p> */}
                      <WordLimitCounter
                        current={field.value?.length || 0}
                        max={200}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="p-10">
          <Button
            type="submit"
            form="cooperation-form"
            disabled={createCustomerMutation.isPending}
            className="w-full bg-gradient-to-r from-vibrant-blue to-[#1b6eff] hover:from-[#1b59ab] hover:to-[#1865f2] text-white font-medium py-3 rounded-lg text-lg disabled:opacity-50"
          >
            {createCustomerMutation.isPending ? "提交中..." : "提交信息"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const WordLimitCounter = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => {
  return (
    <p className="text-xs text-medium-dark-blue-grey text-right">
      {current}/{max}
    </p>
  );
};
