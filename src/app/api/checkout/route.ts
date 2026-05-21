import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth.server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// ─── Razorpay Order Creation ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, addressId, paymentMethod } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  const userId = (session.user as any).id;

  // Fetch products & validate
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

  let subtotal = 0;
  const orderItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stock < item.quantity) throw new Error(`${product.name} is out of stock`);
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    const images = (() => { try { return JSON.parse(product.images)[0] || ""; } catch { return ""; } })();
    return { productId: product.id, quantity: item.quantity, price: product.price, name: product.name, image: images };
  });

  const shipping = subtotal >= 50000 ? 0 : 999;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  // Create order in DB
  const order = await prisma.order.create({
    data: {
      userId,
      addressId: addressId || null,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "RAZORPAY",
      paymentStatus: "PENDING",
      status: "PENDING",
      items: { create: orderItems },
    },
  });

  // UPI / Cash on Delivery — no payment gateway needed
  if (paymentMethod === "UPI" || paymentMethod === "COD") {
    return NextResponse.json({
      orderId: order.id,
      paymentMethod,
      total,
      upiId: process.env.UPI_ID || "9346032643-3@ibl",
      upiName: "Vijay Copier Solutions",
    });
  }

  // Razorpay online payment
  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKey || !razorpaySecret) {
    // Return COD fallback if Razorpay not configured
    return NextResponse.json({ orderId: order.id, paymentMethod: "COD", total, fallback: true });
  }

  const Razorpay = require("razorpay");
  const razorpay = new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret });

  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(total * 100), // paise
    currency: "INR",
    receipt: order.id,
    notes: { orderId: order.id, userId },
  });

  await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: rzpOrder.id } });

  return NextResponse.json({
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    razorpayKey,
    total,
    paymentMethod: "RAZORPAY",
  });
}

// ─── Razorpay Payment Verification ────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID", status: "CONFIRMED", stripePaymentId: razorpay_payment_id },
  });

  return NextResponse.json({ success: true, orderId });
}
