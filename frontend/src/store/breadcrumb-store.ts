"use client";

import { create } from "zustand";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbStore {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  clearBreadcrumbs: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),
}));
