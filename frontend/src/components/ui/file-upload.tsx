"use client";

import React from "react";
import { Pause, Play, Trash2, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useVideoControls } from "@/hooks/use-video-controls";

type FileType = "image" | "video" | "both";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  allowedFileType?: FileType;
  acceptedFormats?: string;
  maxImageSize?: number; // in MB
  maxVideoSize?: number; // in MB
  dimensions?: {
    width: number;
    height: number;
  };
  // responsive: keep old full-width preview; fixed: use exact dimensions box
  previewMode?: "responsive" | "fixed";
  className?: string;
  placeholder?: string;
  description?: React.ReactNode;
  initialPreviewUrl?: string; // URL for existing file preview
  initialFileName?: string; // Name for existing file
  initialFileType?: "image" | "video"; // Type of the initial file for display purposes
}

export function FileUpload({
  onFileSelect,
  allowedFileType = "both",
  acceptedFormats,
  maxImageSize = 10,
  maxVideoSize = 100,
  dimensions,
  previewMode = "responsive",
  className = "",
  placeholder = "点击上传或拖拽文件到这里",
  // description = "支持的文件格式",
  initialPreviewUrl,
  initialFileName,
  initialFileType,
}: FileUploadProps) {
  const {
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
  } = useFileUpload({
    allowedFileType,
    acceptedFormats,
    maxImageSize,
    maxVideoSize,
    dimensions,
    onFileSelect,
    initialPreviewUrl,
    initialFileName,
    initialFileType,
  });

  // Separate video controls hook
  const { isPlaying, videoRef, handleVideoToggle, reset } = useVideoControls();

  // Reset video when file changes
  React.useEffect(() => {
    if (!isVideo && !isInitialVideo) {
      reset();
    }
  }, [selectedFile, isVideo, isInitialVideo, reset]);

  return (
    <div className={className}>
      {!selectedFile && !hasInitialPreview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onClick={selectFile}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {placeholder}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptAttribute()}
                className="sr-only"
                onChange={handleFileChange}
              />
              {/* <p className="mt-1 text-xs text-gray-500">
                {description} • 最大 {maxSize}MB
                {dimensions &&
                  ` • 尺寸 ${dimensions.width}x${dimensions.height}px`}
              </p> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div
            className="relative border-2 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center"
            style={
              previewMode === "fixed" && dimensions
                ? { width: dimensions.width, height: dimensions.height }
                : undefined
            }
          >
            {(isImage || isInitialImage) && (
              <Image
                width={dimensions?.width || 300}
                height={dimensions?.height || 200}
                src={previewUrl!}
                alt="File Preview"
                className={
                  previewMode === "fixed" && dimensions
                    ? "w-full h-full object-contain"
                    : "w-full h-auto object-cover"
                }
              />
            )}

            {(isVideo || isInitialVideo) && (
              <div
                className={
                  previewMode === "fixed" && dimensions
                    ? "relative w-full h-full"
                    : "relative"
                }
              >
                <video
                  ref={videoRef}
                  src={previewUrl!}
                  className={
                    previewMode === "fixed" && dimensions
                      ? "w-full h-full object-contain"
                      : "w-full h-auto object-cover"
                  }
                  controls={false}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleVideoToggle}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeFile}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* File Info */}
          {/* <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div>
              <p className="text-sm font-medium text-green-800">
                {selectedFile
                  ? selectedFile.name
                  : initialFileName || "当前文件"}
              </p>
              <p className="text-xs text-green-600">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : "现有文件"}
                {dimensions && ` • ${dimensions.width}x${dimensions.height}px`}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectFile}
            >
              {selectedFile ? "更换文件" : "选择新文件"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptAttribute()}
              className="sr-only"
              onChange={handleFileChange}
            />
          </div> */}
        </div>
      )}
    </div>
  );
}
