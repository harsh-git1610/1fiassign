"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmiPlan {
  id: string;
  variantId: string;
  monthlyAmount: number;
  tenureMonths: number;
  interestRate: number;
  cashback: number | null;
}

interface Variant {
  id: string;
  storage: string | null;
  color: string | null;
  mrp: number;
  price: number;
  imageUrl: string;
  emiPlans: EmiPlan[];
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string | null;
  variants: Variant[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Support multiple photos:
 * 1. If imageUrl contains multiple URLs separated by commas or whitespace, parse them.
 * 2. If it's an Unsplash URL, derive different angle/crop frames for showcase.
 * 3. Otherwise return the image as-is.
 */
function deriveGallery(imageUrl: string): string[] {
  if (!imageUrl) return [];

  // Check for comma-separated or space-separated multiple URLs
  if (imageUrl.includes(",")) {
    const urls = imageUrl.split(",").map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) return urls;
  }

  const isUnsplash = imageUrl.includes("unsplash.com");
  if (!isUnsplash) return [imageUrl];

  const base = imageUrl.split("?")[0];
  return [
    `${base}?auto=format&fit=crop&w=800&q=80`,
    `${base}?auto=format&fit=crop&crop=top&w=800&q=80`,
    `${base}?auto=format&fit=crop&crop=bottom&w=800&q=80`,
    `${base}?auto=format&fit=crop&crop=entropy&w=800&q=80`,
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Thumbnail strip entry */
function Thumb({
  src,
  alt,
  active,
  onClick,
}: {
  src: string;
  alt: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
        active
          ? "border-blue-600 shadow-sm"
          : "border-transparent hover:border-gray-300",
      ].join(" ")}
    >
      <Image src={src} alt={alt} fill sizes="64px" className="object-contain p-1" />
    </button>
  );
}

/** Storage / colour variant chip */
function VariantChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-md border px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        selected
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

/** EMI plan radio card */
function EmiCard({
  plan,
  selected,
  onSelect,
}: {
  plan: EmiPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  const isNoCost = plan.interestRate === 0;

  return (
    <label
      className={[
        "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all",
        selected
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
      ].join(" ")}
    >
      <input
        type="radio"
        name="emi-plan"
        checked={selected}
        onChange={onSelect}
        className="h-4 w-4 accent-blue-600"
      />

      <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {/* Tenure */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {plan.tenureMonths} months
          </span>
          {isNoCost && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[11px] font-semibold text-green-700">
              NO COST
            </span>
          )}
          {!isNoCost && (
            <span className="text-xs text-gray-400">
              @ {plan.interestRate}% p.a.
            </span>
          )}
        </div>

        {/* Amount + cashback */}
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {formatINR(plan.monthlyAmount)}
            <span className="font-normal text-gray-400">/mo</span>
          </p>
          {plan.cashback !== null && plan.cashback > 0 && (
            <p className="text-xs font-medium text-green-600">
              + ₹{plan.cashback.toLocaleString("en-IN")} cashback
            </p>
          )}
        </div>
      </div>
    </label>
  );
}

/** Full-page loading skeleton */
function Skeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-square w-full rounded-2xl bg-gray-100" />
        <div className="flex flex-col gap-5">
          <div className="h-5 w-24 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-2/3 rounded bg-gray-100" />
          <div className="mt-2 h-10 w-1/2 rounded bg-gray-200" />
          <div className="mt-4 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Fetch State ──────────────────────────────────────────────────────────────

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; product: Product };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const mainImgRef = useRef<HTMLDivElement>(null);

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    setFetchState({ status: "loading" });
    fetch(`/api/products/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? `HTTP ${res.status}`
          );
        }
        return res.json() as Promise<Product>;
      })
      .then((product) => {
        setFetchState({ status: "success", product });
        setSelectedVariantId(product.variants[0]?.id ?? null);
      })
      .catch((err: unknown) =>
        setFetchState({
          status: "error",
          message: err instanceof Error ? err.message : "Failed to load product.",
        })
      );
  }, [slug]);

  // Reset plan + photo when variant changes
  useEffect(() => {
    setSelectedPlanId(null);
    setActivePhotoIndex(0);
  }, [selectedVariantId]);

  // ── States ────────────────────────────────────────────────────────────────

  if (fetchState.status === "idle" || fetchState.status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Skeleton />
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <div className="rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-red-600">{fetchState.message}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-blue-600 underline hover:text-blue-800"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  const { product } = fetchState;
  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  if (!variant) return null;

  const gallery = deriveGallery(variant.imageUrl);
  const activePhoto = gallery[activePhotoIndex] ?? gallery[0];
  const sortedPlans = variant.emiPlans
    .slice()
    .sort((a, b) => a.tenureMonths - b.tenureMonths);
  const selectedPlan = sortedPlans.find((p) => p.id === selectedPlanId);
  const discount = Math.round(
    ((variant.mrp - variant.price) / variant.mrp) * 100
  );

  // Split variants by storage, then by colour for Amazon-style pickers
  const allStorage = [...new Set(product.variants.map((v) => v.storage).filter(Boolean))];
  const allColors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  function handleProceed() {
    if (!selectedPlan) return;
    const lines = [
      `Product:  ${product.name}`,
      `Variant:  ${[variant.storage, variant.color].filter(Boolean).join(" · ")}`,
      `Plan:     ${selectedPlan.tenureMonths} months @ ${selectedPlan.interestRate === 0 ? "No-cost EMI" : `${selectedPlan.interestRate}% p.a.`}`,
      `Monthly:  ${formatINR(selectedPlan.monthlyAmount)}`,
      selectedPlan.cashback
        ? `Cashback: ₹${selectedPlan.cashback.toLocaleString("en-IN")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
    alert(`✅ Proceeding with:\n\n${lines}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-xs text-gray-500 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>›</span>
          <Link href="/" className="hover:text-blue-600">
            Smartphones
          </Link>
          <span>›</span>
          <span className="max-w-[220px] truncate text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">

          {/* ═══════════════════ LEFT: Image gallery ═══════════════════════ */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Main image */}
              <div
                ref={mainImgRef}
                className="relative aspect-square w-full overflow-hidden bg-white"
              >
                <Image
                  key={activePhoto}
                  src={activePhoto}
                  alt={`${product.name} view ${activePhotoIndex + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-contain p-8 transition-opacity duration-200"
                />

                {/* Photo index badge */}
                <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {activePhotoIndex + 1} / {gallery.length}
                </div>

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                    {discount}% off
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-2 overflow-x-auto p-3">
                {gallery.map((src, i) => (
                  <Thumb
                    key={i}
                    src={src}
                    alt={`${product.name} photo ${i + 1}`}
                    active={i === activePhotoIndex}
                    onClick={() => setActivePhotoIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════ RIGHT: Details ════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* ── Product header ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                {product.brand}
              </p>
              <h1 className="mt-1 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {product.description}
                </p>
              )}

              <hr className="my-4 border-gray-100" />

              {/* Pricing */}
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  {formatINR(variant.price)}
                </span>
                {variant.mrp > variant.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      {formatINR(variant.mrp)}
                    </span>
                    <span className="text-base font-semibold text-green-600">
                      Save {formatINR(variant.mrp - variant.price)}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Inclusive of all taxes. Free delivery.
              </p>

              {/* ── Storage picker ──────────────────────────────────────── */}
              {allStorage.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Storage
                    {variant.storage && (
                      <span className="ml-2 normal-case font-normal text-gray-700">
                        — {variant.storage}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allStorage.map((s) => {
                      // pick first variant that matches this storage
                      const match = product.variants.find((v) => v.storage === s);
                      return (
                        <VariantChip
                          key={s!}
                          label={s!}
                          selected={variant.storage === s}
                          onClick={() =>
                            match && setSelectedVariantId(match.id)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Colour picker ───────────────────────────────────────── */}
              {allColors.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Colour
                    {variant.color && (
                      <span className="ml-2 normal-case font-normal text-gray-700">
                        — {variant.color}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map((c) => {
                      // pick variant that matches this colour (prefer same storage)
                      const match =
                        product.variants.find(
                          (v) => v.color === c && v.storage === variant.storage
                        ) ?? product.variants.find((v) => v.color === c);
                      return (
                        <VariantChip
                          key={c!}
                          label={c!}
                          selected={variant.color === c}
                          onClick={() =>
                            match && setSelectedVariantId(match.id)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── EMI plans ──────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  EMI Options
                </h2>
                <span className="text-xs text-gray-400">
                  {sortedPlans.length} plan{sortedPlans.length !== 1 ? "s" : ""} available
                </span>
              </div>

              {sortedPlans.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No EMI plans available for this variant.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {sortedPlans.map((plan) => (
                    <EmiCard
                      key={plan.id}
                      plan={plan}
                      selected={plan.id === selectedPlanId}
                      onSelect={() => setSelectedPlanId(plan.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── CTA ────────────────────────────────────────────────────── */}
            <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:static sm:shadow-sm">
              {selectedPlan ? (
                <div className="mb-3 rounded-lg bg-blue-50 px-4 py-2.5">
                  <p className="text-xs font-medium text-blue-700">
                    Selected plan:{" "}
                    <strong>
                      {formatINR(selectedPlan.monthlyAmount)}/mo ×{" "}
                      {selectedPlan.tenureMonths} months
                    </strong>
                    {selectedPlan.interestRate === 0 && " · No-cost EMI"}
                    {selectedPlan.cashback && (
                      <> · ₹{selectedPlan.cashback.toLocaleString("en-IN")} cashback</>
                    )}
                  </p>
                </div>
              ) : (
                <p className="mb-3 text-center text-xs text-gray-400">
                  Select an EMI plan above to continue
                </p>
              )}
              <button
                type="button"
                disabled={!selectedPlan}
                onClick={handleProceed}
                className={[
                  "w-full rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  selectedPlan
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {selectedPlan ? "Proceed with Selected Plan →" : "Choose a Plan First"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
