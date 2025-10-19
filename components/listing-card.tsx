"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Eye, Sparkles } from "lucide-react"
import type { Listing } from "@/lib/types"

interface ListingCardProps {
  listing: Listing
  viewMode?: "grid" | "list"
}

export function ListingCard({ listing, viewMode = "grid" }: ListingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15
    setMousePosition({ x, y })
  }

  const isGamingItem = listing.category === "gaming"

  if (viewMode === "list") {
    return (
      <Link href={`/listing/${listing.id}`}>
        <Card className="overflow-hidden glass-card hover:scale-[1.01] transition-all duration-300 cursor-pointer border-border/50 glow-hover group">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 aspect-video sm:aspect-square flex-shrink-0 overflow-hidden">
              <Image
                src={listing.images[0] || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {listing.isFeatured && (
                <Badge className="absolute top-3 right-3 holographic text-white border-0 shimmer font-bold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {isGamingItem && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold">
                  🎮 Gaming
                </Badge>
              )}
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-3 group-hover:gradient-text transition-all duration-300">
                  {listing.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{listing.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{listing.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-3xl font-black gradient-text">${listing.price.toLocaleString()}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{listing.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card
        className="overflow-hidden glass-card cursor-pointer h-full border-border/50 group relative transition-all duration-500"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${-mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg) scale(1.03)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={listing.images[0] || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover transition-all duration-700"
            style={{
              transform: isHovered ? "scale(1.15)" : "scale(1)",
              filter: isHovered ? "brightness(1.1)" : "brightness(1)",
            }}
          />
          {listing.isFeatured && (
            <Badge className="absolute top-3 right-3 holographic text-white border-0 shimmer font-bold z-10">
              <Sparkles className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {isGamingItem && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold z-10 neon-glow">
              🎮 Gaming
            </Badge>
          )}
          {/* Gradient overlay with parallax effect */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              transform: isHovered
                ? `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
                : "translate(0, 0)",
            }}
          />
          {/* Holographic shine effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `linear-gradient(${mousePosition.x + 135}deg, transparent 30%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)`,
            }}
          />
        </div>
        <CardContent className="p-6 relative" style={{ transform: "translateZ(20px)" }}>
          <h3 className="font-black text-lg mb-3 line-clamp-2 group-hover:gradient-text transition-all duration-300 leading-tight">
            {listing.title}
          </h3>
          <p className="text-3xl font-black gradient-text mb-4">${listing.price.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between text-sm text-muted-foreground border-t border-border/30 mt-2 pt-4">
          <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-medium">
              <Eye className="h-4 w-4" />
              <span>{listing.views}</span>
            </div>
          </div>
        </CardFooter>

        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />
      </Card>
    </Link>
  )
}
