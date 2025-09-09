"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  Code,
  Zap,
  Shield,
  Database,
  Globe,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useLanguage } from "@/contexts/LanguageContext"

const changelogEntries = [
  {
    version: "1.90",
    date: "06-08-2025",
    type: "major",
    title: "Tracking API Major Update",
    changes: [
      {
        type: "feature",
        title: "Separation of Waybill and Parcel Tracking",
        description:
          "Waybill tracking and parcel tracking have been separated. To enable waybill tracking, a new parameter has been introduced: flight_tracking_setting – accepts values: only, include, or exclude. By default, this setting is exclude.",
        icon: Package,
      },
      {
        type: "breaking",
        title: "Result Format Simplification",
        description:
          "The result structure has been cleaned up. The following fields have been deprecated: Statussen, statussen, errors, LastStatus, CarrierInformation, carrierInformation, Items -> label. Refer to the updated result format in the API documentation.",
        icon: AlertCircle,
      },
      {
        type: "feature",
        title: "Language Support",
        description:
          "Language selection has been added. Supported languages are: NL (Dutch) and EN (English). Usage example: ?lang=en",
        icon: Globe,
      },
      {
        type: "feature",
        title: "Bulk Barcode Support",
        description:
          'Bulk tracking by barcode is now supported, with a limit of 1000 barcodes per request. Example format: ["Barcode1", "Barcode2"]',
        icon: Database,
      },
      {
        type: "improvement",
        title: "Improved Error Handling",
        description:
          'When a barcode does not exist, it will be listed under the new notFound array: "notFound": ["NonExistentBarcode"]. In bulk requests, all invalid barcodes will appear here, and valid ones will return as usual.',
        icon: Shield,
      },
      {
        type: "feature",
        title: "Status Ordering and Item Numbering",
        description:
          "The items array has been reordered so that the newest status appears first. A new field, itemNumber, has been added to allow easy reversal if needed.",
        icon: CheckCircle,
      },
      {
        type: "improvement",
        title: "Standardized Headers",
        description: "The response header is now set to: Content-Type: application/json; charset=utf-8",
        icon: Code,
      },
      {
        type: "feature",
        title: "Tracking Type Definition",
        description:
          "Tracking can now be done by: waybill (only one allowed per request), box (up to 10 allowed per request), barcode (default if no type is specified, up to 1000 allowed per request). Note: This applies only if customs data has been uploaded. Use the parameter ?type=waybill, box, or barcode.",
        icon: Package,
      },
      {
        type: "feature",
        title: "Flexible Tracking Details",
        description:
          "A new parameter tracking_details has been added. It allows control over the level of returned data: minimal, lastStatus, full.",
        icon: Zap,
      },
    ],
  },
]

const getChangeTypeColor = (type: string) => {
  switch (type) {
    case "feature":
      return "#10b981"
    case "breaking":
      return "#ef4444"
    case "improvement":
      return "#3b82f6"
    case "fix":
      return "#f59e0b"
    default:
      return "#6b7280"
  }
}

const getChangeTypeLabel = (type: string) => {
  switch (type) {
    case "feature":
      return "New Feature"
    case "breaking":
      return "Breaking Change"
    case "improvement":
      return "Improvement"
    case "fix":
      return "Bug Fix"
    default:
      return "Change"
  }
}

export default function ChangelogPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div style={{ paddingTop: "50px" }}>
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#be1717]/10 via-[#be1717]/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full" style={{ backgroundColor: "#be171720" }}>
                  <Calendar className="h-8 w-8" style={{ color: "#be1717" }} />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl" style={{ color: "#be1717" }}>
                {t("apiDocs.changelog")}
              </h1>
              <p className="mx-auto max-w-[800px] text-slate-700 text-lg md:text-xl">
                {t("apiDocs.changelogSubtitle")}
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  asChild
                  className="mt-4 bg-transparent"
                  style={{ borderColor: "#be1717", color: "#be1717" }}
                >
                  <Link href="/api-docs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("apiDocs.backToDocumentation")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog Entries */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {changelogEntries.map((entry, idx) => (
                <Card key={idx} className="border-[#be1717]/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="default"
                          className="text-white text-lg px-3 py-1"
                          style={{ backgroundColor: "#be1717" }}
                        >
                          v{entry.version}
                        </Badge>
                        <Badge
                          variant={entry.type === "major" ? "destructive" : "secondary"}
                          className={entry.type === "major" ? "bg-orange-100 text-orange-800" : ""}
                        >
                          {entry.type === "major" ? "Major Update" : "Minor Update"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{entry.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-slate-800">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {entry.changes.map((change, cidx) => {
                        const IconComponent = change.icon
                        return (
                          <div key={cidx} className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${getChangeTypeColor(change.type)}20` }}
                              >
                                <IconComponent className="h-5 w-5" style={{ color: getChangeTypeColor(change.type) }} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-slate-800">{change.title}</h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                  style={{
                                    borderColor: getChangeTypeColor(change.type),
                                    color: getChangeTypeColor(change.type),
                                  }}
                                >
                                  {getChangeTypeLabel(change.type)}
                                </Badge>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed">{change.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
