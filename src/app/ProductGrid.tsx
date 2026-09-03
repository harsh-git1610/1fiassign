"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

interface ProductCard {
  id: string;
  slug: string;
  name: string;
  brand: string;
  thumbnail: string | null;
  startingPrice: number | null;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const BRANDS = ["All", "Apple", "Samsung", "Google"];

export default function ProductGrid({ products }: { products: ProductCard[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesBrand = brand === "All" || p.brand === brand;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesBrand && matchesQuery;
    });

    if (sort === "asc") list = [...list].sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
    if (sort === "desc") list = [...list].sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0));

    return list;
  }, [products, query, brand, sort]);

  return (
    <div>
      {/* ── Controls ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search box */}
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search phones..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Brand filter chips */}
          <div className="flex gap-1.5">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                  brand === b
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                ].join(" ")}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "default" | "asc" | "desc")}
            className="rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-gray-600 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="default">Sort: Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="mb-4 text-sm text-gray-400">
        {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <svg className="mb-3 h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-500">No products found</p>
          <p className="mt-1 text-xs text-gray-400">Try a different search or clear filters</p>
          <button
            onClick={() => { setQuery(""); setBrand("All"); setSort("default"); }}
            className="mt-4 rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-1 p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {product.brand}
                </span>
                <h2 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                  {product.name}
                </h2>
                {product.startingPrice !== null && (
                  <p className="mt-1 text-sm text-gray-700">
                    Starting at{" "}
                    <span className="font-semibold text-gray-900">
                      {formatINR(product.startingPrice)}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
