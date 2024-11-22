import { Schema } from "mongoose";

export interface ICompilation {
  order_id: string;
  user_id: string;
  assistant_id: string;
  restaurant_id: string;
  status: any;
}
export const PetPoojaOrderSchema = new Schema<ICompilation>(
  {
    order_id: String,
    user_id: String,
    assistant_id: String,
    restaurant_id: String,
    status: Object,
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);
