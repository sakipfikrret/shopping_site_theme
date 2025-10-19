"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/lib/types"
import { ChevronRight } from "lucide-react"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }

  return (
    <div className="relative group/wrapper">
      <Link href={`/listings?category=${category.id}`}>
        <Card
          className="glass-card cursor-pointer h-full border-border/50 group overflow-hidden relative transition-all duration-500"
          style={{
            transform: isHovered
              ? `perspective(1000px) rotateX(${-mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg) scale(1.05)`
              : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Holographic gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 holographic opacity-20"
              style={{
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              }}
            />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent-color/20 blur-xl" />
          </div>

          <CardContent className="p-8 text-center relative z-10">
            <div
              className="text-6xl mb-5 transition-all duration-500 inline-block"
              style={{
                transform: isHovered
                  ? `translateZ(40px) scale(1.2) rotateZ(${mousePosition.x * 0.5}deg)`
                  : "translateZ(0px) scale(1)",
                filter: isHovered ? "drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3))" : "none",
              }}
            >
              {category.icon}
            </div>
            <h3 className="font-black text-xl mb-3 text-balance group-hover:gradient-text transition-all duration-300 leading-tight">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground font-semibold">
              {category.count.toLocaleString()} {category.count === 1 ? "listing" : "listings"}
            </p>
          </CardContent>

          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
        </Card>
      </Link>

      {category.subcategories && category.subcategories.length > 0 && (
        <div className="absolute left-0 top-full mt-2 w-72 opacity-0 invisible group-hover/wrapper:opacity-100 group-hover/wrapper:visible transition-all duration-300 z-50 pointer-events-none group-hover/wrapper:pointer-events-auto">
          <div className="glass-card border border-border/50 rounded-2xl p-4 shadow-2xl animate-fade-in-up">
            <div className="text-sm font-bold text-muted-foreground mb-3 px-2">Subcategories</div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/listings?category=${category.id}&subcategory=${sub.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors group/item"
                >
                  <span className="text-sm font-medium group-hover/item:text-primary transition-colors">
                    {sub.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">{sub.count}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
