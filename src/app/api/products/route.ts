import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const featured = searchParams.get("featured") === "true";
    const sort = searchParams.get("sort") || "newest";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "9999999");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (search) where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
    ];
    if (category) where.category = { slug: category };
    if (featured) where.featured = true;
    if (minPrice || maxPrice < 9999999) where.price = { gte: minPrice, lte: maxPrice };

    const orderBy: any =
      sort === "price-asc" ? { price: "asc" } :
      sort === "price-desc" ? { price: "desc" } :
      sort === "rating" ? { rating: "desc" } :
      sort === "popular" ? { reviewCount: "desc" } :
      { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit, include: { category: true } }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
