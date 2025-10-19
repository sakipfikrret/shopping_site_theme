"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListingCard } from "@/components/listing-card"
import { storage } from "@/lib/storage"
import type { User, Listing } from "@/lib/types"
import { UserIcon, Heart, Package, Settings } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "info"

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userListings, setUserListings] = useState<Listing[]>([])
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])

  useEffect(() => {
    const user = storage.getCurrentUser()
    if (!user) {
      router.push("/auth")
      return
    }
    setCurrentUser(user)

    // Get user's listings
    const allListings = storage.getListings()
    const myListings = allListings.filter((l) => l.userId === user.id)
    setUserListings(myListings)

    // Get favorite listings
    const favorites = allListings.filter((l) => user.favorites.includes(l.id))
    setFavoriteListings(favorites)
  }, [router])

  const handleRemoveFavorite = (listingId: string) => {
    if (!currentUser) return

    const updatedUser = {
      ...currentUser,
      favorites: currentUser.favorites.filter((id) => id !== listingId),
    }

    // Update user in storage
    const users = storage.getUsers()
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))
    storage.setUsers(updatedUsers)
    storage.setCurrentUser(updatedUser)

    setCurrentUser(updatedUser)
    setFavoriteListings((prev) => prev.filter((l) => l.id !== listingId))
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profilim</h1>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">
                <UserIcon className="h-4 w-4 mr-2" />
                Bilgilerim
              </TabsTrigger>
              <TabsTrigger value="listings">
                <Package className="h-4 w-4 mr-2" />
                İlanlarım
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="h-4 w-4 mr-2" />
                Favorilerim
              </TabsTrigger>
            </TabsList>

            {/* User Info Tab */}
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ad Soyad</p>
                      <p className="font-semibold">{currentUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">E-posta</p>
                      <p className="font-semibold">{currentUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Telefon</p>
                      <p className="font-semibold">{currentUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Üyelik Tarihi</p>
                      <p className="font-semibold">{new Date(currentUser.createdAt).toLocaleDateString("tr-TR")}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Bilgileri Düzenle
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İstatistikler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-primary">{userListings.length}</p>
                      <p className="text-sm text-muted-foreground">Aktif İlan</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-primary">{favoriteListings.length}</p>
                      <p className="text-sm text-muted-foreground">Favori</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-primary">
                        {userListings.reduce((sum, l) => sum + l.views, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Toplam Görüntülenme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>İlanlarım ({userListings.length})</CardTitle>
                    <Button onClick={() => router.push("/add-listing")}>Yeni İlan Ekle</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {userListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-2">Henüz ilanınız yok</p>
                      <p className="text-sm text-muted-foreground mb-4">İlk ilanınızı oluşturun</p>
                      <Button onClick={() => router.push("/add-listing")}>İlan Ver</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorilerim ({favoriteListings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {favoriteListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg text-muted-foreground mb-2">Favori ilanınız yok</p>
                      <p className="text-sm text-muted-foreground mb-4">Beğendiğiniz ilanları favorilere ekleyin</p>
                      <Button onClick={() => router.push("/listings")}>İlanları İncele</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteListings.map((listing) => (
                        <div key={listing.id} className="relative">
                          <ListingCard listing={listing} />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={() => handleRemoveFavorite(listing.id)}
                          >
                            Kaldır
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
