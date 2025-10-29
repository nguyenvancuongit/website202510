import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter,DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaManager } from "@/components/ui/media-manager";
import { MediaType } from "@/hooks/api/use-media";
import { Media } from "@/types/index";

interface MediaSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (medias: Media[]) => void;
  selectedMediaIds?: string[];
  multiSelect?: boolean;
  allowedTypes?: MediaType[];
  title?: string;
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  open,
  onClose,
  onSelect: onSelectProp,
  selectedMediaIds = [],
  multiSelect = false,
  allowedTypes,
  title = "选择媒体文件"
}) => {
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const handleMediaSelect = (medias: Media[]) => {
    setSelectedMedias(medias);
  };

  const handleConfirm = () => {
    onSelectProp(selectedMedias);
    onClose();
    setSelectedMedias([]);
  };

  const handleCancel = () => {
    onClose();
    setSelectedMedias([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] sm:h-[85vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto px-1 sm:px-2">
          <MediaManager
            onSelect={handleMediaSelect}
            selectedMediaIds={selectedMediaIds}
            multiSelect={multiSelect}
            allowedTypes={allowedTypes}
            showUpload={true}
          />
        </div>
        
        <DialogFooter className="pt-4 flex-shrink-0">
          <div className="flex gap-3 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="min-w-[100px]"
            >
              取消
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedMedias.length === 0}
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
            >
              确定选择 {selectedMedias.length > 0 && `(${selectedMedias.length})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
