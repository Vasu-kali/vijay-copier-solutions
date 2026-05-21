// Stripe is optional - Razorpay is used for Indian payments
// Only initialize if STRIPE_SECRET_KEY is set
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new (require("stripe"))(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    })
  : null;
