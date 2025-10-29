import { Media } from "@/types";

// Helper function to convert media type to file upload component type
export const getFileTypeFromMedia = (
  media: Media | null
): "image" | "video" | undefined => {
  if (!media) {return undefined;}
  return media.type === "image"
    ? "image"
    : media.type === "video"
    ? "video"
    : undefined;
};
