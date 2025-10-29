import React, { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { MediaSelector } from "@/components/ui/media-selector";
import { MediaType } from "@/hooks/api/use-media";
import { Media } from "@/types/index";

interface MediaSelectionButtonProps {
  onMediaSelect: (media: Media | null) => void;
  selectedMedia?: Media | null;
  allowedTypes?: MediaType[];
  title?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}

export const MediaSelectionButton: React.FC<MediaSelectionButtonProps> = ({
  onMediaSelect,
  selectedMedia,
  allowedTypes = [MediaType.IMAGE],
  title = "选择媒体文件",
  placeholder = "点击选择文件",
  description,
  className = ""
}) => {
  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleMediaSelection = (medias: Media[]) => {
    if (medias.length > 0) {
      onMediaSelect(medias[0]); // Single selection
    }
  };

  const handleRemoveMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMediaSelect(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {selectedMedia ? (
        <div className="relative border border-dashed border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            {selectedMedia.type === MediaType.IMAGE && (
              <Image
                width={64}
                height={64}
                src={selectedMedia.path}
                alt={selectedMedia.alt_text || selectedMedia.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{selectedMedia.name}</p>
              {selectedMedia.alt_text && (
                <p className="text-xs text-gray-500">{selectedMedia.alt_text}</p>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSelectorOpen(true)}
            >
              更换
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleRemoveMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-24 border-dashed hover:bg-gray-50"
          onClick={() => setSelectorOpen(true)}
        >
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">{placeholder}</span>
            {description && (
              <span className="text-xs text-gray-400">{description}</span>
            )}
          </div>
        </Button>
      )}

      <MediaSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleMediaSelection}
        selectedMediaIds={selectedMedia ? [selectedMedia.id] : []}
        multiSelect={false}
        allowedTypes={allowedTypes}
        title={title}
      />
    </div>
  );
};
