import { Pagination } from "@heroui/pagination";

interface PoolPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function PoolPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PoolPaginationProps) {
  if (totalItems <= pageSize) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="text-sm text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} pools
      </div>
      <Pagination
        showControls
        showShadow
        color="primary"
        page={currentPage}
        size="sm"
        total={Math.ceil(totalItems / pageSize)}
        onChange={onPageChange}
      />
    </div>
  );
}
