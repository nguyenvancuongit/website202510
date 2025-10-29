"use client";

import { useEffect,useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FriendLink } from "@/hooks/api/use-friend-links";

interface FriendLinkFormData {
  name: string;
  url: string;
  sortOrder?: number;
  status: number;
}

interface FriendLinkMutationModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: FriendLinkFormData;
  setFormData: (data: FriendLinkFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingFriendLink: FriendLink | null;
  resetForm: () => void;
}

function FriendLinkMutationModal({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  setFormData,
  onSubmit,
  submitting,
  editingFriendLink,
  resetForm,
}: FriendLinkMutationModalProps) {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const nameLen = formData.name.trim().length;
    setIsFormValid(nameLen > 0 && nameLen <= 20 && formData.url.trim().length > 0);
  }, [formData]);

  const handleClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => resetForm()}>
          <Plus className="w-4 h-4 mr-2" />
          添加友情链接
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingFriendLink ? "编辑友情链接" : "添加友情链接"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">友链名称 *</Label>
            <Input
              id="name"
              type="text"
              placeholder="请输入友链名称"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500">最多 20 个字符</p>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">友链地址 *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">排序</Label>
            <Input
              id="sortOrder"
              type="number"
              placeholder="请输入排序值（可选）"
              value={formData.sortOrder?.toString() || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sortOrder: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              min="0"
              step="1"
            />
            <p className="text-xs text-gray-500">
              排序值越小越靠前，留空则自动排在最后
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={formData.status.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, status: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">启用</SelectItem>
                <SelectItem value="0">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button type="submit" disabled={submitting || !isFormValid}>
              {submitting
                ? "提交中..."
                : editingFriendLink
                ? "更新友情链接"
                : "创建友情链接"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { FriendLinkMutationModal };
export default FriendLinkMutationModal;
