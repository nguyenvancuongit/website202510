import React, { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  // SortableContext as SortableContextType,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTableProps, SortConfig } from "@/types/data-table.types";

import Pagination from "./ui/pagination";

function SortableRow<T extends { id: string | number }>({
  row,
  columns,
  draggable,
}: // index,
{
  row: T;
  columns: any[];
  draggable: boolean;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "group hover:bg-muted/50 transition-colors",
        isDragging && "opacity-50 bg-muted"
      )}
    >
      {draggable && (
        <TableCell className="w-8 p-2">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell
          key={column.id}
          className={cn("py-3", column.width && `w-[${column.width}]`)}
        >
          {column.cell
            ? column.cell((row as any)[column.accessorKey], row)
            : (row as any)[column.accessorKey]}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onReorder,
  loading = false,
  emptyMessage = "暂无数据",
  draggable = true,
  sortConfig: externalSortConfig,
  onSort,
  pagination,
  serverSide = false,
}: DataTableProps<T>) {
  // Internal state for client-side mode
  const [activeId, setActiveId] = useState<string | null>(null);
  const [internalSortConfig, setInternalSortConfig] =
    useState<SortConfig | null>(null);

  const sortConfig = serverSide ? externalSortConfig : internalSortConfig;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over?.id && onReorder) {
      const oldIndex = data.findIndex((item) => item.id === active.id);
      const newIndex = data.findIndex((item) => item.id === over?.id);

      const newData = arrayMove(data, oldIndex, newIndex);
      onReorder(newData);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleSort = (columnId: string) => {
    if (serverSide && onSort) {
      // External sort control
      const newSortConfig = ((): SortConfig => {
        if (!sortConfig || sortConfig.key !== columnId) {
          return { key: columnId, direction: "asc" };
        }
        return {
          key: columnId,
          direction: sortConfig.direction === "asc" ? "desc" : "asc",
        };
      })();
      onSort(newSortConfig);
    } else {
      // Internal sort control
      setInternalSortConfig((current) => {
        if (!current || current.key !== columnId) {
          return { key: columnId, direction: "asc" };
        }
        if (current.direction === "asc") {
          return { key: columnId, direction: "desc" };
        }
        return null;
      });
    }
  };

  const getSortIcon = (columnId: string | number) => {
    if (!sortConfig || sortConfig.key !== columnId) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                {draggable && <TableHead className="w-8 p-2"></TableHead>}
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "font-medium",
                      column.width && `w-[${column.width}]`,
                      column.sortable && "cursor-pointer select-none"
                    )}
                    onClick={
                      column.sortable
                        ? () => handleSort(column.id as string)
                        : undefined
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-muted-foreground">
                          {getSortIcon(column.id)}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (draggable ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                      <span>加载中...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (draggable ? 1 : 0)}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={sortedData.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedData.map((row, index) => (
                    <SortableRow
                      key={row.id}
                      row={row}
                      columns={columns}
                      draggable={draggable}
                      index={index}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
          <DragOverlay>
            {activeId ? (
              <div className="bg-background border rounded-md shadow-lg opacity-95">
                <Table>
                  <TableBody>
                    {(() => {
                      const activeRow = sortedData.find(
                        (row) => row.id === activeId
                      );
                      return activeRow ? (
                        <SortableRow
                          key={activeRow.id}
                          row={activeRow}
                          columns={columns}
                          draggable={draggable}
                          index={0}
                        />
                      ) : null;
                    })()}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Pagination Controls */}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
}
