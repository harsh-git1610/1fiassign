import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        variants: {
          include: {
            emiPlans: true,
          },
        },
      },
    });

    if (!product) {
      return Response.json(
        { error: `Product with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    return Response.json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return Response.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
