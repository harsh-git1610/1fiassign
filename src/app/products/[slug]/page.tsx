"use client";

import { useEffect, useState } from "react";
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function VariantPill({
  variant,
  selected,
  onClick,
}: {
  variant: Variant;
  selected: boolean;
  onClick: () => void;
}) {
  const label = [variant.storage, variant.color].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900",
        selected
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
      ].join(" ")}
    >
      {label || `Variant ${variant.id.slice(-4)}`}
    </button>
  );
}

function EmiCard({
  plan,
  selected,
  onClick,
}: {
  plan: EmiPlan;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <label
      className={[
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
        selected
          ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
          : "border-gray-200 bg-white hover:border-gray-400",
      ].join(" ")}
    >
      {/* Radio */}
      <input
        type="radio"
        name="emi-plan"
        checked={selected}
        onChange={onClick}
        className="mt-0.5 accent-gray-900"
      />

      <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
        {/* Left: tenure + rate */}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {plan.tenureMonths} months
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {plan.interestRate === 0
              ? "No-cost EMI"
              : `${plan.interestRate}% p.a.`}
          </p>
        </div>

        {/* Right: monthly amount + cashback */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            {formatINR(plan.monthlyAmount)}
            <span className="font-normal text-gray-500">/mo</span>
          </p>
          {plan.cashback !== null && plan.cashback > 0 && (
            <p className="mt-0.5 text-xs font-medium text-green-600">
              ₹{plan.cashback.toLocaleString("en-IN")} cashback
            </p>
          )}
        </div>
      </div>
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; product: Product };

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();

  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Fetch product on mount
  useEffect(() => {
    if (!slug) return;
    setFetchState({ status: "loading" });

    fetch(`/api/products/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ??
              `Request failed: ${res.status}`
          );
        }
        return res.json() as Promise<Product>;
      })
      .then((product) => {
        setFetchState({ status: "success", product });
        setSelectedVariantId(product.variants[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        setFetchState({
          status: "error",
          message:
            err instanceof Error ? err.message : "Failed to load product.",
        });
      });
  }, [slug]);

  // Reset selected plan whenever the variant changes
  useEffect(() => {
    setSelectedPlanId(null);
  }, [selectedVariantId]);

  // ── Loading / Error states ────────────────────────────────────────────────

  if (fetchState.status === "idle" || fetchState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4">
        <p className="text-sm text-red-600">{fetchState.message}</p>
        <Link href="/" className="text-sm text-gray-500 underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  const { product } = fetchState;
  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants[0];

  if (!variant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">No variants available.</p>
      </div>
    );
  }

  const selectedPlan = variant.emiPlans.find((p) => p.id === selectedPlanId);

  function handleProceed() {
    if (!selectedPlan) return;
    const detail = [
      `Plan: ${selectedPlan.tenureMonths} months`,
      `Monthly: ${formatINR(selectedPlan.monthlyAmount)}`,
      selectedPlan.interestRate === 0
        ? "No-cost EMI"
        : `Interest: ${selectedPlan.interestRate}% p.a.`,
      selectedPlan.cashback
        ? `Cashback: ₹${selectedPlan.cashback.toLocaleString("en-IN")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    alert(`Proceeding with:\n\n${detail}`);
  }

  const discount = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-700">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ── Left: Image ─────────────────────────────────────────────── */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 lg:sticky lg:top-8 lg:self-start">
            <Image
              key={variant.imageUrl}
              src={variant.imageUrl}
              alt={`${product.name} – ${variant.color ?? ""}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* ── Right: Details ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-7">
            {/* Header */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {product.brand}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-gray-900">
                {formatINR(variant.price)}
              </span>
              {variant.mrp > variant.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    {formatINR(variant.mrp)}
                  </span>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div>
                <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Variant
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <VariantPill
                      key={v.id}
                      variant={v}
                      selected={v.id === selectedVariantId}
                      onClick={() => setSelectedVariantId(v.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* EMI plans */}
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                EMI Plans
              </h2>

              {variant.emiPlans.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No EMI plans available for this variant.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {variant.emiPlans
                    .slice()
                    .sort((a, b) => a.tenureMonths - b.tenureMonths)
                    .map((plan) => (
                      <EmiCard
                        key={plan.id}
                        plan={plan}
                        selected={plan.id === selectedPlanId}
                        onClick={() => setSelectedPlanId(plan.id)}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="sticky bottom-4 lg:static">
              <button
                type="button"
                disabled={!selectedPlan}
                onClick={handleProceed}
                className={[
                  "w-full rounded-xl py-3.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900",
                  selectedPlan
                    ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {selectedPlan
                  ? `Proceed — ${formatINR(selectedPlan.monthlyAmount)}/mo × ${selectedPlan.tenureMonths} months`
                  : "Select an EMI plan to proceed"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
