"use client"

import { Header } from "@/components/header"
import { categories } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function CategoriesPage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-96 h-96 bg-primary/30 rounded-full blur-3xl glow-pulse" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-6 shimmer">
              <Sparkles className="h-5 w-5 text-primary animate-spin-slow" />
              <span className="text-sm font-semibold tracking-wide">All Categories</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text">Explore Everything</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse through our comprehensive categories and find exactly what you're looking for
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-12">
          {categories.map((category, index) => (
            <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <Card className="glass-card border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-500">
                <CardContent className="p-8">
                  {/* Category Header */}
                  <Link
                    href={`/listings?category=${category.id}`}
                    className="flex items-center justify-between mb-6 group/header"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl p-4 rounded-2xl glass group-hover/header:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black group-hover/header:gradient-text transition-all duration-300">
                          {category.name}
                        </h2>
                        <p className="text-muted-foreground font-semibold mt-1">
                          {category.count.toLocaleString()} listings available
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-8 w-8 text-muted-foreground group-hover/header:text-primary group-hover/header:translate-x-2 transition-all" />
                  </Link>

                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={sub.id}
                          href={`/listings?category=${category.id}&subcategory=${sub.id}`}
                          className="glass-card border border-border/30 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group/sub card-3d"
                          style={{ animationDelay: `${subIndex * 50}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold group-hover/sub:text-primary transition-colors">
                              {sub.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-bold px-2 py-1 rounded-lg glass">
                              {sub.count}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
