"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const renderPageLinks = () => {
    const pages = [];
    // Just simple logic to show all pages if totalPages is small, else show first, last and current neighborhood
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <Link
            key={i}
            href={createPageURL(i)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
              currentPage === i
                ? "bg-[#0d9488] text-white"
                : "bg-white border border-[#d7e5df] text-[#475569] hover:bg-[#edf4f1] hover:text-[#0d9488]"
            }`}
          >
            {i}
          </Link>
        );
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        pages.push(
          <span key={i} className="flex h-10 w-10 items-center justify-center text-sm font-semibold text-[#94a3b8]">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7e5df] bg-white text-[#475569] transition hover:bg-[#edf4f1] hover:text-[#0d9488]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3ece7] bg-[#f8fbfa] text-[#cbd5e1] cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </div>
      )}

      {renderPageLinks()}

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d7e5df] bg-white text-[#475569] transition hover:bg-[#edf4f1] hover:text-[#0d9488]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3ece7] bg-[#f8fbfa] text-[#cbd5e1] cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
