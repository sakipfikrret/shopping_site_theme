"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { CategoryCard } from "@/components/category-card"
import { ListingCard } from "@/components/listing-card"
import { categories, mockListings } from "@/lib/data"
import { storage } from "@/lib/storage"
import { useI18n } from "@/lib/i18n-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Zap, Globe, Lock } from "lucide-react"
import Link from "next/link"
import type { Listing } from "@/lib/types"

export default function HomePage() {
  const { t } = useI18n()
  const [listings, setListings] = useState<Listing[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const storedListings = storage.getListings()
    if (storedListings.length === 0) {
      storage.setListings(mockListings)
      setListings(mockListings)
    } else {
      setListings(storedListings)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const featuredListings = listings.filter((l) => l.isFeatured).slice(0, 3)
  const recentListings = listings.slice(0, 6)
  const gamingListings = listings.filter((l) => l.category === "gaming").slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="relative overflow-hidden min-h-[90vh] flex items-center">
          {/* Animated gradient background */}
          <div className="absolute inset-0 holographic opacity-10" />

          {/* Liquid effect background */}
          <div className="absolute inset-0 liquid" />

          {/* Parallax orbs with mouse tracking */}
          <div
            className="absolute top-20 left-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl glow-pulse"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <div
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-color/30 rounded-full blur-3xl glow-pulse"
            style={{
              transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
              transition: "transform 0.3s ease-out",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-3/20 rounded-full blur-3xl scale-pulse"
            style={{
              transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />

          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge with shimmer effect */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass mb-8 animate-fade-in shimmer">
                <Sparkles className="h-5 w-5 text-primary animate-spin-slow" />
                <span className="text-sm font-semibold tracking-wide">{t("home.hero.badge")}</span>
              </div>

              {/* Main title with gradient and scale animation */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 text-balance leading-[0.9] animate-fade-in-up">
                <span className="gradient-text inline-block hover:scale-105 transition-transform duration-300">
                  {t("home.hero.title")}
                </span>
              </h1>

              {/* Subtitle with better spacing */}
              <p className="text-xl md:text-3xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-200 font-light">
                {t("home.hero.subtitle")}
              </p>

              {/* CTA buttons with advanced hover effects */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300 mb-16">
                <Link href="/listings">
                  <Button
                    size="lg"
                    className="holographic text-white font-bold px-10 h-14 text-lg rounded-2xl group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      {t("home.hero.explore")}
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <Link href="/add-listing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="glass-card border-2 font-bold px-10 h-14 text-lg rounded-2xl bg-transparent hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                  >
                    {t("home.hero.postAd")}
                  </Button>
                </Link>
              </div>

              {/* Stats with 3D card effect */}
              <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto">
                {[
                  { value: "10K+", label: t("home.hero.stats.listings"), icon: Zap },
                  { value: "50K+", label: t("home.hero.stats.users"), icon: Globe },
                  { value: "150+", label: t("home.hero.stats.countries"), icon: Shield },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="glass-card p-6 rounded-2xl card-3d hover:glow-pulse group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-4xl md:text-5xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">{t("home.categories")}</h2>
              <p className="text-lg text-muted-foreground">{t("home.categoriesSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div key={category.id} className="stagger-item" style={{ animationDelay: `${index * 80}ms` }}>
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </section>

        {gamingListings.length > 0 && (
          <section className="container mx-auto px-4 py-24">
            <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 holographic opacity-5" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 rounded-2xl holographic">
                    <span className="text-4xl">🎮</span>
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black gradient-text">Gaming Marketplace</h2>
                    <p className="text-lg text-muted-foreground mt-2">Trade rare items, skins, and accounts</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gamingListings.map((listing, index) => (
                    <div key={listing.id} className="slide-in-bottom" style={{ animationDelay: `${index * 150}ms` }}>
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t("home.featured")}</h2>
              <p className="text-muted-foreground">{t("home.featuredSubtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, index) => (
              <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{t("home.recent")}</h2>
              <p className="text-muted-foreground">{t("home.recentSubtitle")}</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="group bg-transparent">
                {t("home.viewAll")}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing, index) => (
              <div key={listing.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden group">
            <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full holographic mb-8 scale-pulse">
                <Lock className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">{t("home.trust.title")}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t("home.trust.description")}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 mt-20 glass">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <div className="font-bold text-2xl gradient-text mb-2">Marketplace</div>
              <p className="text-sm text-muted-foreground">{t("home.footer")}</p>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 Marketplace. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
