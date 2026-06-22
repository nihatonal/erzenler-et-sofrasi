'use client';

import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type AdminSearchProps = {
  placeholder: string;
  defaultValue?: string;
  className?: string;
};

export function AdminSearch({
  placeholder,
  defaultValue = '',
  className = '',
}: AdminSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div
      className={`flex h-12 items-center gap-3 border border-neutral-200 bg-[#FAF8F3] px-4 ${className}`}
    >
      <Search className="h-4 w-4 text-neutral-400" />

      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            updateSearch(event.currentTarget.value);
          }
        }}
        onChange={(event) => {
          if (event.currentTarget.value === '') {
            updateSearch('');
          }
        }}
        className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
      />

      {defaultValue && (
        <button
          type="button"
          onClick={() => updateSearch('')}
          className="text-neutral-400 transition hover:text-status-inactive"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}