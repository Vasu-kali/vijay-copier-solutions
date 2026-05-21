import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, ordersByStatus] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true, email: true } }, items: true } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  return NextResponse.json({ totalOrders, totalRevenue: totalRevenue._sum.total || 0, totalUsers, totalProducts, recentOrders, ordersByStatus });
}
