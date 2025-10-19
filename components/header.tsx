"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, User, LogOut, Heart } from "lucide-react"
import { storage } from "@/lib/storage"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "./language-switcher"
import type { User as UserType } from "@/lib/types"
import Image from "next/image"

export function Header() {
  const router = useRouter()
  const { t } = useI18n()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    setCurrentUser(storage.getCurrentUser())
  }, [])

  const handleLogout = () => {
    storage.logout()
    setCurrentUser(null)
    router.push("/")
  }

  return (
    <header className="glass border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden group-hover:scale-110 transition-transform duration-300 glow-hover">
              <Image src="/logo.jpg" alt="Marketplace Logo" fill className="object-cover" />
            </div>
            <span className="font-black text-2xl gradient-text hidden sm:inline">Marketplace</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("header.search")}
                className="pl-12 h-12 glass-card border-border/50 focus:border-primary/50 transition-colors text-base"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link href="/add-listing">
              <Button className="gradient-bg text-white font-semibold h-11 px-6 glow-hover group">
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">{t("header.postListing")}</span>
              </Button>
            </Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="glass-card border-border/50 h-11 w-11 bg-transparent"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    {t("header.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile?tab=favorites")} className="cursor-pointer">
                    <Heart className="h-4 w-4 mr-2" />
                    {t("header.favorites")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("header.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="icon" className="glass-card border-border/50 h-11 w-11 bg-transparent">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("header.search")}
              className="pl-12 h-12 glass-card border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
