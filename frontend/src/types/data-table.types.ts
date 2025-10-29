import { PaginationProps } from "@/components/ui/pagination";

export interface Column<T> {
  id: string | number;
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onReorder?: (newData: T[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  draggable?: boolean;
  sortConfig?: SortConfig | null;
  onSort?: (config: SortConfig | null) => void;
  serverSide?: boolean;
  pagination?: PaginationProps;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}
