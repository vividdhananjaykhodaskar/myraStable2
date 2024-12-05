import { Schema, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  contact: string;
  salt: string;
  callCost: number;
  isVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  credits: number;
  passwordResetToken: string | null;
  passwordResetTokenExpires: Date | null;
}
export const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }, 
    contact: { type: String },
    salt: { type: String },
    password: { type: String, required: true },
    callCost: { type: Number, default: 0.059 },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
    credits: { type: Number, default: 200 },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpires: { type: Date, default: null },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.verificationToken;
        delete ret.isVerified;
        delete ret.verificationTokenExpires;
        delete ret.passwordResetToken;
        delete ret.passwordResetTokenExpires;
      },
    },
    timestamps: true,
  }
);
