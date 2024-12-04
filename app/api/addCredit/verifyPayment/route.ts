import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { PaymentOrderModel, User } from "@/mongodb/models/mainModel";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY || "",
  key_secret: process.env.NEXT_RAZORPAY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
    }
    await connectMongo();
  
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();
    const secret = process.env.NEXT_RAZORPAY_SECRET || "";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Validate the payment signature
    const isValidSignature = validateWebhookSignature(
      body,
      razorpay_signature,
      secret
    );
    if (isValidSignature) {
      // Find the order in the database
      const order = await PaymentOrderModel.findOne({
        order_id: razorpay_order_id,
      });

      if (order) {
        // Update the order status to 'paid'
        order.status = "processed";
        const creditToAdd = order.amount / 100;
        const currUser = await User.findById(user.id);
        currUser.credits += creditToAdd;
        await currUser.save(); 
        await order.save(); // Save the updated order to the database
        
        // Return success response
        return NextResponse.json(
          { status: "ok", message: "Payment verified and order updated" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { status: "not_found", message: "Order not found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { status: "verification_failed", message: "Signature mismatch" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { status: "error", message: "Error verifying payment" },
      { status: 500 }
    );
  }
}
