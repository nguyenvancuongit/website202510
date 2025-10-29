"use client"

import { useEffect,useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { HASHTAG_CONFIG, HASHTAG_STATUS_VALUES } from "@/config/constants"
import { Hashtag,hashtagAPI } from "@/services/api"
import { useAuthStore } from "@/store/auth-store"

interface HashtagDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  hashtag?: Hashtag | null // For edit mode
}

export default function HashtagDialog({
  open,
  onClose,
  onSuccess,
  hashtag = null,
}: HashtagDialogProps) {
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    status: HASHTAG_STATUS_VALUES.ACTIVE, // Default to active
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditMode = !!hashtag

  useEffect(() => {
    if (hashtag && open) {
      setFormData({
        name: hashtag.name || "",
        status: hashtag.status || HASHTAG_STATUS_VALUES.ACTIVE,
      })
      setErrors({})
    } else if (!hashtag && open) {
      // Reset form for create mode
      setFormData({
        name: "",
        status: HASHTAG_STATUS_VALUES.ACTIVE, // Default to active
      })
      setErrors({})
    }
  }, [hashtag, open])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === "status" ? parseInt(value.toString()) : value 
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "标签名称不能为空"
    } else if (formData.name.length < HASHTAG_CONFIG.VALIDATION.NAME_MIN_LENGTH) {
      newErrors.name = `标签名称至少需要 ${HASHTAG_CONFIG.VALIDATION.NAME_MIN_LENGTH} 个字符`
    } else if (formData.name.length > HASHTAG_CONFIG.VALIDATION.NAME_MAX_LENGTH) {
      newErrors.name = `标签名称不能超过 ${HASHTAG_CONFIG.VALIDATION.NAME_MAX_LENGTH} 个字符`
    } else if (!HASHTAG_CONFIG.VALIDATION.NAME_PATTERN.test(formData.name)) {
      newErrors.name = "标签名称只能包含字母、数字、中文、下划线和连字符"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!token) {
      toast.error("请先登录")
      return
    }

    setLoading(true)

    try {
      if (isEditMode && hashtag) {
        await hashtagAPI.update(parseInt(hashtag.id), {
          name: formData.name.trim(),
          status: formData.status,
        }, token)
        toast.success("标签更新成功")
      } else {
        await hashtagAPI.create({
          name: formData.name.trim(),
          status: formData.status,
        }, token)
        toast.success("标签创建成功")
      }

      onSuccess()
      handleClose()
    } catch (error) {
      console.error("Error saving hashtag:", error)
      if (error instanceof Error) {
        toast.error(error.message || `${isEditMode ? "更新" : "创建"}标签失败`)
      } else {
        toast.error(`${isEditMode ? "更新" : "创建"}标签失败`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!isEditMode) {
      setFormData({ name: "", status: HASHTAG_STATUS_VALUES.ACTIVE })
    }
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "编辑标签" : "新建标签"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">标签名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="输入标签名称，例如：技术、生活、旅行"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500">
              标签名称支持中文、英文、数字、下划线和连字符，长度1-100个字符
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor="status">状态</Label>
              <p className="text-xs text-gray-500">
                启用后标签将可以在系统中使用
              </p>
            </div>
            <Switch
              id="status"
              checked={formData.status === HASHTAG_STATUS_VALUES.ACTIVE}
              onCheckedChange={(checked) => handleInputChange("status", checked ? HASHTAG_STATUS_VALUES.ACTIVE.toString() : HASHTAG_STATUS_VALUES.DISABLED.toString())}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? `${isEditMode ? "更新" : "创建"}中...` : `${isEditMode ? "更新" : "创建"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
