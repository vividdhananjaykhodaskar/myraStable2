import { model, models, Schema } from "mongoose";

export interface ICallCollection {
  restaurant_id: string;
  active: boolean;
  restaurants: any;
  addongroups: any;
  ordertypes: any;
  categories: any;
  parentcategories: any;
  items: any;
  attributes: any;
  taxes: any;
  discounts: any;
  append_promt: string;
}
export const PackagesSchema = new Schema<ICallCollection>(
  {
    restaurant_id: String,
    active: { type: Boolean, default: true },
    restaurants: Array,
    addongroups: Array,
    ordertypes: Array,
    categories: Array,
    parentcategories: Array,
    items: Array,
    attributes: Array,
    taxes: Array,
    discounts: Array,
    append_promt: String,
  },
  {
    timestamps: true,
  }
);


