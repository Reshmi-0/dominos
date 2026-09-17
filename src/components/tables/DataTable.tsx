import React from 'react';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  columns: ColumnDef<T>[];
  data: T[];
  actionLabel?: string;
  onActionClick?: () => void;
}

export function DataTable<T>({
  title,
  columns,
  data,
  actionLabel,
  onActionClick
}: DataTableProps<T>) {
  return (
    <div className="bg-surface-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h3 className="text-[18px] font-semibold text-text-primary">{title}</h3>
        {actionLabel && onActionClick && (
          <button 
            onClick={onActionClick}
            className="text-[14px] font-semibold text-primary-blue hover:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-x-auto">
        {data.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No data available
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-app border-b border-border">
                {columns.map((col, i) => (
                  <th 
                    key={i} 
                    className={`px-6 py-4 text-[12px] font-semibold text-text-secondary uppercase tracking-wider ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="border-b border-border last:border-none hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col, colIndex) => {
                    const content = typeof col.accessorKey === 'function' 
                      ? col.accessorKey(row) 
                      : (row as any)[col.accessorKey];
                      
                    return (
                      <td 
                        key={colIndex} 
                        className={`px-6 py-4 text-[14px] font-medium text-text-primary ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
