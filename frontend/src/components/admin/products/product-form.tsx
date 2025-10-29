"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { MediaSelectionButton } from "@/components/ui/media-selection-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  SECTION_TYPE,
  SECTION_TYPE_CONFIG,
  SECTION_TYPE_OPTIONS,
} from "@/config/constants";
import { CategoryType, useCategories } from "@/hooks/api/use-categories";
import { MediaType } from "@/hooks/api/use-media";
import {
  ProductSection,
  ProductSectionSubItem,
  ProductStatus,
  useCreateProduct,
  useProductDetail,
  useUpdateProduct,
} from "@/hooks/api/use-products";
import { Media } from "@/types/index";

import { ProductPreview } from "./product-preview";

interface ProductFormProps {
  mode: "create" | "edit";
  id?: string;
}

export function ProductForm({ mode, id }: ProductFormProps) {
  const router = useRouter();
  const [sections, setSections] = useState<ProductSection[]>([]);
  const [bannerMedia, setBannerMedia] = useState<Media | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const {
    data: product,
    // error: productError,
    // isLoading: productLoading,
  } = useProductDetail(mode === "edit" && id ? Number(id) : undefined);

  const { data: categoriesResponse } = useCategories(CategoryType.PRODUCT, {
    status: "enabled",
    limit: 100,
  });

  const categories = categoriesResponse?.data || [];

  const form = useForm<{
    name: string;
    description: string;
    category_id: number;
    sort_order: number;
  }>({
    defaultValues: {
      name: "",
      description: "",
      category_id: 0,
      sort_order: 0,
    },
  });

  // Load data for edit mode
  useEffect(() => {
    if (mode === "edit" && product && id) {
      form.setValue("name", product.name || "");
      form.setValue("description", product.description || "");
      form.setValue("category_id", product.category_id || 0);
      form.setValue("sort_order", product.sort_order || 0);

      if (product.banner_media) {
        setBannerMedia(product.banner_media);
      }

      const mappedSections =
        product.sections?.map((section: any) => ({
          id: section.id,
          section_type: section.section_type || SECTION_TYPE.INTRO,
          title: section.title || "",
          description: section.description || "",
          sub_title: section.sub_title || "",
          sub_description: section.sub_description || "",
          section_image_media_id: section.section_image_media_id,
          section_image_title: section.section_image_title || "",
          section_image_description: section.section_image_description || "",
          cta_text: section.cta_text || "合作咨询",
          cta_link: section.cta_link || "",
          sort_order: section.sort_order || 0,
          is_active: section.is_active ?? true,
          section_image: section.section_image,
          section_sub_items:
            section.section_sub_items?.map((subItem: any) => ({
              id: subItem.id,
              title: subItem.title || "",
              description: subItem.description || "",
              cta_text: subItem.cta_text || "",
              cta_icon_media_id: subItem.cta_icon_media_id,
              sub_item_image_media_id: subItem.sub_item_image_media_id,
              cta_icon: subItem.cta_icon,
              sub_item_image: subItem.sub_item_image,
            })) || [],
        })) || [];

      setSections(mappedSections);

      // Set all sections as collapsed by default in edit mode
      if (mappedSections.length > 0) {
        const initialCollapsedState: { [key: number]: boolean } = {};
        mappedSections.forEach((_, index) => {
          initialCollapsedState[index] = true;
        });
        setCollapsedSections(initialCollapsedState);
      }
    }
  }, [mode, product, id, form]);

  // Section management
  const addSection = () => {
    const newSection: ProductSection = {
      id: Date.now(),
      section_type: SECTION_TYPE.INTRO,
      title: "",
      description: "",
      sort_order: sections.length,
      is_active: true,
      section_sub_items: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, updates: Partial<ProductSection>) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };
    setSections(updatedSections);
  };

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const updatedSections = [...sections];
      [updatedSections[index - 1], updatedSections[index]] = [
        updatedSections[index],
        updatedSections[index - 1],
      ];
      setSections(updatedSections);
    }
  };

  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const updatedSections = [...sections];
      [updatedSections[index + 1], updatedSections[index]] = [
        updatedSections[index],
        updatedSections[index + 1],
      ];
      setSections(updatedSections);
    }
  };

  // Sub-item management
  const addSubItem = (sectionIndex: number) => {
    const newSubItem: ProductSectionSubItem = {
      id: Date.now(),
      title: "",
      description: "",
      cta_text: "",
      cta_icon_media_id: undefined,
      sub_item_image_media_id: undefined,
    };
    const updatedSections = [...sections];
    updatedSections[sectionIndex].section_sub_items = [
      ...updatedSections[sectionIndex].section_sub_items,
      newSubItem,
    ];
    setSections(updatedSections);
  };

  const removeSubItem = (sectionIndex: number, subItemIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].section_sub_items = updatedSections[
      sectionIndex
    ].section_sub_items.filter((_, i) => i !== subItemIndex);
    setSections(updatedSections);
  };

  const updateSubItem = (
    sectionIndex: number,
    subItemIndex: number,
    updates: Partial<ProductSectionSubItem>
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].section_sub_items[subItemIndex] = {
      ...updatedSections[sectionIndex].section_sub_items[subItemIndex],
      ...updates,
    };
    setSections(updatedSections);
  };

  // Toggle section collapse state
  const toggleSectionCollapse = (sectionIndex: number) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  // Save product
  const submitWithStatus = (status: ProductStatus) => {
    const formData = form.getValues();

    if (!formData.name || formData.name.trim() === "") {
      toast.error("请输入产品名称");
      return;
    }

    if (categories.length === 0) {
      toast.error("暂无可用分类，请先创建产品分类");
      return;
    }

    if (!formData.category_id || formData.category_id === 0) {
      toast.error("请选择分类");
      return;
    }

    const sectionsData = sections.map((section, sectionIndex) => ({
      section_type: section.section_type,
      title: section.title,
      description: section.description,
      sub_title: section.sub_title,
      sub_description: section.sub_description,
      section_image_media_id: section.section_image_media_id,
      section_image_title: section.section_image_title,
      section_image_description: section.section_image_description,
      cta_text: section.cta_text,
      cta_link: section.cta_link,
      sort_order: sectionIndex,
      is_active: section.is_active,
      sub_items: section.section_sub_items.map((subItem) => ({
        title: subItem.title,
        description: subItem.description,
        cta_text: subItem.cta_text,
        cta_icon_media_id: subItem.cta_icon_media_id || null,
        sub_item_image_media_id: subItem.sub_item_image_media_id || null,
      })),
    }));

    const productData = {
      ...formData,
      status,
      featured: false,
      banner_media_id: bannerMedia?.id || null,
      sections: sectionsData,
    };

    const successMessage =
      status === ProductStatus.PUBLISHED
        ? "产品发布成功"
        : status === ProductStatus.UNPUBLISHED
          ? "产品已下线"
          : "草稿保存成功";

    if (mode === "edit" && id) {
      updateProductMutation.mutate(
        { id: Number(id), data: productData },
        {
          onSuccess: () => {
            toast.success(successMessage);
            router.push("/products/posts");
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "更新产品失败");
          },
        }
      );
    } else {
      createProductMutation.mutate(
        { product: productData },
        {
          onSuccess: () => {
            toast.success(successMessage);
            router.push("/products/posts");
          },
          onError: () => {
            toast.error("创建产品失败");
          },
        }
      );
    }
  };

  const renderSectionForm = (section: ProductSection, sectionIndex: number) => {
    const config =
      SECTION_TYPE_CONFIG[
      section.section_type as keyof typeof SECTION_TYPE_CONFIG
      ];

    return (
      <Card key={section.id || sectionIndex} className="relative">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleSectionCollapse(sectionIndex)}
                title={
                  collapsedSections[sectionIndex] ? "展开区域" : "收起区域"
                }
                className="p-1 h-8 w-8"
              >
                {collapsedSections[sectionIndex] ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{config?.icon || "📄"}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">
                      区域 #{sectionIndex + 1}
                    </CardTitle>
                    <Badge variant="secondary">
                      {config?.label || "未知类型"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {config?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveSectionUp(sectionIndex)}
                disabled={sectionIndex === 0}
                title="上移"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveSectionDown(sectionIndex)}
                disabled={sectionIndex === sections.length - 1}
                title="下移"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(sectionIndex)}
                className="text-red-500 hover:text-red-700"
                title="删除区域"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!collapsedSections[sectionIndex] && (
            <>
              {/* 区域类型选择 */}
              <div className="space-y-2">
                <Label>区域类型 *</Label>
                <Select
                  value={section.section_type}
                  onValueChange={(value) =>
                    updateSection(sectionIndex, { section_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择区域类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPE_OPTIONS.map((option) => {
                      const optionConfig =
                        SECTION_TYPE_CONFIG[
                        option.value as keyof typeof SECTION_TYPE_CONFIG
                        ];
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <span>{optionConfig?.icon}</span>
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* 基础字段 */}
              {(config?.fields?.some((f) => f === "title") ||
                <div className="grid grid-cols-2 gap-4">
                  {config?.fields?.some((f) => f === "title") && (
                    <div className="space-y-2">
                      <Label>主标题</Label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(sectionIndex, { title: e.target.value })
                        }
                        placeholder="输入主标题"
                      />
                    </div>
                  )}
                  {/* {config?.fields?.some((f) => f === "subTitle") && (
                      <div className="space-y-2">
                        <Label>副标题</Label>
                        <Input
                          value={section.sub_title || ""}
                          onChange={(e) =>
                            updateSection(sectionIndex, {
                              sub_title: e.target.value,
                            })
                          }
                          placeholder="输入副标题"
                        />
                      </div>
                    )} */}
                </div>
              )}

              {config?.fields?.some((f) => f === "description") && (
                <div className="space-y-2">
                  <Label>主描述</Label>
                  <Textarea
                    value={section.description}
                    onChange={(e) =>
                      updateSection(sectionIndex, {
                        description: e.target.value,
                      })
                    }
                    placeholder="输入主描述"
                    rows={3}
                  />
                </div>
              )}

              {/* {config?.fields?.some((f) => f === "subDescription") && (
                <div className="space-y-2">
                  <Label>副描述</Label>
                  <Textarea
                    value={section.sub_description || ""}
                    onChange={(e) =>
                      updateSection(sectionIndex, {
                        sub_description: e.target.value,
                      })
                    }
                    placeholder="输入副描述"
                    rows={2}
                  />
                </div>
              )} */}

              {/* CTA字段 */}
              {(config?.fields?.some((f) => f === "ctaText") ||
                config?.fields?.some((f) => f === "ctaLink")) && (
                  <div className="grid grid-cols-2 gap-4">
                    {config?.fields?.some((f) => f === "ctaText") && (
                      <div className="space-y-2">
                        <Label>CTA文字</Label>
                        <Input
                          value={section.cta_text || ""}
                          onChange={(e) =>
                            updateSection(sectionIndex, {
                              cta_text: e.target.value,
                            })
                          }
                          placeholder="如：合作咨询"
                        />
                      </div>
                    )}
                    {config?.fields?.some((f) => f === "ctaLink") && (
                      <div className="space-y-2">
                        <Label>CTA链接</Label>
                        <Input
                          value={section.cta_link || ""}
                          onChange={(e) =>
                            updateSection(sectionIndex, {
                              cta_link: e.target.value,
                            })
                          }
                          placeholder="如：/contact"
                        />
                      </div>
                    )}
                  </div>
                )}

              {/* 区域图片 */}
              {config?.fields?.some((f) => f === "sectionImage") && (
                <div className="space-y-4">
                  <Label>区域图片</Label>
                  <MediaSelectionButton
                    onMediaSelect={(media) => {
                      if (media) {
                        updateSection(sectionIndex, {
                          section_image_media_id: Number(media.id),
                          section_image: media,
                        });
                      }
                    }}
                    selectedMedia={section.section_image}
                    allowedTypes={[MediaType.IMAGE]}
                    title="选择区域图片"
                    placeholder="点击选择区域图片"
                    description="选择用于此区域的图片"
                  />

                  {/* 图片标题和描述 */}
                  {section.section_image && (
                    <div className="grid grid-cols-2 gap-4">
                      {config?.fields?.some(
                        (f) => f === "sectionImageTitle"
                      ) && (
                          <div className="space-y-2">
                            <Label>图片标题</Label>
                            <Input
                              value={section.section_image_title || ""}
                              onChange={(e) =>
                                updateSection(sectionIndex, {
                                  section_image_title: e.target.value,
                                })
                              }
                              placeholder="输入图片标题"
                            />
                          </div>
                        )}
                      {config?.fields?.some(
                        (f) => f === "sectionImageDescription"
                      ) && (
                          <div className="space-y-2">
                            <Label>图片描述</Label>
                            <Textarea
                              value={section.section_image_description || ""}
                              onChange={(e) =>
                                updateSection(sectionIndex, {
                                  section_image_description: e.target.value,
                                })
                              }
                              placeholder="输入图片描述"
                              rows={2}
                            />
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* 子项目 */}
              {config?.hasSubItems && (
                <div className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      子项目内容
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSubItem(sectionIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加子项
                    </Button>
                  </div>

                  {section.section_sub_items.map((subItem, subItemIndex) => (
                    <Card
                      key={subItem.id || subItemIndex}
                      className="border-dashed"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            子项目 #{subItemIndex + 1}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSubItem(sectionIndex, subItemIndex)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {config?.subItemFields?.some(
                            (f) => f === "title"
                          ) && (
                              <div className="space-y-2">
                                <Label>标题</Label>
                                <Input
                                  value={subItem.title}
                                  onChange={(e) =>
                                    updateSubItem(sectionIndex, subItemIndex, {
                                      title: e.target.value,
                                    })
                                  }
                                  placeholder="输入子项标题"
                                />
                              </div>
                            )}
                          {config?.subItemFields?.some(
                            (f) => f === "description"
                          ) && (
                              <div className="space-y-2">
                                <Label>描述</Label>
                                <Textarea
                                  value={subItem.description}
                                  onChange={(e) =>
                                    updateSubItem(sectionIndex, subItemIndex, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="输入子项描述"
                                  rows={2}
                                />
                              </div>
                            )}
                        </div>

                        {/* CTA文字 */}
                        {config?.subItemFields?.some(
                          (f) => f === "ctaText"
                        ) && (
                            <div className="space-y-2">
                              <Label>CTA文字</Label>
                              <Input
                                value={subItem.cta_text || ""}
                                onChange={(e) =>
                                  updateSubItem(sectionIndex, subItemIndex, {
                                    cta_text: e.target.value,
                                  })
                                }
                                placeholder="如：查看详情"
                              />
                            </div>
                          )}

                        {/* CTA图标 */}
                        {config?.subItemFields?.some(
                          (f) => f === "ctaIcon"
                        ) && (
                            <div className="space-y-2">
                              <Label>CTA图标</Label>
                              <MediaSelectionButton
                                onMediaSelect={(media) => {
                                  if (media) {
                                    updateSubItem(sectionIndex, subItemIndex, {
                                      cta_icon_media_id: Number(media.id),
                                      cta_icon: media,
                                    });
                                  }
                                }}
                                selectedMedia={subItem.cta_icon}
                                allowedTypes={[MediaType.IMAGE]}
                                title="选择CTA图标"
                                placeholder="点击选择CTA图标"
                                description="选择用于此CTA的图标"
                              />
                            </div>
                          )}

                        {/* 子项图片 */}
                        {config?.subItemFields?.some(
                          (f) => f === "subItemImage"
                        ) && (
                            <div className="space-y-2">
                              <Label>子项图片</Label>
                              <MediaSelectionButton
                                onMediaSelect={(media) => {
                                  if (media) {
                                    updateSubItem(sectionIndex, subItemIndex, {
                                      sub_item_image_media_id: Number(media.id),
                                      sub_item_image: media,
                                    });
                                  }
                                }}
                                selectedMedia={subItem.sub_item_image}
                                allowedTypes={[MediaType.IMAGE]}
                                title="选择子项图片"
                                placeholder="点击选择子项图片"
                                description="选择用于此子项的图片"
                              />
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* 激活状态 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`section-${sectionIndex}-active`}
                  checked={section.is_active}
                  onChange={(e) =>
                    updateSection(sectionIndex, { is_active: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor={`section-${sectionIndex}-active`}>
                  激活此区域
                </Label>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Form {...form}>
        <form className="space-y-8">
          {/* 基本信息区域 */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>产品基本信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>产品名称 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="请输入产品名称"
                        className="text-lg"
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
                    <FormLabel>产品描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="请输入产品描述（可选）"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类 *</FormLabel>
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
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择分类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0" disabled>
                          请选择分类
                        </SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-base font-medium">
                  Banner图片 *
                </FormLabel>
                <p className="text-sm text-gray-500 mb-4">
                  建议尺寸：1920px × 600px，支持JPG、PNG、WebP格式
                </p>
                <MediaSelectionButton
                  onMediaSelect={setBannerMedia}
                  selectedMedia={bannerMedia}
                  allowedTypes={[MediaType.IMAGE]}
                  title="选择产品Banner"
                  placeholder="点击选择Banner图片"
                  description="选择产品的主要展示图片"
                />
              </div>
            </CardContent>
          </Card>

          {/* 产品区域 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>产品展示区域</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    为产品添加不同类型的展示区域，支持多种布局样式
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addSection}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加区域
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="max-w-md mx-auto">
                    <div className="text-4xl mb-4">🎨</div>
                    <h3 className="text-lg font-medium mb-2">暂无展示区域</h3>
                    <p className="text-sm mb-4">
                      点击"添加区域"开始创建产品展示区域，支持多种布局样式
                    </p>
                    <Button onClick={addSection} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      添加第一个区域
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((section, sectionIndex) =>
                    renderSectionForm(section, sectionIndex)
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 操作按钮 */}
          <div className="flex justify-center space-x-4 pt-6 border-t bg-gray-50 -mx-8 px-8 pb-8">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" className="px-8">
                  预览
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-none w-[90vw] max-h-none h-[85vh] overflow-auto p-0"
                style={{
                  width: "90vw",
                  height: "85vh",
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                }}
              >
                <ProductPreview
                  data={{
                    name: form.watch("name") || "",
                    description: form.watch("description"),
                    category_id: parseInt(
                      String(form.watch("category_id") || "0")
                    ),
                    sections: sections,
                  }}
                  bannerMedia={bannerMedia}
                  categories={categories || []}
                />
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              variant="outline"
              onClick={() => submitWithStatus(ProductStatus.DRAFT)}
              disabled={
                createProductMutation.isPending ||
                updateProductMutation.isPending
              }
              className="px-8"
            >
              {createProductMutation.isPending ||
                updateProductMutation.isPending
                ? "保存中..."
                : "保存草稿"}
            </Button>

            <Button
              type="button"
              onClick={() => submitWithStatus(ProductStatus.PUBLISHED)}
              disabled={
                createProductMutation.isPending ||
                updateProductMutation.isPending
              }
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              {createProductMutation.isPending ||
                updateProductMutation.isPending
                ? "发布中..."
                : mode === "edit"
                  ? "更新并发布"
                  : "发布产品"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
