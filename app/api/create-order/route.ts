import { PaymentOrderModel } from "@/mongodb/models/mainModel";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_xkNx1lpB3upUcJ',
  key_secret: 'Vst5f97cKhc6BeNSq2gPzhYO',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json();

    // Razorpay order creation options
    const options = {
      amount, // Amount is expected in smallest currency unit (e.g., paise for INR)
      currency,
      receipt,
      notes,
    };

    // Create the order with Razorpay API
    const razorpayOrder = await razorpay.orders.create(options);

    // Save the order details to MongoDB
    const newOrder = new PaymentOrderModel({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status || "created",
    });

    await newOrder.save();

    // Return order details to frontend
    return NextResponse.json(razorpayOrder, { status: 200 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}