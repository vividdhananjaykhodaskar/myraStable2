import { menutoPromptFormate } from "@/lib/formater";
import connectMongo from "@/mongodb/connectmongoDb";
import { POSCollectionModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const req: any = await request.json();
  try {
    await connectMongo();
    const details: any = {
      restaurants: req.restaurants,
      ordertypes: req.ordertypes,
      categories: req.categories,
      parentcategories: req.parentcategories,
      items: req.items,
      attributes: req.attributes,
      taxes: req.taxes,
      discounts: req.discounts,
      addongroups: req.addongroups,
    };
    const my_data = await POSCollectionModel.findOne({});
    const append_promt = menutoPromptFormate(req);
    if (my_data) {
      for (const key in details) {
        my_data[key] = details[key];
      }
      my_data.append_promt = append_promt;
      await my_data.save();
    } else {
      details.append_promt = append_promt;
      await POSCollectionModel.create(details);
    }

    return Response.json({ message: req.message }, { status: req.http_code });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
