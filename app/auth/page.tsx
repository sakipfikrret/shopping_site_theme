"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { storage } from "@/lib/storage"
import type { User } from "@/lib/types"

export default function AuthPage() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const users = storage.getUsers()
    const user = users.find((u) => u.email === loginData.email && u.password === loginData.password)

    if (user) {
      storage.setCurrentUser(user)
      alert("Giriş başarılı!")
      router.push("/profile")
    } else {
      alert("E-posta veya şifre hatalı!")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (registerData.password !== registerData.confirmPassword) {
      alert("Şifreler eşleşmiyor!")
      return
    }

    if (registerData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!")
      return
    }

    const users = storage.getUsers()
    const existingUser = users.find((u) => u.email === registerData.email)

    if (existingUser) {
      alert("Bu e-posta adresi zaten kayıtlı!")
      return
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      createdAt: new Date().toISOString(),
      favorites: [],
    }

    storage.setUsers([...users, newUser])
    storage.setCurrentUser(newUser)
    alert("Kayıt başarılı!")
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Giriş Yap</TabsTrigger>
            <TabsTrigger value="register">Kayıt Ol</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Giriş Yap</CardTitle>
                <CardDescription>Hesabınıza giriş yapın</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-posta</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Şifre</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Giriş Yap
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Kayıt Ol</CardTitle>
                <CardDescription>Yeni hesap oluşturun</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Ad Soyad</Label>
                    <Input
                      id="register-name"
                      placeholder="Adınız Soyadınız"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-posta</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Telefon</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="0532 123 45 67"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Şifre</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Şifre Tekrar</Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Kayıt Ol
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
