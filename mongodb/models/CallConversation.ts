import { model, models, Schema, Document, Types } from "mongoose";

export interface IMessage {
  role: "user" | "system";
  content: string;
  timestamp: Date;
}

export interface ICallConversation extends Document {
  messages: IMessage[];
  lastUpdated: Date;
  callId?: string;//
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
    callId: { type: String, required: false },//
  },
  {
    timestamps: true,
  }
);

CallConversationSchema.path("callId").validate(function (// 
  this: ICallConversation,
  value: string
) {
  const type = (this as any).type;
  if (type === "phone" && !value) {
    return false;
  }
  return true;
}, "callId is required when type is 'phone'.");

CallConversationSchema.pre("save", function (next) {
  this.messages.forEach((msg: IMessage) => {
    msg.content = msg.content.trim();
  });
  next();
});


