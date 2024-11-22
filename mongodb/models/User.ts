import { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  contact: string;
  salt: string;
}
export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    name: { type: String },
    contact: { type: String },
    salt: { type: String },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

