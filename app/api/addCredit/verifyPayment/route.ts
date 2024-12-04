import { validateRequest } from "@/lib/auth";
import connectMongo from "@/mongodb/connectmongoDb";
import { PaymentOrderModel, User } from "@/mongodb/models/mainModel";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_RAZORPAY_KEY || "",
  key_secret: process.env.NEXT_RAZORPAY_SECRET,
});

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction(); // Start the transaction

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

    if (!isValidSignature) {
      return NextResponse.json(
        { status: "verification_failed", message: "Signature mismatch" },
        { status: 400 }
      );
    }

    // Find the order in the database
    const order = await PaymentOrderModel.findOne({
      order_id: razorpay_order_id,
    }).session(session);

    if (!order) {
      return NextResponse.json(
        { status: "not_found", message: "Order not found" },
        { status: 404 }
      );
    }

    // Update the order status to 'processed'
    order.status = "processed";
    const creditToAdd = order.amount / 100; // Amount in credits
    const currUser = await User.findById(user.id).session(session);

    if (!currUser) {
      throw new Error("User not found"); // This will trigger rollback
    }

    currUser.credits += creditToAdd;

    await currUser.save({ session }); // Save the user credits within the transaction
    await order.save({ session }); // Save the updated order within the transaction

    // Commit the transaction if everything succeeds
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { status: "ok", message: "Payment verified and order updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying payment:", error);
    const { razorpay_payment_id } = await request.json();
    // Rollback transaction
    await session.abortTransaction();
    session.endSession();

    // Initiate refund if payment was already processed but failed in the system
    // try {
    //   const refund = await razorpay.payments.refund(razorpay_payment_id, {
    //     speed: "optimum",
    //   });
    //   console.log("Refund initiated successfully:", refund);
    // } catch (refundError) {
    //   console.error("Error initiating refund:", refundError);
    // }

    return NextResponse.json(
      {
        status: "error",
        message: "Error processing payment, refund initiated",
      },
      { status: 500 }
    );
  }
}
