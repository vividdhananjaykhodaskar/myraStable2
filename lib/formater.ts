export function menutoPromptFormate(menu: any) {
  if (menu.items && menu.addongroups && menu.categories) {
    const menuitem = menu.items;
    const add_ons = menu.addongroups;

    const addondetaisl: any = {};
    for (let cr_addon of add_ons) {
      let addon_item = cr_addon.addongroupitems.filter((val: any) => val.active === "1");
      addon_item = addon_item.map((val: any) => `${val.addonitemid}-${val.addonitem_name}-${val.addonitem_price}`);
      addondetaisl[cr_addon.addongroupid] = `${cr_addon.addongroupid}_${cr_addon.addongroup_name}(${addon_item.join(",")})`;
    }
    const categories: any = {};
    menu.categories.forEach((element: any) => {
      categories[element.categoryid] = element.categoryname;
    });

    if (menuitem.length > 0) {
      const active_item = menuitem
        .filter((item: any) => item.active === "1")
        .map((item: any) => {
          let string = `${categories[item.item_categoryid]},${item.itemid},${item.itemname}`;

          if (item.variation.length) {
            const active_varient = item.variation.filter((variant: any) => variant.active === "1");
            string += `[${active_varient
              .map((variant: any) => {
                const variation_addon = variant?.addon;
                let variation_addon_val: string = "";
                if (variation_addon.length) {
                  const arrayaddon = variation_addon.map((addon: any) => addondetaisl[addon.addon_group_id]);
                  variation_addon_val = `[${arrayaddon.join(",")}]`;
                }
                return `(${variant.id}-${variant.name}-₹${variant.price}-${variation_addon_val || "[]"})`;
              })
              .join(",")}]`;
          } else {
            let variation_addon_val: string = "";
            if (item.addon.length) {
              const arrayaddon = item.addon.map((addon: any) => addondetaisl[addon.addon_group_id]);
              variation_addon_val = `[${arrayaddon.join(",")}]`;
            }
            string += `[(0-df-₹${item.price}-${variation_addon_val || "[]"})]`;
          }

          return string;
        });

      return active_item.join("/n");
    }
  }
  return ""
}
