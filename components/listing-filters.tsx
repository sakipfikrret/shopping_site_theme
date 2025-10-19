"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"
import { X } from "lucide-react"

interface ListingFiltersProps {
  filters: {
    category: string
    minPrice: string
    maxPrice: string
    location: string
    search: string
  }
  onFiltersChange: (filters: any) => void
}

export function ListingFilters({ filters, onFiltersChange }: ListingFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      search: "",
    })
  }

  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.location || filters.search

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtreler</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Ara</Label>
          <Input
            id="search"
            placeholder="İlan ara..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Fiyat Aralığı</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Konum</Label>
          <Input
            id="location"
            placeholder="Şehir veya ilçe"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
