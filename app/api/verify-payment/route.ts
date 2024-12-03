import { PaymentOrderModel } from "@/mongodb/models/mainModel";
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
      // Find the order in the database
      const order = await PaymentOrderModel.findOne({ order_id: razorpay_order_id });

      if (order) {
        // Update the order status to 'paid'
        order.status = "processed";
        await order.save(); // Save the updated order to the database

        // Return success response
        return NextResponse.json({ status: "ok", message: "Payment verified and order updated" }, { status: 200 });
      } else {
        return NextResponse.json({ status: "not_found", message: "Order not found" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ status: "verification_failed", message: "Signature mismatch" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ status: "error", message: "Error verifying payment" }, { status: 500 });
  }
}
