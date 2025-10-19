"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { ListingCard } from "@/components/listing-card"
import { ListingFilters } from "@/components/listing-filters"
import { storage } from "@/lib/storage"
import type { Listing } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List } from "lucide-react"

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    category: categoryParam || "",
    minPrice: "",
    maxPrice: "",
    location: "",
    search: "",
  })

  useEffect(() => {
    const storedListings = storage.getListings()
    setListings(storedListings)
  }, [])

  useEffect(() => {
    let result = [...listings]

    // Apply category filter
    if (filters.category) {
      result = result.filter((listing) => listing.category === filters.category)
    }

    // Apply price filters
    if (filters.minPrice) {
      result = result.filter((listing) => listing.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((listing) => listing.price <= Number(filters.maxPrice))
    }

    // Apply location filter
    if (filters.location) {
      result = result.filter((listing) => listing.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Apply search filter
    if (filters.search) {
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          listing.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "most-viewed":
        result.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredListings(result)
  }, [listings, filters, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ListingFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Listings Content */}
          <div className="flex-1">
            {/* Header with sorting and view options */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">İlanlar</h1>
                <p className="text-muted-foreground">{filteredListings.length} ilan bulundu</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Options */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">En Yeni</SelectItem>
                    <SelectItem value="oldest">En Eski</SelectItem>
                    <SelectItem value="price-asc">Fiyat (Düşük)</SelectItem>
                    <SelectItem value="price-desc">Fiyat (Yüksek)</SelectItem>
                    <SelectItem value="most-viewed">En Çok Görüntülenen</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Listings Grid/List */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">İlan bulunamadı</p>
                <p className="text-sm text-muted-foreground mt-2">Filtreleri değiştirerek tekrar deneyin</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"
                }
              >
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
