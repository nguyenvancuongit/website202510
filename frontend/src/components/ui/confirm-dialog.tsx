"use client";

import { AlertTriangle, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogState } from "@/hooks/use-dialog";

interface ConfirmDialogProps {
  dialogState: DialogState;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  dialogState,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { isOpen, config } = dialogState;

  if (!config) {
    return null;
  }

  const getIcon = () => {
    switch (config.variant) {
      case "destructive":
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (config.variant) {
      case "destructive":
        return "destructive" as const;
      case "warning":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{config.title}</span>
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {config.message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-2">
          {config.showCancel && (
            <Button variant="outline" onClick={onCancel}>
              {config.cancelText}
            </Button>
          )}
          <Button variant={getConfirmButtonVariant()} onClick={onConfirm}>
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
