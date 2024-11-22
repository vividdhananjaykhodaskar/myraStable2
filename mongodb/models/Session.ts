import { Document, Schema, model, models } from "mongoose";

export interface ISession extends Document {
  _id: string;
  user_id: Schema.Types.ObjectId;
  expires_at: Date;
}

export const sessionSchema = new Schema<ISession>({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
});


