import mongoose, { Schema, Document } from "mongoose";

export interface IListing extends Document {
  reference: string;
  title: string;
  description: string;
  type: string;
  price: number;
  deposit: number;
  charges: number;
  chargesIncluded: boolean;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  furnished: boolean;
  availableDate: Date;
  status: string;
  address: string;
  city: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  photos: string[];
  mainPhotoIndex: number;
  features: string[];
  facebookMarketplaceUrl: string | null;
  messengerLink: string;
  viewCount: number;
}

const ListingSchema = new Schema<IListing>(
  {
    reference: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["appartement", "studio", "maison", "villa", "chambre", "duplex"], required: true },
    price: { type: Number, required: true },
    deposit: { type: Number, required: true },
    charges: { type: Number, default: 0 },
    chargesIncluded: { type: Boolean, default: false },
    surface: { type: Number, required: true },
    rooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    floor: { type: Number, default: null },
    furnished: { type: Boolean, required: true },
    availableDate: { type: Date, required: true },
    status: { type: String, enum: ["brouillon", "disponible", "reserve", "loue", "retire"], default: "brouillon" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    photos: [{ type: String }],
    mainPhotoIndex: { type: Number, default: 0 },
    features: [{ type: String }],
    facebookMarketplaceUrl: { type: String, default: null },
    messengerLink: { type: String, default: "" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ListingSchema.index({ city: 1, neighborhood: 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ type: 1 });

export default mongoose.models.Listing || mongoose.model<IListing>("Listing", ListingSchema);
