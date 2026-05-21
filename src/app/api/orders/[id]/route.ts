import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const isAdmin = (session.user as any).role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { select: { name: true, images: true, slug: true } } } }, address: true, user: { select: { name: true, email: true } } },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!isAdmin && order.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status } = await req.json();
  const order = await prisma.order.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(order);
}
