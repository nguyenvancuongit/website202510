import { Image as ImageIcon, Play, Video, ZoomIn } from "lucide-react";
import Image from "next/image";

import { Media } from "@/types";

const MediaPreview = ({
  media,
  title,
  onClick,
}: {
  media: Media | null;
  title: string;
  onClick: () => void;
}) => {
  const isVideo = media?.type === "video";
  const isImage = media?.type === "image";

  if (!media?.path) {
    return (
      <div className="w-16 h-10 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-xs text-gray-500 text-center px-1">无媒体</span>
      </div>
    );
  }

  return (
    <div
      className="w-16 h-10 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors relative group"
      onClick={onClick}
    >
      {isImage && (
        <>
          <Image
            width={30}
            height={20}
            src={media.path}
            alt={media.alt_text || title}
            className="w-full h-full object-cover rounded-md hover:opacity-80 transition-opacity"
          />
          {/* Zoom overlay for images */}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
            <ZoomIn className="h-3 w-3 text-white" />
          </div>
        </>
      )}
      {isVideo && (
        <>
          <video
            src={media.path}
            className="w-full h-full object-cover rounded-md"
            muted
            preload="metadata"
          />
          {/* Play overlay for videos */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
          {/* Video indicator */}
          <div className="absolute top-1 right-1 bg-black bg-opacity-70 rounded-sm p-0.5">
            <Video className="h-2 w-2 text-white" />
          </div>
        </>
      )}
      {!isImage && !isVideo && (
        <>
          <div className="flex flex-col items-center justify-center">
            <ImageIcon className="h-4 w-4 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500 text-center">
              {media.type}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaPreview;
