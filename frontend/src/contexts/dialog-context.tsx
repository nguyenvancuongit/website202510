"use client";

import React, { createContext, ReactNode,useContext } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DialogConfig,useDialog } from "@/hooks/use-dialog";

interface DialogContextType {
  confirm: (config: Omit<DialogConfig, "showCancel"> & { showCancel?: boolean }) => Promise<boolean>;
  alert: (config: Omit<DialogConfig, "showCancel">) => Promise<boolean>;
  openDialog: (config: DialogConfig) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const {
    dialogState,
    confirm,
    alert,
    openDialog,
    handleConfirm,
    handleCancel,
  } = useDialog();

  const contextValue: DialogContextType = {
    confirm,
    alert,
    openDialog,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        dialogState={dialogState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </DialogContext.Provider>
  );
}

export function useGlobalDialog(): DialogContextType {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useGlobalDialog must be used within a DialogProvider");
  }
  return context;
}
