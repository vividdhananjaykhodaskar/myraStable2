import { validateRequest } from "@/lib/auth";
import { User } from "@/mongodb/models/mainModel";
import connectMongo from "@/mongodb/connectmongoDb";
import { NextResponse } from "next/server";
import { getMunuList } from "@/service/petpoojaservice";
import { menutoPromptFormate } from "@/lib/formater";
import { ConfigurationModel, IntegrationModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ message: "Invalid Session" }, { status: 401 });
  }

  try {
    const data = await request.json();
    await connectMongo();
    const existingUser = await User.findById(user.id);

    if (!existingUser) {
      return NextResponse.json({ message: "User not exists" }, { status: 409 });
    }

    if (data.type === "petpooja") {
      const existing_res = await IntegrationModel.findOne({
        "integration_details.menusharingcode": data?.integration_details?.menusharingcode,
        user_id: { $ne: user.id },
      });

      if (existing_res) {
        return NextResponse.json({ message: "Restaurant is already added with other account." }, { status: 409 });
      }

      const restaurant_menu = await getMunuList(data?.integration_details?.menusharingcode);
      if (!restaurant_menu) {
        return NextResponse.json({ message: "Restaurant not exists" }, { status: 500 });
      }
      data.integration_details.restaurant_menu_prompt = menutoPromptFormate(restaurant_menu);
      data.integration_details.taxes = restaurant_menu.taxes;
      data.integration_details.discounts = restaurant_menu.discounts;
    }

    const newUser = await IntegrationModel.create({
      ...data,
      user_id: user.id,
    });

    await ConfigurationModel.updateOne({ _id: data.assistant_id }, { $set: { integration_id: newUser._id, integration_type: newUser.type } });

    return NextResponse.json({ message: "Integration created", data: newUser }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
