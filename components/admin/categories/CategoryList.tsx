"use client";

import type { CategoryRow } from "./AdminCategoriesClient";
import { CategoryCard } from "./CategoryCard";

type CategoryListProps = {
  categories: CategoryRow[];
  onOptimisticUpdate: (categoryId: string, category: CategoryRow) => void;
  onOptimisticDelete: (categoryId: string) => void;
};

export function CategoryList({
  categories,
  onOptimisticUpdate,
  onOptimisticDelete,
}: CategoryListProps) {
  if (!categories.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-brand-sand bg-brand-cream p-8 text-center text-sm text-brand-muted">
        Henüz kategori yok.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onOptimisticUpdate={onOptimisticUpdate}
          onOptimisticDelete={onOptimisticDelete}
        />
      ))}
    </div>
  );
}