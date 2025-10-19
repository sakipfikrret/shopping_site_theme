"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { storage } from "@/lib/storage"
import { categories } from "@/lib/data"
import type { Listing } from "@/lib/types"
import { Upload, X } from "lucide-react"
import {
  vehicleTypes,
  vehicleBrands,
  engineSizes,
  engineTypes,
  transmissionTypes,
  colors,
  years,
} from "@/lib/vehicle-data"
import { turkeyLocations, propertyTypes, roomCounts, buildingAges, heatingTypes } from "@/lib/location-data"

export default function AddListingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    userName: "",
    userPhone: "",
    isFeatured: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [vehicleData, setVehicleData] = useState({
    vehicleType: "",
    brand: "",
    model: "",
    year: "",
    engineSize: "",
    engineType: "",
    transmission: "",
    color: "",
    mileage: "",
  })

  const [propertyData, setPropertyData] = useState({
    propertyType: "",
    city: "",
    district: "",
    neighborhood: "",
    roomCount: "",
    squareMeters: "",
    buildingAge: "",
    floor: "",
    heatingType: "",
  })

  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([])
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([])

  useEffect(() => {
    if (vehicleData.brand) {
      const brand = vehicleBrands.find((b) => b.id === vehicleData.brand)
      setAvailableModels(brand?.models || [])
      setVehicleData((prev) => ({ ...prev, model: "" }))
    }
  }, [vehicleData.brand])

  useEffect(() => {
    if (propertyData.city) {
      const city = turkeyLocations.find((c) => c.id === propertyData.city)
      setAvailableDistricts(city?.districts || [])
      setPropertyData((prev) => ({ ...prev, district: "", neighborhood: "" }))
    }
  }, [propertyData.city])

  useEffect(() => {
    if (propertyData.district) {
      const district = availableDistricts.find((d) => d.id === propertyData.district)
      setAvailableNeighborhoods(district?.neighborhoods || [])
      setPropertyData((prev) => ({ ...prev, neighborhood: "" }))
    }
  }, [propertyData.district, availableDistricts])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVehicleChange = (field: string, value: string) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePropertyChange = (field: string, value: string) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageAdd = () => {
    // Simulate image upload - in a real app, this would handle file uploads
    const placeholderImage = `/placeholder.svg?height=400&width=600&query=${formData.title || "listing"}`
    setImages((prev) => [...prev, placeholderImage])
  }

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
      alert("Lütfen tüm zorunlu alanları doldurun")
      setIsSubmitting(false)
      return
    }

    // Create new listing
    const newListing: Listing = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      location: formData.location,
      images: images.length > 0 ? images : ["/real-estate-listing-modern.png"],
      userId: "current-user",
      userName: formData.userName || "Anonim Kullanıcı",
      userPhone: formData.userPhone || "Belirtilmemiş",
      createdAt: new Date().toISOString(),
      views: 0,
      isFeatured: formData.isFeatured,
      ...(formData.category === "vehicles" && vehicleData),
      ...(formData.category === "real-estate" && propertyData),
    }

    // Save to storage
    const listings = storage.getListings()
    storage.setListings([newListing, ...listings])

    // Redirect to listing detail
    router.push(`/listing/${newListing.id}`)
  }

  const isVehicleCategory = formData.category === "vehicles"
  const isPropertyCategory = formData.category === "real-estate"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Yeni İlan Ekle</CardTitle>
            <CardDescription>İlanınızın detaylarını girerek yayınlayın</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Kategori <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isVehicleCategory && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Araç Bilgileri</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Araç Tipi</Label>
                      <Select
                        value={vehicleData.vehicleType}
                        onValueChange={(value) => handleVehicleChange("vehicleType", value)}
                      >
                        <SelectTrigger id="vehicleType">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Marka</Label>
                      <Select value={vehicleData.brand} onValueChange={(value) => handleVehicleChange("brand", value)}>
                        <SelectTrigger id="brand">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleBrands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Select
                        value={vehicleData.model}
                        onValueChange={(value) => handleVehicleChange("model", value)}
                        disabled={!vehicleData.brand}
                      >
                        <SelectTrigger id="model">
                          <SelectValue placeholder={vehicleData.brand ? "Seçin" : "Önce marka seçin"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Yıl</Label>
                      <Select value={vehicleData.year} onValueChange={(value) => handleVehicleChange("year", value)}>
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engineType">Yakıt Tipi</Label>
                      <Select
                        value={vehicleData.engineType}
                        onValueChange={(value) => handleVehicleChange("engineType", value)}
                      >
                        <SelectTrigger id="engineType">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {engineTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engineSize">Motor Hacmi</Label>
                      <Select
                        value={vehicleData.engineSize}
                        onValueChange={(value) => handleVehicleChange("engineSize", value)}
                      >
                        <SelectTrigger id="engineSize">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {engineSizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmission">Vites</Label>
                      <Select
                        value={vehicleData.transmission}
                        onValueChange={(value) => handleVehicleChange("transmission", value)}
                      >
                        <SelectTrigger id="transmission">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {transmissionTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Renk</Label>
                      <Select value={vehicleData.color} onValueChange={(value) => handleVehicleChange("color", value)}>
                        <SelectTrigger id="color">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="mileage">Kilometre</Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="Örn: 50000"
                        value={vehicleData.mileage}
                        onChange={(e) => handleVehicleChange("mileage", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {isPropertyCategory && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Emlak Bilgileri</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Emlak Tipi</Label>
                      <Select
                        value={propertyData.propertyType}
                        onValueChange={(value) => handlePropertyChange("propertyType", value)}
                      >
                        <SelectTrigger id="propertyType">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">İl</Label>
                      <Select value={propertyData.city} onValueChange={(value) => handlePropertyChange("city", value)}>
                        <SelectTrigger id="city">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {turkeyLocations.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">İlçe</Label>
                      <Select
                        value={propertyData.district}
                        onValueChange={(value) => handlePropertyChange("district", value)}
                        disabled={!propertyData.city}
                      >
                        <SelectTrigger id="district">
                          <SelectValue placeholder={propertyData.city ? "Seçin" : "Önce il seçin"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDistricts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Mahalle</Label>
                      <Select
                        value={propertyData.neighborhood}
                        onValueChange={(value) => handlePropertyChange("neighborhood", value)}
                        disabled={!propertyData.district}
                      >
                        <SelectTrigger id="neighborhood">
                          <SelectValue placeholder={propertyData.district ? "Seçin" : "Önce ilçe seçin"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNeighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roomCount">Oda Sayısı</Label>
                      <Select
                        value={propertyData.roomCount}
                        onValueChange={(value) => handlePropertyChange("roomCount", value)}
                      >
                        <SelectTrigger id="roomCount">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomCounts.map((count) => (
                            <SelectItem key={count} value={count}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="squareMeters">Metrekare</Label>
                      <Input
                        id="squareMeters"
                        type="number"
                        placeholder="Örn: 120"
                        value={propertyData.squareMeters}
                        onChange={(e) => handlePropertyChange("squareMeters", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buildingAge">Bina Yaşı</Label>
                      <Select
                        value={propertyData.buildingAge}
                        onValueChange={(value) => handlePropertyChange("buildingAge", value)}
                      >
                        <SelectTrigger id="buildingAge">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {buildingAges.map((age) => (
                            <SelectItem key={age} value={age}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floor">Kat</Label>
                      <Input
                        id="floor"
                        placeholder="Örn: 3"
                        value={propertyData.floor}
                        onChange={(e) => handlePropertyChange("floor", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="heatingType">Isıtma</Label>
                      <Select
                        value={propertyData.heatingType}
                        onValueChange={(value) => handlePropertyChange("heatingType", value)}
                      >
                        <SelectTrigger id="heatingType">
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {heatingTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  İlan Başlığı <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Örn: 2018 Model Volkswagen Passat"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Açıklama <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="İlanınız hakkında detaylı bilgi verin..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-sm text-muted-foreground">{formData.description.length} karakter</p>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Fiyat (₺) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Konum <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Örn: İstanbul, Kadıköy"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label>Fotoğraflar</Label>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => handleImageRemove(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <button
                      type="button"
                      onClick={handleImageAdd}
                      className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 flex flex-col items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Fotoğraf Ekle</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">En fazla 6 fotoğraf ekleyebilirsiniz</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">İletişim Bilgileri</h3>
                <div className="space-y-2">
                  <Label htmlFor="userName">İsim</Label>
                  <Input
                    id="userName"
                    placeholder="Adınız Soyadınız"
                    value={formData.userName}
                    onChange={(e) => handleInputChange("userName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPhone">Telefon</Label>
                  <Input
                    id="userPhone"
                    placeholder="0532 123 45 67"
                    value={formData.userPhone}
                    onChange={(e) => handleInputChange("userPhone", e.target.value)}
                  />
                </div>
              </div>

              {/* Featured Option */}
              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked as boolean)}
                />
                <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                  Bu ilanı vitrin ilanı olarak yayınla (ek ücret gerektirir)
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                  İptal
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Yayınlanıyor..." : "İlanı Yayınla"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
