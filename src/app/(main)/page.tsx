import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, categories, recentProducts] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      categories={categories}
      recentProducts={recentProducts}
    />
  );
}

