export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory?: string
  location: string
  images: string[]
  userId: string
  userName: string
  userPhone: string
  createdAt: string
  views: number
  isFeatured?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: string
  favorites: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  count: number
}

export interface GamingItem extends Listing {
  game: string
  itemType: "skin" | "weapon" | "character" | "currency" | "account" | "other"
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic"
  condition?: "factory-new" | "minimal-wear" | "field-tested" | "well-worn" | "battle-scarred"
  floatValue?: number
  tradeLink?: string
  steamId?: string
}

export interface VehicleListing extends Listing {
  vehicleType?: string
  brand?: string
  model?: string
  year?: string
  engineSize?: string
  engineType?: string
  transmission?: string
  fuelType?: string
  mileage?: number
  color?: string
}

export interface PropertyListing extends Listing {
  propertyType?: string
  city?: string
  district?: string
  neighborhood?: string
  roomCount?: string
  squareMeters?: number
  buildingAge?: string
  floor?: string
  heatingType?: string
}
