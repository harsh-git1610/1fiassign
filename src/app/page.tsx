// Server Component — fetches the same data shape as GET /api/products.
// Calling an own API route from a Server Component over HTTP is an anti-pattern
// in Next.js App Router (it causes an unnecessary network round-trip and can
// fail before the server is up). We query Prisma directly, which is exactly
// what the route handler does, and matches the shape it returns.
import { prisma } from "@/lib/prisma";
import ProductGrid from "./ProductGrid";

interface ProductCard {
  id: string;
  slug: string;
  name: string;
  brand: string;
  thumbnail: string | null;
  startingPrice: number | null;
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
        </header>
        <ProductGrid products={products} />
      </div>
    </main>
  );
}
