import connectMongo from "@/mongodb/connectmongoDb";
import {ConfigurationModel} from "@/mongodb/models/mainModel";
import Joi from "joi";

const complationSchema = Joi.object({
  system_prompt: Joi.string().required(),
  groq_token: Joi.number().required(),
  groq_temperature: Joi.number().required(),
  groq_model: Joi.string().required(),
});

export async function GET(request: Request) {
  await connectMongo();
  const createdData = await ConfigurationModel.findOne({});
  return Response.json(createdData, { status: 200 });
}

export async function POST(request: Request) {
  const req: any = await request.json();
  await complationSchema.validateAsync(req);

  try {
    await connectMongo();
    await ConfigurationModel.create(req);

    return Response.json({ message: "Configuration created successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const req: any = await request.json();
  await complationSchema.validateAsync(req);

  try {
    await connectMongo();
    const my_data = await ConfigurationModel.findOne({});

    for (const key in req) {
      if (req[key]) {
        my_data[key] = req[key];
      }
    }

    my_data.save();

    return Response.json({ message: "Configuration updated successfully" }, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
