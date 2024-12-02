import { NextRequest, NextResponse } from "next/server";
import  Razorpay from "razorpay";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_xkNx1lpB3upUcJ',
  key_secret: 'Vst5f97cKhc6BeNSq2gPzhYO',
});

// In-memory orders array
let orders = [
  // Example orders, similar to your original list
  {
    order_id: "order_OYpgZes48syJyM",
    amount: 200,
    currency: "INR",
    receipt: "receipt#1",
    status: "paid",
    payment_id: "pay_OYpghHsuyossI8"
  },
  // other orders...
];

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // Validate the payment signature
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      // Find the order in the in-memory array
      const order = orders.find(o => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
      }

      // Return success response
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'verification_failed' }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Error verifying payment' }, { status: 500 });
  }
}
