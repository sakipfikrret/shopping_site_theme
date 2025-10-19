"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, getTranslation } from "./i18n"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocaleState(savedLocale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Locale
      if (["en", "tr", "es", "fr", "de"].includes(browserLang)) {
        setLocaleState(browserLang)
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)
  }

  const t = (key: string) => getTranslation(locale, key)

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
