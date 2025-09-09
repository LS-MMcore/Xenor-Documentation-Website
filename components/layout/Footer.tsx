"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Copyright Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-sm text-gray-600 font-medium">
              &copy; {new Date().getFullYear()} Xenor B.V. {t("footer.allRightsReserved")}
            </p>

            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500">{t("footer.poweredBy")}</span>
              <Link
                href="https://lupora-solutions.com"
                className="text-xs font-semibold text-[#be1717] hover:text-[#004480] transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lupora Solutions
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-6">
            <Link
              href="https://www.xenor-logistics.com/terms-and-conditions-xenor/"
              className="text-sm text-gray-600 hover:text-[#be1717] hover:underline underline-offset-4 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer.termsOfService")}
            </Link>
            <Link
              href="https://www.xenor-logistics.com/privacy-statement/"
              className="text-sm text-gray-600 hover:text-[#be1717] hover:underline underline-offset-4 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer.privacyPolicy")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
