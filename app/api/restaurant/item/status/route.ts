import { menutoPromptFormate } from "@/lib/formater";
import { POSCollectionModel } from "@/mongodb/models/mainModel";

export async function POST(request: Request) {
  const req: any = await request.json();
  try {
    const res_pos = await POSCollectionModel.findOne({ restaurant_id: req.restID });
    const items = res_pos.items;
    const addongroups = res_pos.addongroups;
    const OffIds = req.itemID;

    if (req.type === "item") {
      for (let i = 0; i < items.length; i++) {
        if (OffIds.includes(items[i].itemid)) {
          items[i].active = req.inStock ? "1" : "0";    
        }
      }
      res_pos.items = items;
    } else if (req.type === "addon") {
        for (let i = 0; i < addongroups.length; i++) {
            const addOnGropItem = addongroups[i].addongroupitems;
            for (let j = 0; j < addOnGropItem.length; j++) {
                if (OffIds.includes(addOnGropItem[j].addonitemid)) {
                    addOnGropItem[j].active = req.inStock ? "1" : "0";
                }
            }
        }
    }
    
    res_pos.addongroups = addongroups;
    const append_promt = menutoPromptFormate(res_pos);
    res_pos.append_promt = append_promt;

    await POSCollectionModel.updateOne(
      { restaurant_id: req.restID },
      {
        $set: {
          items: res_pos.items,
          addongroups: res_pos.addongroups,
          append_promt: res_pos.append_promt,
        },
      }
    );

    const details = {
      code: 200,
      status: "success",
      message: "Stock status updated successfully",
    };
    return Response.json(details, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 400 });
  }
}
