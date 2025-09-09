"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { type Locale, getTranslation } from "../lib/translations"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "lng"
const SUPPORTED = ["en", "nl", "de", "fr", "it", "es", "cn"] as const
type SupportedLocale = (typeof SUPPORTED)[number]

function isSupportedLocale(v: unknown): v is SupportedLocale {
  return typeof v === "string" && (SUPPORTED as readonly string[]).includes(v)
}

function readInitialLocale(): SupportedLocale {
  if (typeof window !== "undefined") {
    // 1) URL ?lng=xx wins
    const urlLng = new URLSearchParams(window.location.search).get("lng")
    if (isSupportedLocale(urlLng)) return urlLng

    // 2) localStorage
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isSupportedLocale(stored)) return stored

    // 3) cookie
    const m = document.cookie.match(/(?:^|;\s*)lng=([^;]+)/)
    if (m && isSupportedLocale(m[1])) return m[1]
  }
  // 4) fallback
  return "en"
}

/** Global snapshot so plain TS utilities (outside React) can read the language. */
let currentLang: SupportedLocale = readInitialLocale()

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, _setLocale] = useState<SupportedLocale>(readInitialLocale)

  // Persist + cookie + <html lang> + sync snapshot
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch { }

    try {
      // Add Secure when on HTTPS
      const secure =
        typeof location !== "undefined" && location.protocol === "https:"
          ? "; Secure"
          : ""
      document.cookie = `lng=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`
    } catch { }

    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }

    currentLang = locale
  }, [locale])

  const setLocale = (lng: SupportedLocale) => {
    _setLocale(lng)
  }

  const t = useMemo(() => (key: string) => getTranslation(locale, key), [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Use inside React components */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

/** Safe to call from plain TS utilities (outside React). */
export function getCurrentLanguage(): SupportedLocale {
  // Prefer <html lang="..."> to stay in sync during SPA navigation
  if (typeof document !== "undefined") {
    const htmlLang = document.documentElement.lang
    if (isSupportedLocale(htmlLang)) return htmlLang
  }

  // Fallbacks if needed
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isSupportedLocale(stored)) return stored

    const m = document.cookie.match(/(?:^|;\s*)lng=([^;]+)/)
    if (m && isSupportedLocale(m[1])) return m[1]
  }

  return currentLang || "en"
}
