import { validateRequest } from "@/lib/auth";

import connectMongo from "@/mongodb/connectmongoDb";
import { ConfigurationModel, IntegrationModel, User } from "@/mongodb/models/mainModel";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { integation_id: string } }) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const req_data = await request.json();
    await connectMongo();

    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    const integration_data = await IntegrationModel.findById(params.integation_id);
    for (let key in req_data) {
      integration_data[key] = req_data[key];
    }
    await integration_data.save();

    return NextResponse.json({ message: "Integaration updated", data: integration_data }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { integation_id: string } }) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    await connectMongo();

    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    await ConfigurationModel.findOneAndUpdate(
      {
        integration_id: params.integation_id,
      },
      {
        $set: {
          integration_type: "",
          integration_id: null,
        },
      }
    );

    const integration_data = await IntegrationModel.findByIdAndDelete(params.integation_id);

    return NextResponse.json({ message: "Integration Removed", data: integration_data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
