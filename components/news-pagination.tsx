import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type NewsPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
};

function buildHref(page: number, searchQuery?: string) {
  const params = new URLSearchParams();
  if (searchQuery) {
    params.set("name", searchQuery);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  // 7ページ以下は全番号表示
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 8ページ以上は省略記号付き
  const pages: (number | "ellipsis")[] = [];

  if (currentPage <= 4) {
    // 先頭付近: 1 2 3 4 5 ... 最後
    pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
  } else if (currentPage >= totalPages - 3) {
    // 末尾付近: 1 ... 最後-4 最後-3 最後-2 最後-1 最後
    pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    // 中間: 1 ... 前 現在 次 ... 最後
    pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
  }

  return pages;
}

export function NewsPagination({
  currentPage,
  totalPages,
  searchQuery,
}: NewsPaginationProps) {
  // 1ページのみの場合は非表示
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination className="my-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? buildHref(currentPage - 1, searchQuery) : undefined}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildHref(page, searchQuery)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? buildHref(currentPage + 1, searchQuery) : undefined}
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
