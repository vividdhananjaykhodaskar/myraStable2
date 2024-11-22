import { menutoPromptFormate } from "@/lib/formater";
import { IntegrationModel } from "@/mongodb/models/mainModel";
import { getMunuList } from "@/service/petpoojaservice";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { integation_id: string } }) {
  try {
    const integration_data = await IntegrationModel.findById(params.integation_id);

    if (!integration_data) {
      return NextResponse.json({ message: "Integration not exists" }, { status: 500 });
    }

    const details = { ...integration_data?.integration_details };
    const restaurant_menu = await getMunuList(integration_data?.integration_details?.menusharingcode);
    if (!restaurant_menu) {
      return NextResponse.json({ message: "Restaurant not exists" }, { status: 500 });
    }
    details.restaurant_menu_prompt = menutoPromptFormate(restaurant_menu);
    details.taxes = restaurant_menu.taxes;
    details.discounts = restaurant_menu.discounts;
    details.items = restaurant_menu.items;
    integration_data.integration_details = details;
    await integration_data.save();

    return NextResponse.json({ message: "Petpooja menu", data: details, menu : restaurant_menu }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
