"use client";

import { useEffect, useRef,useState } from "react";
import { toast } from "sonner";

type FileType = "image" | "video" | "both";

interface UseFileUploadOptions {
  allowedFileType?: FileType;
  acceptedFormats?: string;
  maxImageSize?: number; // in MB
  maxVideoSize?: number; // in MB
  dimensions?: {
    width: number;
    height: number;
  };
  onFileSelect?: (file: File | null) => void;
  initialPreviewUrl?: string;
  initialFileName?: string;
  initialFileType?: "image" | "video"; // Type of the initial file for display purposes
}

interface UseFileUploadReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isVideo: boolean;
  isImage: boolean;
  hasInitialPreview: boolean;
  isInitialVideo: boolean;
  isInitialImage: boolean;
  getAcceptAttribute: () => string;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  removeFile: () => void;
  selectFile: () => void;
}

export function useFileUpload({
  allowedFileType = "both",
  acceptedFormats,
  maxImageSize = 10,
  maxVideoSize = 500,
  dimensions,
  onFileSelect,
  initialPreviewUrl,
  initialFileType,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial preview URL and react to changes
  useEffect(() => {
    if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl);
    } else {
      if (!selectedFile) {
        setPreviewUrl(null);
      }
    }
  }, [initialPreviewUrl]);

  useEffect(() => {
    if (selectedFile) {
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);
    }
  }, [selectedFile]);

  // Generate accept attribute based on allowedFileType
  const getAcceptAttribute = () => {
    if (acceptedFormats) {return acceptedFormats;}

    switch (allowedFileType) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "both":
        return "image/*,video/*";
      default:
        return "*/*";
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      // Only revoke object URL if it's a blob URL (not an initial external URL)
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (allowedFileType === "image" && !isImage) {
        toast.error("请选择有效的图片文件");
        resolve(false);
        return;
      }

      if (allowedFileType === "video" && !isVideo) {
        toast.error("请选择有效的视频文件");
        resolve(false);
        return;
      }

      if (allowedFileType === "both" && !isImage && !isVideo) {
        toast.error("请选择有效的图片或视频文件");
        resolve(false);
        return;
      }

      let maxSizeLimit = maxVideoSize;

      if (isImage) {
        maxSizeLimit = maxImageSize;
      }

      if (file.size > maxSizeLimit * 1024 * 1024) {
        toast.error(`文件大小不能超过 ${maxSizeLimit}MB`);
        resolve(false);
        return;
      }

      // Check image dimensions if specified
      if (isImage && dimensions) {
        const img = new Image();
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          toast.error("无法读取图片文件");
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve(true);
      }
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {return;}

    const isValid = await validateFile(file);
    if (!isValid) {return;}

    // Cleanup previous preview if it's a blob URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    // Preview URL will be set by useEffect for selectedFile
    onFileSelect?.(file);
  };

  const removeFile = () => {
    // Only revoke object URL if it's a blob URL (not an initial external URL)
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null); // Always clear preview when removing
    onFileSelect?.(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectFile = () => {
    fileInputRef.current?.click();
  };

  const isVideo = selectedFile?.type.startsWith("video/") ?? false;
  const isImage = selectedFile?.type.startsWith("image/") ?? false;
  const hasInitialPreview =
    !!initialPreviewUrl && !selectedFile && !!previewUrl && previewUrl === initialPreviewUrl;
  const isInitialVideo = hasInitialPreview && initialFileType === "video";
  const isInitialImage = hasInitialPreview && initialFileType === "image";

  return {
    selectedFile,
    previewUrl,
    fileInputRef,
    isVideo,
    isImage,
    hasInitialPreview,
    isInitialVideo,
    isInitialImage,
    getAcceptAttribute,
    handleFileChange,
    removeFile,
    selectFile,
  };
}
