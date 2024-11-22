import { model, models, Schema, Document, Types } from "mongoose";

export interface IMessage {
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

export interface ICallConversation extends Document {
  messages: IMessage[];
  lastUpdated: Date;
}

export const CallConversationSchema = new Schema<ICallConversation>(
  {
    messages: [
      {
        role: { type: String, enum: ["user", "system"], required: true },
        content: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

CallConversationSchema.pre("save", function (next) {
  this.messages.forEach((msg: IMessage) => {
    msg.content = msg.content.trim();
  });
  next();
});


