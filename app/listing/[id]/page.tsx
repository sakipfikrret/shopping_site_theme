"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { storage } from "@/lib/storage"
import type { Listing } from "@/lib/types"
import { MapPin, Eye, Calendar, Phone, Mail, Heart, Share2, Flag, ChevronLeft, ChevronRight } from "lucide-react"
import { categories } from "@/lib/data"

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const listings = storage.getListings()
    const found = listings.find((l) => l.id === params.id)
    if (found) {
      setListing(found)
      // Increment view count
      found.views += 1
      storage.setListings(listings)
    }

    // Check if listing is in favorites
    const currentUser = storage.getCurrentUser()
    if (currentUser && found) {
      setIsFavorite(currentUser.favorites.includes(found.id))
    }
  }, [params.id])

  const toggleFavorite = () => {
    const currentUser = storage.getCurrentUser()
    if (!currentUser) {
      alert("Favorilere eklemek için giriş yapmalısınız")
      router.push("/auth")
      return
    }

    if (!listing) return

    const updatedUser = {
      ...currentUser,
      favorites: isFavorite
        ? currentUser.favorites.filter((id) => id !== listing.id)
        : [...currentUser.favorites, listing.id],
    }

    // Update user in storage
    const users = storage.getUsers()
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    storage.setUsers(updatedUsers)
    storage.setCurrentUser(updatedUser)

    setIsFavorite(!isFavorite)
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">İlan bulunamadı</p>
        </div>
      </div>
    )
  }

  const category = categories.find((c) => c.id === listing.category)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
  }

  const handleContact = () => {
    alert(`İletişim: ${listing.userPhone}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Geri
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={listing.images[currentImageIndex] || "/placeholder.svg"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {listing.images.length}
                      </div>
                    </>
                  )}
                </div>
                {listing.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? "border-primary" : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${listing.title} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {category && (
                        <Badge variant="secondary">
                          {category.icon} {category.name}
                        </Badge>
                      )}
                      {listing.isFeatured && <Badge className="bg-accent text-accent-foreground">Vitrin İlan</Badge>}
                    </div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(listing.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views} görüntülenme</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFavorite}
                      className={isFavorite ? "text-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary">{listing.price.toLocaleString("tr-TR")} ₺</p>
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Açıklama</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle>İlan Sahibi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{listing.userName}</p>
                  <p className="text-sm text-muted-foreground">Üye</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleContact}>
                    <Phone className="h-4 w-4 mr-2" />
                    Telefonu Göster
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Mesaj Gönder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Güvenli Alışveriş</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Ürünü satın almadan önce mutlaka görün</li>
                  <li>• Ödemeyi güvenli yöntemlerle yapın</li>
                  <li>• Şüpheli durumları bildirin</li>
                  <li>• Kişisel bilgilerinizi paylaşmayın</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
