import { Schema } from "mongoose";


export interface ICompilation {
  assistent_name: string;
  share_key: string;
  user_id: string;
  system_prompt: string;
  groq_token: number;
  groq_temperature: number;
  groq_model: string;
  integration_type: string;
  integration_id: any;
  welcome_message: string;
  groq_model_voice: {
    name: string;
    gender: string;
  };
}
export const ConfigurationSchema = new Schema<ICompilation>(
  {
    assistent_name: String,
    share_key: String,
    user_id: String,
    system_prompt: String,
    groq_token: Number,
    groq_temperature: Number,
    groq_model: String,
    integration_type: String,
    integration_id: { type: Schema.Types.ObjectId, ref: "integration" },
    welcome_message: String,
    groq_model_voice: {
      name: { type: String, default: "hi-IN-SwaraNeural" },
      gender: { type: String, default: "Female" }
    },
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



