import React, { useState } from "react";
import { File, Image as ImageIcon, Music, Upload, Video } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MediaType, useMedias, useUploadMedias } from "@/hooks/api/use-media";
import { Media } from "@/types/index";

interface MediaManagerProps {
  onSelect?: (media: Media[]) => void;
  selectedMediaIds?: string[];
  multiSelect?: boolean;
  allowedTypes?: MediaType[];
  showUpload?: boolean;
}

const getMediaIcon = (type: MediaType) => {
  switch (type) {
    case MediaType.IMAGE:
      return <ImageIcon className="h-4 w-4" />;
    case MediaType.VIDEO:
      return <Video className="h-4 w-4" />;
    case MediaType.AUDIO:
      return <Music className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

export const MediaManager: React.FC<MediaManagerProps> = ({
  onSelect,
  selectedMediaIds = [],
  multiSelect = false,
  allowedTypes,
  showUpload = true,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMediaIds);

  // Use hooks
  const { data: mediasData, isLoading, error, refetch } = useMedias();
  const uploadMutation = useUploadMedias();

  // Ensure medias is always an array
  const medias = Array.isArray(mediasData) ? mediasData : [];

  // Filter medias by allowed types if specified
  const filteredMedias =
    allowedTypes && allowedTypes.length > 0
      ? medias.filter((media: Media) =>
        allowedTypes.includes(media.type as MediaType)
      )
      : medias;

  const handleMediaSelect = (media: Media) => {
    let newSelectedIds: string[];

    if (multiSelect) {
      if (selectedIds.includes(media.id)) {
        newSelectedIds = selectedIds.filter((id) => id !== media.id);
      } else {
        newSelectedIds = [...selectedIds, media.id];
      }
    } else {
      newSelectedIds = selectedIds.includes(media.id) ? [] : [media.id];
    }

    setSelectedIds(newSelectedIds);

    if (onSelect) {
      const selectedMedias = filteredMedias.filter((m) =>
        newSelectedIds.includes(m.id)
      );
      onSelect(selectedMedias);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const filesArray = Array.from(files);

    uploadMutation.mutate(
      { files: filesArray },
      {
        onSuccess: () => {
          // Reset file input
          event.target.value = "";
          refetch();
        },
        onError: (error) => {
          console.error("Upload failed:", error);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with upload only */}
      {showUpload && (
        <div className="flex justify-end">
          <input
            type="file"
            id="file-upload"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadMutation.isPending ? "上传中..." : "上传文件"}
          </Button>
        </div>
      )}

      {/* Media grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-red-800 font-medium mb-1">加载失败</h3>
            <p className="text-red-600 text-sm">{error.message}</p>
          </div>
        </div>
      ) : filteredMedias.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-gray-600 font-medium mb-2">暂无媒体文件</h3>
            <p className="text-gray-500 text-sm mb-4">
              开始上传您的第一个媒体文件
            </p>
            {showUpload && (
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                上传文件
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedias.map((media) => (
              <Card
                key={media.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedIds.includes(media.id)
                  ? "border-2 border-blue-500 shadow-lg"
                  : "border border-gray-200 hover:border-gray-300"
                  }`}
                onClick={() => handleMediaSelect(media)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative group">
                    {media.type === MediaType.IMAGE ? (
                      <Image
                        width={300}
                        height={300}
                        src={media.path}
                        alt={media.alt_text || media.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 transition-colors duration-200 group-hover:from-gray-200 group-hover:to-gray-300">
                        {getMediaIcon(media.type)}
                      </div>
                    )}

                    {/* Selected indicator */}
                    {selectedIds.includes(media.id) && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <p
                      className="text-sm font-medium truncate text-center"
                      title={media.name}
                    >
                      {media.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selection info */}
          {selectedIds.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-blue-800">
                已选择 {selectedIds.length} 个文件
              </p>
              {!multiSelect && selectedIds.length > 1 && (
                <p className="text-xs text-blue-600 mt-1">
                  单选模式：将只使用最后选中的文件
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
