import { model, models, Schema } from "mongoose";

export interface ICompilation {
  assistant_id: string;
  user_id: string;
  type: string;
  integration_details: any;
}
export const IntegrationSchema = new Schema<ICompilation>(
  {
    assistant_id: String,
    user_id: String,
    type: String,
    integration_details: Object,
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
