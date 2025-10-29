"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CaseStudyStatus } from "@/hooks/api/use-case-studies";

interface CaseStudyPreviewProps {
  data: {
    title: string;
    content: string;
    category_id: string | number;
    featured: boolean;
    status: CaseStudyStatus;
    customer_name?: string;
    key_highlights?: string[];
    highlight_description?: string;
    customer_feedback?: string;
    webThumbnailFile?: File;
    mobileThumbnailFile?: File;
    customerLogoFile?: File;
  };
  categories: Array<{ id: string | number; name: string }>;
}

export function CaseStudyPreview({ data, categories }: CaseStudyPreviewProps) {
  const selectedCategory = categories.find(
    (cat) => cat.id === data.category_id
  );

  // Create preview URLs for uploaded files
  const webThumbnailUrl = data.webThumbnailFile
    ? URL.createObjectURL(data.webThumbnailFile)
    : null;
  const mobileThumbnailUrl = data.mobileThumbnailFile
    ? URL.createObjectURL(data.mobileThumbnailFile)
    : null;
  const customerLogoUrl = data.customerLogoFile
    ? URL.createObjectURL(data.customerLogoFile)
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">案例预览</h2>
        <p className="text-gray-600">以下是案例在网站上的显示效果</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Header */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Badge variant="secondary">{selectedCategory.name}</Badge>
              )}
              {data.featured && <Badge variant="default">推荐案例</Badge>}
              <Badge
                variant={
                  data.status === CaseStudyStatus.PUBLISHED
                    ? "default"
                    : "secondary"
                }
              >
                {data.status === CaseStudyStatus.PUBLISHED ? "已发布" : "草稿"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>

            {data.customer_name && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">客户:</span>
                <span className="font-medium">{data.customer_name}</span>
                {customerLogoUrl && (
                  <Image
                    width={32}
                    height={32}
                    src={customerLogoUrl}
                    alt="客户Logo"
                    className="h-8 w-8 object-contain rounded"
                  />
                )}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {webThumbnailUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  PC端缩略图
                </h3>
                <Image
                  width={400}
                  height={300}
                  src={webThumbnailUrl}
                  alt="PC端预览"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            {mobileThumbnailUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  移动端缩略图
                </h3>
                <Image
                  width={400}
                  height={300}
                  src={mobileThumbnailUrl}
                  alt="移动端预览"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Key Highlights */}
          {data.key_highlights && data.key_highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">核心亮点</h3>
              <ul className="list-disc list-inside space-y-1">
                {data.key_highlights.map((highlight, index) => (
                  <li key={index} className="text-gray-700">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Highlight Description */}
          {data.highlight_description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">亮点描述</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data.highlight_description }}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">案例详情</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: data.content || "暂无内容" }}
            />
          </div>

          {/* Customer Feedback */}
          {data.customer_feedback && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">客户反馈</h3>
              <div
                className="prose max-w-none italic text-gray-700"
                dangerouslySetInnerHTML={{ __html: data.customer_feedback }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
