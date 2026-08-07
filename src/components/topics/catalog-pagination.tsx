import { Button } from "@/components/ui/button";
import { getPaginationItems } from "@/lib/catalog";

export interface CatalogPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function CatalogPagination({ page, pageCount, onPageChange }: CatalogPaginationProps) {
  if (pageCount <= 1) return null;
  const items = getPaginationItems(page, pageCount);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Topic pages">
      <Button type="button" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      {items.map((item, index) => item === "ellipsis" ? (
        <span key={`ellipsis-${index}`} className="min-w-8 text-center text-muted-foreground">
          <span aria-hidden="true">…</span><span className="sr-only">More pages</span>
        </span>
      ) : (
        <Button
          key={item}
          type="button"
          variant={item === page ? "default" : "outline"}
          className="min-w-10"
          aria-label={`Page ${item}`}
          aria-current={item === page ? "page" : undefined}
          onClick={() => item !== page && onPageChange(item)}
        >
          {item}
        </Button>
      ))}
      <Button type="button" variant="outline" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  );
}
