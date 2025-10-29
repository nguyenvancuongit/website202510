"use client"

import React, { useState } from "react"
import { ChevronLeft, Plus, XIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useMedia } from "@/hooks/use-media"
import { submitResumeApplication } from "@/services/careers.service"

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  jobId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

export default function ApplicationModal({
  isOpen,
  onClose,
  jobTitle,
  jobId: _jobId,
  onSuccess,
  onError,
}: ApplicationModalProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { isMobile } = useMedia()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast.error("仅支持 PDF、Word 或 ZIP 文件", { position: "top-center" })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("文件大小不能超过 10MB", { position: "top-center" })
        return
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      })
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
  }

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error("请上传您的个人简历材料", { position: "top-center" })
      return
    }

    setIsSubmitting(true)

    try {
      await submitResumeApplication({
        recruitment_post_id: _jobId,
        resume: uploadedFile.file,
      })

      setIsSubmitted(true)
      if (onSuccess) onSuccess()

      // Auto close after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setUploadedFile(null)
        onClose()
      }, 3000)
    } catch (error) {
      if (onError) onError(error as Error)
      else toast.error("提交失败，请重试", { position: "top-center" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isMobile) {
    return (
      <ApplicationModalContent
        isMobileMenuOpen={isOpen}
        setIsMobileMenuOpen={onClose}
        jobTitle={jobTitle}
        uploadedFile={uploadedFile}
        handleFileUpload={handleFileUpload}
        handleRemoveFile={handleRemoveFile}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
      />
    )
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className='sm:max-w-md md:min-w-[680px] border-none'
        style={{
          borderRadius: "24px",
          background:
            "linear-gradient(180deg, #C1E3FF 1.25%, #E1F8FF 9.83%, #FFF 20.08%, #FFF 100%)",
        }}
      >
        <DialogHeader className='relative'>
          <DialogTitle className='text-center text-xl font-semibold'>
            申请职位
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Job Title */}
          <div className='flex items-center gap-2 text-lg'>
            <label className='text-medium-dark-blue-grey font-normal'>
              职位名称:
            </label>
            <div className='text-charcoal font-medium'>{jobTitle}</div>
          </div>

          {/* File Upload Section */}
          <ModalContent
            jobTitle={jobTitle}
            uploadedFile={uploadedFile}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ApplicationModalContent = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  jobTitle,
  uploadedFile,
  handleFileUpload,
  handleRemoveFile,
  handleSubmit,
  isSubmitting,
  isSubmitted,
}: {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
  jobTitle: string
  uploadedFile: UploadedFile | null
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: () => void
  handleSubmit: () => void
  isSubmitting: boolean
  isSubmitted: boolean
}) => {
  return (
    <Sheet
      open={isMobileMenuOpen}
      onOpenChange={setIsMobileMenuOpen}
    >
      <SheetContent
        side='right'
        showCloseButton={false}
        className='bg-white w-full gap-2 overflow-auto h-full mb-20'
      >
        <SheetHeader className='pb-0'>
          <SheetTitle className='text-left font-semibold text-lg text-charcoal flex items-center justify-between'>
            <Link
              href={"/careers"}
              className='flex items-center space-x-2'
            >
              <ChevronLeft className='size-6 text-charcoal' />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div
          className='space-y-4 pt-6 px-4'
          style={{
            background:
              "linear-gradient(180deg, #C1E3FF 0.02%, #E1F8FF 8.7%, #FFF 19.08%, #FFF 99.98%)",
          }}
        >
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-charcoal'>投递职位</h3>
            <Button
              variant={"ghost"}
              size='icon'
              className='text-charcoal hover:text-vibrant-blue'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <XIcon className='size-4' />
            </Button>
          </div>
          {/* Job Title */}
          <div className='flex items-center gap-2 text-lg'>
            <label className='text-medium-dark-blue-grey font-normal'>
              职位名称:
            </label>
            <div className='text-charcoal font-medium'>{jobTitle}</div>
          </div>

          <ModalContent
            jobTitle={jobTitle}
            uploadedFile={uploadedFile}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

const ModalContent = ({
  uploadedFile,
  handleFileUpload,
  handleRemoveFile,
  handleSubmit,
  isSubmitting,
  isSubmitted,
}: {
  jobTitle: string
  uploadedFile: UploadedFile | null
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: () => void
  handleSubmit: () => void
  isSubmitting: boolean
  isSubmitted: boolean
}) => {
  return (
    <>
      <div className='mt-6'>
        <label className='block text-base font-medium text-gray-700 mb-3'>
          上传附件
        </label>

        {!uploadedFile ? (
          <div className='border border-[#B5CDF0] min-h-40 flex flex-col items-center justify-center rounded-lg p-8 text-center hover:border-gray-400 transition-colors'>
            <input
              type='file'
              id='file-upload'
              className='hidden'
              accept='.pdf,.doc,.docx,.zip'
              onChange={handleFileUpload}
            />
            <label
              htmlFor='file-upload'
              className='cursor-pointer'
            >
              <Plus className='w-10 h-10 text-medium-dark-blue-grey mx-auto mb-4 stroke-1' />
              <div className='text-medium-dark-blue-grey text-sm'>
                请上传您的个人简历材料
              </div>
              <div className='text-sm text-vibrant-blue'>
                仅限word、pdf、zip格式文件
              </div>
            </label>
          </div>
        ) : (
          <div className='border border-[#B5CDF0] min-h-40 flex flex-col items-center justify-center rounded-lg p-8 text-center hover:border-gray-400 transition-colors'>
            <div className='flex flex-col items-center gap-2'>
              <div className='flex items-center gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='36'
                  height='36'
                  viewBox='0 0 36 36'
                  fill='none'
                >
                  <path
                    d='M22.0098 4.83137C21.9043 4.83137 10.4293 4.80676 10.4293 4.80676C8.60117 4.80676 7.12109 6.28684 7.12109 8.11497V27.9677C7.12109 29.7958 8.60117 31.2759 10.4293 31.2759H25.318C27.1461 31.2759 28.6262 29.7958 28.6262 27.9677V11.4267L22.0098 4.83137ZM22.8395 24.6595H12.9113C12.4543 24.6595 12.0852 24.2904 12.0852 23.8333C12.0852 23.3763 12.4543 23.0072 12.9113 23.0072H22.8359C23.293 23.0072 23.6621 23.3763 23.6621 23.8333C23.6656 24.2904 23.2965 24.6595 22.8395 24.6595ZM22.8395 19.699H12.9113C12.4543 19.699 12.0852 19.3298 12.0852 18.8728C12.0852 18.4157 12.4543 18.0466 12.9113 18.0466H22.8359C23.293 18.0466 23.6621 18.4157 23.6621 18.8728C23.6656 19.3263 23.2965 19.699 22.8395 19.699ZM23.6656 11.4267C22.7516 11.4267 22.0098 10.6849 22.0098 9.77083V6.46262L26.9738 11.4267H23.6656Z'
                    fill='#AFCEFB'
                  />
                </svg>
                <div className='font-medium text-medium-dark-blue-grey text-xs'>
                  {uploadedFile.name}
                </div>
              </div>
              <button
                className='text-xs text-vibrant-blue'
                onClick={handleRemoveFile}
              >
                重新上传
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className='flex justify-center fixed sm:relative bottom-2 sm:bottom-0 left-0 right-0 bg-white mx-4'>
        <Button
          onClick={handleSubmit}
          disabled={!uploadedFile || isSubmitting || isSubmitted}
          className='w-full sm:w-fit flex justify-center bg-vibrant-blue hover:bg-blue-700 text-white py-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed h-12 text-lg'
        >
          {isSubmitting ? "提交中..." : "提交申请"}
        </Button>
      </div>
    </>
  )
}
