"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/** Toast notification */
function Toast({
  title,
  subtitle,
  onDismiss,
}: {
  title: string;
  subtitle: string;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl bg-white px-5 py-4 shadow-2xl border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
          <p className="mt-0.5 text-sm text-gray-500 leading-snug">{subtitle}</p>
        </div>
        <button
          onClick={onDismiss}
          className="mt-0.5 flex-shrink-0 text-gray-400 transition-colors hover:text-gray-700"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Confirmation modal */
function ConfirmModal({
  product,
  variant,
  plan,
  onConfirm,
  onCancel,
}: {
  product: Product;
  variant: Variant;
  plan: EmiPlan;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const total = plan.monthlyAmount * plan.tenureMonths;
  const net = plan.cashback ? total - plan.cashback : total;

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  }

  const variantLabel = [variant.storage, variant.color].filter(Boolean).join(" · ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Confirm your plan</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Product row */}
          <div className="mb-5 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{product.brand}</p>
            <p className="mt-0.5 text-sm font-bold text-gray-900">{product.name}</p>
            <p className="mt-0.5 text-xs text-gray-500">{variantLabel}</p>
          </div>

          {/* Plan breakdown */}
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {[
              { label: "Monthly payment", value: fmt(plan.monthlyAmount) },
              { label: "Tenure", value: `${plan.tenureMonths} months` },
              { label: "Interest", value: plan.interestRate === 0 ? "0% — No-cost EMI" : `${plan.interestRate}% p.a.` },
              { label: "Total payable", value: fmt(total) },
              ...(plan.cashback && plan.cashback > 0
                ? [
                    { label: "Cashback", value: `− ${fmt(plan.cashback)}`, green: true },
                    { label: "Net cost", value: fmt(net), bold: true },
                  ]
                : []),
            ].map(({ label, value, green, bold }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500">{label}</span>
                <span
                  className={[
                    "text-xs",
                    bold ? "font-bold text-gray-900" : "font-medium text-gray-800",
                    green ? "text-green-600" : "",
                  ].join(" ")}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Confirm &amp; Book
          </button>
        </div>
      </div>
    </div>
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
  const [toast, setToast] = useState<{ title: string; subtitle: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const mainImgRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((title: string, subtitle: string) => {
    setToast({ title, subtitle });
    setTimeout(() => setToast(null), 5000);
  }, []);

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
    setShowModal(true);
  }

  function handleConfirm() {
    if (!selectedPlan) return;
    setShowModal(false);
    const variantLabel = [variant.storage, variant.color].filter(Boolean).join(" · ");
    showToast(
      "Plan confirmed",
      `${product.name} (${variantLabel}) — ${formatINR(selectedPlan.monthlyAmount)}/mo × ${selectedPlan.tenureMonths} months`
    );
  }

  const totalPayable = selectedPlan
    ? selectedPlan.monthlyAmount * selectedPlan.tenureMonths
    : null;
  const effectiveCost =
    totalPayable && selectedPlan?.cashback
      ? totalPayable - selectedPlan.cashback
      : totalPayable;

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast title={toast.title} subtitle={toast.subtitle} onDismiss={() => setToast(null)} />
      )}
      {showModal && selectedPlan && (
        <ConfirmModal
          product={product}
          variant={variant}
          plan={selectedPlan}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
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
          <div className="lg:sticky lg:top-24 lg:self-start">
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
              <p className="mt-2 text-sm font-medium text-gray-700">
                EMI plans backed by mutual funds
              </p>
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
                      // pick variant that matches this storage (prefer same colour)
                      const match =
                        product.variants.find(
                          (v) => v.storage === s && v.color === variant.color
                        ) ?? product.variants.find((v) => v.storage === s);
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
                <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                    EMI Summary
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    <span className="text-gray-500">Monthly payment</span>
                    <span className="text-right font-semibold text-gray-900">
                      {formatINR(selectedPlan.monthlyAmount)}
                    </span>

                    <span className="text-gray-500">Tenure</span>
                    <span className="text-right font-semibold text-gray-900">
                      {selectedPlan.tenureMonths} months
                    </span>

                    <span className="text-gray-500">Interest rate</span>
                    <span className="text-right font-semibold text-gray-900">
                      {selectedPlan.interestRate === 0
                        ? "0% (No-cost EMI)"
                        : `${selectedPlan.interestRate}% p.a.`}
                    </span>

                    <span className="text-gray-500">Total payable</span>
                    <span className="text-right font-semibold text-gray-900">
                      {totalPayable !== null ? formatINR(totalPayable) : "—"}
                    </span>

                    {selectedPlan.cashback && selectedPlan.cashback > 0 && (
                      <>
                        <span className="text-gray-500">Cashback</span>
                        <span className="text-right font-semibold text-green-600">
                          − {formatINR(selectedPlan.cashback)}
                        </span>

                        <span className="border-t border-blue-100 pt-1.5 font-semibold text-gray-700">
                          Net cost
                        </span>
                        <span className="border-t border-blue-100 pt-1.5 text-right font-bold text-gray-900">
                          {effectiveCost !== null ? formatINR(effectiveCost) : "—"}
                        </span>
                      </>
                    )}
                  </div>
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
