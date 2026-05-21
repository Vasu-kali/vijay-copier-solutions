import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ rating: z.number().min(1).max(5), title: z.string().optional(), comment: z.string().min(10) });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { productId, ...data } = body;
  const parsed = schema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const existing = await prisma.review.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existing) return NextResponse.json({ error: "You already reviewed this product" }, { status: 409 });

  const review = await prisma.review.create({ data: { ...parsed.data, userId, productId }, include: { user: { select: { name: true } } } });

  // Recalculate rating
  const reviews = await prisma.review.findMany({ where: { productId }, select: { rating: true } });
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await prisma.product.update({ where: { id: productId }, data: { rating: avgRating, reviewCount: reviews.length } });

  return NextResponse.json(review, { status: 201 });
}
