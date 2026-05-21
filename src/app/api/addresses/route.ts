import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(5),
  country: z.string().default("India"),
  isDefault: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } });
  return NextResponse.json(addresses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({ data: { ...parsed.data, userId } });
  return NextResponse.json(address, { status: 201 });
}
