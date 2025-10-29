"use client";

import { useCallback,useState } from "react";

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning";
  showCancel?: boolean;
}

export interface DialogState {
  isOpen: boolean;
  config: DialogConfig | null;
  resolve: ((value: boolean) => void) | null;
}

export function useDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    config: null,
    resolve: null,
  });

  const openDialog = useCallback((config: DialogConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        config: {
          confirmText: "确认",
          cancelText: "取消",
          variant: "default",
          showCancel: true,
          ...config,
        },
        resolve,
      });
    });
  }, []);

  const confirm = useCallback(
    (
      config: Omit<DialogConfig, "showCancel"> & { showCancel?: boolean }
    ): Promise<boolean> => {
      return openDialog({
        variant: "destructive",
        confirmText: "确认",
        cancelText: "取消",
        showCancel: true,
        ...config,
      });
    },
    [openDialog]
  );

  const alert = useCallback(
    (config: Omit<DialogConfig, "showCancel">): Promise<boolean> => {
      return openDialog({
        confirmText: "确定",
        showCancel: false,
        ...config,
      });
    },
    [openDialog]
  );

  const closeDialog = useCallback(
    (result: boolean = false) => {
      if (dialogState.resolve) {
        dialogState.resolve(result);
      }
      setDialogState({
        isOpen: false,
        config: null,
        resolve: null,
      });
    },
    [dialogState.resolve]
  );

  const handleConfirm = useCallback(() => {
    closeDialog(true);
  }, [closeDialog]);

  const handleCancel = useCallback(() => {
    closeDialog(false);
  }, [closeDialog]);

  return {
    dialogState,
    openDialog,
    confirm,
    alert,
    closeDialog,
    handleConfirm,
    handleCancel,
  };
}
