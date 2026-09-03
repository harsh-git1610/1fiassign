import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
      orderBy: {
        createdAt: "asc",
      },
    });

    const response = products.map((product) => {
      const firstVariant = product.variants[0];
      let thumbnail = firstVariant?.imageUrl ?? null;
      if (thumbnail && thumbnail.includes(",")) {
        thumbnail = thumbnail.split(",")[0].trim();
      }
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        thumbnail,
        startingPrice: firstVariant?.price ?? null,
      };
    });

    return Response.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
