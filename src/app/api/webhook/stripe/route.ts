import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (!orderId) return NextResponse.json({ error: "No orderId" }, { status: 400 });

    // Update order status & reduce stock
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED", paymentStatus: "PAID", stripePaymentId: session.payment_intent },
    });

    // Reduce stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as any;
    const orderId = session.metadata?.orderId;
    if (orderId) await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED", paymentStatus: "FAILED" } });
  }

  return NextResponse.json({ received: true });
}
