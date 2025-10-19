import type { Listing, User } from "./types"

export const storage = {
  // Listings
  getListings: (): Listing[] => {
    if (typeof window === "undefined") return []
    const listings = localStorage.getItem("listings")
    return listings ? JSON.parse(listings) : []
  },

  setListings: (listings: Listing[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("listings", JSON.stringify(listings))
  },

  // Users
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  },

  setUsers: (users: User[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("users", JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  },

  setCurrentUser: (user: User | null) => {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  },

  logout: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("currentUser")
  },
}
