import { LatestNewsStatus } from "@/hooks/api/use-latest-news";

interface LatestNewsPreviewProps {
  data: {
    title: string;
    content: string;
    description: string;
    category_id: string;
    featured: boolean;
    status: LatestNewsStatus;
  };
  categories: any[];
}

export function LatestNewsPreview({
  data,
  categories,
}: LatestNewsPreviewProps) {
  const category = categories?.find((cat) => cat.id === data.category_id);

  return (
    <div className="prose prose-slate max-w-none">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{data.title || "资讯标题"}</h1>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span>分类: {category?.name || "未选择"}</span>
          <span>
            状态:{" "}
            {data.status === LatestNewsStatus.PUBLISHED ? "已发布" : "草稿"}
          </span>
          {data.featured && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
              🔥 推荐资讯
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="border-t pt-6">
        <div
          dangerouslySetInnerHTML={{
            __html:
              data.content ||
              "<p className='text-gray-500 italic'>请在编辑器中输入内容...</p>",
          }}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: data.description || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
