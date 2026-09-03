import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ variantId: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { variantId } = await context.params;
    const body = await request.json() as { imageUrl?: string };

    if (!body.imageUrl || typeof body.imageUrl !== "string") {
      return Response.json({ error: "imageUrl is required." }, { status: 400 });
    }

    const updated = await prisma.variant.update({
      where: { id: variantId },
      data: { imageUrl: body.imageUrl },
      select: { id: true, imageUrl: true },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating variant image:", error);
    // Prisma P2025 = record not found
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("P2025")) {
      return Response.json({ error: "Variant not found." }, { status: 404 });
    }
    return Response.json({ error: "Failed to update image." }, { status: 500 });
  }
}
