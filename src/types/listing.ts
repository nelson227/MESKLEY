export type ListingType = "appartement" | "studio" | "maison" | "villa" | "chambre" | "duplex";
export type ListingStatus = "brouillon" | "disponible" | "reserve" | "loue" | "retire";

export interface Listing {
  _id: string;
  reference: string;
  title: string;
  description: string;
  type: ListingType;
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
  availableDate: string;
  status: ListingStatus;
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
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  type?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  city?: string;
  neighborhood?: string;
  furnished?: boolean;
  minSurface?: number;
  maxSurface?: number;
  sort?: "price_asc" | "price_desc" | "date_desc" | "surface_desc";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListingCardData {
  _id: string;
  reference: string;
  title: string;
  type: ListingType;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  city: string;
  neighborhood: string;
  mainPhoto: string;
  status: ListingStatus;
  furnished: boolean;
  createdAt: string;
}
