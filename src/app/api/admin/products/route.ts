import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  comparePrice: z.number().optional().nullable(),
  stock: z.number().min(0),
  sku: z.string().optional(),
  brand: z.string().default("Xerox"),
  categoryId: z.string(),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

async function requireAdmin(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(products);
  } catch { return NextResponse.json({ error: "Forbidden" }, { status: 403 }); }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });

    const data = parsed.data;
    const product = await prisma.product.create({
      data: { ...data, images: JSON.stringify(data.images), specifications: JSON.stringify(data.specifications) },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const { id, ...rest } = body;
    const parsed = schema.partial().safeParse(rest);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const data: any = { ...parsed.data };
    if (data.images) data.images = JSON.stringify(data.images);
    if (data.specifications) data.specifications = JSON.stringify(data.specifications);

    const product = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (err: any) {
    if (err.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { id } = await req.json();
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
