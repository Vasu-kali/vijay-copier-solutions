import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
    take: 4,
  });

  return <ProductDetailClient product={product as any} related={related as any} />;
}
