// Server Component — fetches the same data shape as GET /api/products.
// Calling an own API route from a Server Component over HTTP is an anti-pattern
// in Next.js App Router (it causes an unnecessary network round-trip and can
// fail before the server is up). We query Prisma directly, which is exactly
// what the route handler does, and matches the shape it returns.
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

async function getProducts(): Promise<ProductCard[]> {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      variants: {
        take: 1,
        select: {
          imageUrl: true,
          price: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => {
    let thumbnail = p.variants[0]?.imageUrl ?? null;
    if (thumbnail && thumbnail.includes(",")) {
      thumbnail = thumbnail.split(",")[0].trim();
    }
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      thumbnail,
      startingPrice: p.variants[0]?.price ?? null,
    };
  });
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Smartphones
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </header>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
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
    </main>
  );
}
