import { model, models, Schema, Document } from "mongoose";

export interface IPaymentOrder extends Document {
  order_id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: "created" | "processed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentOrderSchema = new Schema<IPaymentOrder>(
  {
    order_id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    receipt: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "processed", "failed"],
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

PaymentOrderSchema.pre("save", function (next) {
  this.order_id = this.order_id.trim();
  this.receipt = this.receipt.trim();
  next();
});

PaymentOrderSchema.path("status").validate(function (value: string) {
  const validStatuses = ["created", "processed", "failed"];
  return validStatuses.includes(value);
}, "Invalid status value.");


