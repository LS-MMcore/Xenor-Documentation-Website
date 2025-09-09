"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Locale } from "@/lib/translations"

const languages = [
  { code: "en" as Locale, name: "English", flag: "🇺🇸" },
  { code: "nl" as Locale, name: "Nederlands", flag: "🇳🇱" },
  { code: "de" as Locale, name: "Deutsch", flag: "🇩🇪" },
  { code: "fr" as Locale, name: "Français", flag: "🇫🇷" },
  { code: "it" as Locale, name: "Italiano", flag: "🇮🇹" },
  { code: "es" as Locale, name: "Español", flag: "🇪🇸" },
  { code: "cn" as Locale, name: "中文", flag: "🇨🇳" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { locale, setLocale, t } = useLanguage()

  const handleLanguageChange = (langCode: Locale) => {
    setLocale(langCode)
  }

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0]

  const isActive = (path: string) => {
    if (path.startsWith("/#")) {
      if (typeof window !== "undefined") {
        return window.location.hash === path.slice(1)
      }
      return false
    }
    return pathname === path
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-card border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center py-2">
          <Link href="/">
            <Image
              src="./xenor.png"
              alt="Company Logo"
              width={150}
              height={60}
              priority
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 h-full">

        </div>

        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent touch-manipulation min-h-[44px] px-3"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline md:hidden lg:inline">
                  {currentLanguage.name}
                </span>
                <span className="sm:hidden md:inline lg:hidden">
                  {currentLanguage.flag}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="gap-2 touch-manipulation"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-lg animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1">

          </div>
        </div>
      )}
    </header>
  )
}
