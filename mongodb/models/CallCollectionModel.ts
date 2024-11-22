import { model, models, Schema, Types } from "mongoose";

export interface ICallCollection {
  call_end_time: Date;
  call_duration: string;
  groq_input_tokens: number;
  groq_output_tokens: number;
  last_activity: Date;
  character_count: number;
  completion_model: string;
  active: boolean;
  assistent_id: string;
  user_id: string;
  conversation: Types.ObjectId;
}
export const CallCollectionSchema = new Schema<ICallCollection>(
  {
    call_end_time: Date,
    call_duration: String,
    groq_input_tokens: Number,
    groq_output_tokens: Number,
    last_activity: Date,
    character_count: Number,
    completion_model: String,
    active: Boolean,
    assistent_id: String,
    user_id: String,
    conversation: { type: Schema.Types.ObjectId, ref: "CallConversation" },
  },
  {
    timestamps: true,
  }
);

