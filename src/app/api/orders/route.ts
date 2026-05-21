import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } }, address: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}
