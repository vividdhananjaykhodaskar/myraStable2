import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_xkNx1lpB3upUcJ',
  key_secret: 'Vst5f97cKhc6BeNSq2gPzhYO',
});

// In-memory orders array
let orders = [
  // Example orders, similar to your original list
  // {
  //   order_id: "order_OYpgZes48syJyM",
  //   amount: 200,
  //   currency: "INR",
  //   receipt: "receipt#1",
  //   status: "paid",
  //   payment_id: "pay_OYpghHsuyossI8"
  // },
  // other orders...
];

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt, notes } = await request.json();

    // Razorpay order creation options
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    // Create the order with Razorpay API
    const order = await razorpay.orders.create(options);

    // Add the new order to the in-memory array
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });

    // Return order details to frontend
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating order' }, { status: 500 });
  }
}
