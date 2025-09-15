"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Zap, Shield, BookOpen, ExternalLink, ChevronDown, ChevronRight, Contact } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useLanguage } from "@/contexts/LanguageContext"

// Types
type QueryParam = {
  name: string
  values: string
  default: string
  description: string
}

type ApiEndpoint = {
  method: "GET" | "POST"
  endpoint: string
  description: string
  parameters: string[]
  queryParams?: QueryParam[]
  response: string
  example: string
}

type FaqItem = { question: string; answer: string }

// Build endpoints with i18n strings
const buildApiEndpoints = (t: (k: string) => string): ApiEndpoint[] => [
  {
    method: "GET",
    endpoint: "/auth",
    description: t("apiDocs.endpoints.auth.description"),
    parameters: ["AUTH_USER", "AUTH_PW"],
    response: "authentication_status, permissions, rate_limits",
    example: `curl --location 'https://api.xenor.tech/auth' \\
--header 'AUTH_USER=YOUR_AUTH_USER' \\
--header 'AUTH_PW=YOUR_AUTH_PW'`,
  },
  {
    method: "GET",
    endpoint: "/get_tracking_information/APIKEY/tracking_code",
    description: t("apiDocs.endpoints.tracking.description"),
    parameters: ["APIKEY", "tracking_code", "flight_tracking_setting", "lang", "type", "tracking_details"],
    queryParams: [
      { name: "lang", values: "en, nl", default: "en", description: t("apiDocs.endpoints.tracking.query.lang") },
      {
        name: "flight_tracking_setting",
        values: "only, include, exclude",
        default: "exclude",
        description: t("apiDocs.endpoints.tracking.query.flightTrackingSetting"),
      },
      {
        name: "type",
        values: "barcode, waybill, box",
        default: "barcode",
        description: t("apiDocs.endpoints.tracking.query.type"),
      },
      {
        name: "tracking_details",
        values: "minimal, lastStatus, full",
        default: "full",
        description: t("apiDocs.endpoints.tracking.query.trackingDetails"),
      },
    ],
    response: "tracking_events, current_status, estimated_delivery, carrier_info, flight_tracking",
    example: `# Single tracking
curl --location 'https://api.xenor.tech/get_tracking_information/APIKEY/tracking_code?flight_tracking_setting=include&lang=en&type=barcode&tracking_details=full' \\
--data ''

# Bulk tracking
curl --location --request GET 'https://api.xenor.tech/get_tracking_information/APIKEY/tracking_code?flight_tracking_setting=include&lang=en&type=barcode&tracking_details=full' \\
--data '[
    "123456789",
    "987654321",
    "123498765",
    "567894321"
]'`,
  },
  {
    method: "POST",
    endpoint: "/action/APIKEY/101/",
    description: t("apiDocs.endpoints.action.description"),
    parameters: ["created_by", "carrier", "carrier_option", "weight", "dimensions", "recipient_info", "sender_info"],
    queryParams: [
      { name: "pl", values: "Y, N", default: "N", description: t("apiDocs.endpoints.action.query.pl") },
      { name: "dhlzpl", values: "Y, N", default: "N", description: t("apiDocs.endpoints.action.query.dhlzpl") },
      { name: "zpl", values: "Y, N", default: "N", description: t("apiDocs.endpoints.action.query.zpl") },
      { name: "o", values: "JSON", default: "", description: t("apiDocs.endpoints.action.query.o") },
      { name: "dl", values: "Y, N", default: "N", description: t("apiDocs.endpoints.action.query.dl") },
    ],
    response: "label_url, tracking_number, shipment_id, processing_status",
    example: `curl --location 'https://api.xenor.tech/action/APIKEY/101/?pl=Y&zpl=N&o=JSON' \\
--header 'Content-Type: application/json' \\
--data '{
    "created_by": "API_USER",
    "standard_email_to_sender": "sender@example.com",
    "standard_email_to_receiver": "receiver@example.com",
    "print_phone_number": "+31612345678",
    "carrier": 9999,
    "carrier_option": 0,
    "signature_required": false,
    "number_of_packages": 1,
    "weight": 0.12,
    "value": 22.99,
    "length": 1.0,
    "width": 2.0,
    "height": 3.0,
    "is_company": false,
    "company_name": "",
    "department": "",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    "content": "Electronics",
    "content_on_label": "",
    "street": "Test Street",
    "street2": "",
    "house_number": "123",
    "postal_code": "1012AB",
    "city": "Amsterdam",
    "country": "Netherlands",
    "phone_number": "+31612345678",
    "reference": "ORDER-001",
    "reference2": "",
    "vat_number": "",
    "return_label": false
}'`,
  },
  {
    method: "POST",
    endpoint: "/post_manifest_data/APIKEY",
    description: t("apiDocs.endpoints.postManifest.description"),
    parameters: ["waybill", "packageId", "parcelId", "recipient_info", "sender_info", "item_details", "ls (optional)"],
    queryParams: [
      {
        name: "ls",
        values: "Y, N",
        default: "N",
        description: t("apiDocs.endpoints.postManifest.query.ls"),
      },
    ],
    response: "upload_status, validation_errors, manifest_id",
    example: `curl --location 'https://api.xenor.tech/post_manifest_data/APIKEY?ls=Y' \\
--header 'Content-Type: application/json' \\
--data '[ ... ]'`,
  },
  {
    method: "POST",
    endpoint: "/lock_shipment/APIKEY",
    description: t("apiDocs.endpoints.lockShipment.description"),
    parameters: ["waybill", "APIKEY"],
    response: "lock_status, confirmation_message",
    example: `curl --location 'https://api.xenor.tech/lock_shipment/APIKEY' \\
--header 'Content-Type: application/json' \\
--data '{"waybill":"999-12345678"}'`,
  },
]

// Build status codes with i18n descriptions
const buildStatusCodes = (t: (k: string) => string) =>
  [
    "97", "98", "99", "200", "201", "202", "203", "204", "205", "207", "208", "209", "210", "211", "213", "214", "215", "216", "217", "218", "219",
    "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008",
    "3000", "3001", "3004", "3005", "3050",
    "5000", "5001", "5002", "5003", "5004",
    "7000", "7001", "7002", "7003", "7004",
    "8000", "8001", "8500",
    "9000", "9001", "9002", "9003", "9004", "9005", "9006",
    "9500", "9501", "9502", "9503", "9600",
  ].map((code) => ({ code, description: t(`apiDocs.statusCodeDescriptions.${code}`) }))

// --- FAQ helper ---
// Prefer an "items" array under apiDocs.faq.items; otherwise derive from the faq object; finally fall back to known keys.
const DEFAULT_FAQ_KEYS = ["shipping", "orderTracking", "returns", "orderChanges", "payment", "customerService"]

const buildFaqItems = (t: (k: string, opts?: any) => any): FaqItem[] => {
  // Try items array (i18next/next-intl with returnObjects)
  const itemsAttempt = (t as any)("apiDocs.faq.items", { returnObjects: true }) as any
  if (Array.isArray(itemsAttempt)) {
    return itemsAttempt
      .filter(Boolean)
      .map((it) => ({ question: String(it?.question ?? ""), answer: String(it?.answer ?? "") }))
      .filter((it) => it.question && it.answer)
  }

  // Try reading the whole faq object and pulling subkeys (ignoring title/subtitle)
  const faqObj = (t as any)("apiDocs.faq", { returnObjects: true }) as any
  if (faqObj && typeof faqObj === "object" && !Array.isArray(faqObj)) {
    const derived: FaqItem[] = []
    for (const key of Object.keys(faqObj)) {
      if (key === "title" || key === "subtitle") continue
      const maybe = faqObj[key]
      const question = typeof maybe?.question === "string" ? maybe.question : (t as any)(`apiDocs.faq.${key}.question`)
      const answer = typeof maybe?.answer === "string" ? maybe.answer : (t as any)(`apiDocs.faq.${key}.answer`)
      if (typeof question === "string" && typeof answer === "string" && question && answer) {
        derived.push({ question, answer })
      }
    }
    if (derived.length) return derived
  }

  // Final fallback: known keys (works with your current en.json)
  return DEFAULT_FAQ_KEYS.map((k) => ({
    question: t(`apiDocs.faq.${k}.question`),
    answer: t(`apiDocs.faq.${k}.answer`),
  }))
}

export default function ApiDocsPage() {
  const [expandedEndpoints, setExpandedEndpoints] = useState<number[]>([])
  const { t } = useLanguage()

  const apiEndpoints = useMemo(() => buildApiEndpoints(t), [t])
  const statusCodes = useMemo(() => buildStatusCodes(t), [t])
  const faqItems = useMemo(() => buildFaqItems(t as any), [t])

  const toggleEndpoint = (index: number) => {
    setExpandedEndpoints((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

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
                  <Code className="h-8 w-8" style={{ color: "#be1717" }} />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl" style={{ color: "#be1717" }}>
                {t("apiDocs.title")}
              </h1>
              <p className="mx-auto max-w-[800px] text-slate-700 text-lg md:text-xl">{t("apiDocs.subtitle")}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="default" className="text-sm" style={{ backgroundColor: "#be1717" }}>
                  {t("apiDocs.badges.restApi")}
                </Badge>
                <Badge variant="default" className="text-sm" style={{ backgroundColor: "#be1717" }}>
                  {t("apiDocs.badges.realTimeTracking")}
                </Badge>
                <Badge variant="default" className="text-sm" style={{ backgroundColor: "#be1717" }}>
                  {t("apiDocs.badges.manifestProcessing")}
                </Badge>
                <Badge variant="default" className="text-sm" style={{ backgroundColor: "#be1717" }}>
                  {t("apiDocs.badges.multiCarrier")}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-800">
                {t("apiDocs.quickStart")}
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-lg">{t("apiDocs.getUpAndRunning")}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto mb-12">
              <Card className="border-[#be1717]/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#be171720" }}>
                      <Key className="h-6 w-6" style={{ color: "#be1717" }} />
                    </div>
                    <CardTitle className="text-xl text-slate-800">1. {t("apiDocs.signUpForAccount")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{t("apiDocs.includeAuthUser")}</p>
                </CardContent>
              </Card>

              <Card className="border-[#be1717]/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#be171720" }}>
                      <BookOpen className="h-6 w-6" style={{ color: "#be1717" }} />
                    </div>
                    <CardTitle className="text-xl text-slate-800">2. {t("apiDocs.verifyCredentials")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{t("apiDocs.verifyCredentials")}</p>
                </CardContent>
              </Card>

              <Card className="border-[#be1717]/30">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: "#be171720" }}>
                      <Zap className="h-6 w-6" style={{ color: "#be1717" }} />
                    </div>
                    <CardTitle className="text-xl text-slate-800">3. {t("apiDocs.startProcessing")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{t("apiDocs.startProcessing")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Code Example */}
            <Card className="max-w-4xl mx-auto bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-white">{t("apiDocs.exampleAuthentication")}</CardTitle>
                <CardDescription className="text-slate-300">{t("apiDocs.basicExample")}</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm overflow-x-auto">
                  <code>{`// First, authenticate your credentials
curl --location 'https://api.xenor.tech/auth' \\
--header 'AUTH_USER=YOUR_AUTH_USER' \\
--header 'AUTH_PW=YOUR_AUTH_PW'
`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* API Reference */}
        <section className="w-full py-12 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-800">
                {t("apiDocs.endpointsTitle")}
              </h2>

              <p className="mx-auto max-w-[700px] text-slate-600 md:text-lg">{t("apiDocs.completeReference")}</p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
              {apiEndpoints.map((endpoint, idx) => {
                const isExpanded = expandedEndpoints.includes(idx)
                return (
                  <Card key={idx} className="border-[#be1717]/30">
                    <CardHeader
                      className="cursor-pointer hover:bg-slate-50/50 transition-colors"
                      onClick={() => toggleEndpoint(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-3">
                          <Badge
                            variant={endpoint.method === "GET" ? "secondary" : "default"}
                            className={endpoint.method === "GET" ? "bg-green-100 text-green-800" : "text-white"}
                            style={endpoint.method !== "GET" ? { backgroundColor: "#be1717" } : {}}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.endpoint}</code>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">{t("apiDocs.parameters")}</h4>
                            <div className="flex flex-wrap gap-2">
                              {endpoint.parameters.map((param, pidx) => (
                                <code key={pidx} className="bg-slate-100 px-2 py-1 rounded text-sm">
                                  {param}
                                </code>
                              ))}
                            </div>
                          </div>

                          {endpoint.queryParams && (
                            <div>
                              <h4 className="font-semibold text-sm text-slate-800 mb-2">
                                {t("apiDocs.queryParameters")}
                              </h4>
                              <div className="space-y-2">
                                {endpoint.queryParams.map((param, pidx) => (
                                  <div key={pidx} className="bg-slate-50 p-3 rounded border">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">
                                        {param.name}
                                      </code>
                                      <span className="text-xs text-slate-500">
                                        {t("apiDocs.default")}: {param.default}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-1">{param.description}</p>
                                    <p className="text-xs text-slate-500">
                                      {t("apiDocs.values")}: {param.values}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">{t("apiDocs.response")}</h4>
                            <p className="text-sm text-slate-600">{endpoint.response}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">{t("apiDocs.example")}</h4>
                            <div className="bg-slate-900 text-white p-3 rounded-lg overflow-x-auto">
                              <pre className="text-xs">
                                <code>{endpoint.example}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Status Codes */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-800">
                {t("apiDocs.statusCodes")}
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-lg">{t("apiDocs.completeReference")}</p>
            </div>

            <Card className="max-w-6xl mx-auto border-[#be1717]/30">
              <CardHeader>
                <CardTitle className="text-slate-800">{t("apiDocs.statusCodes")}</CardTitle>
                <CardDescription>{t("apiDocs.statusCodesIntro")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {statusCodes.map((status, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded border-l-4"
                      style={{ borderLeftColor: "#be1717" }}
                    >
                      <code className="font-mono text-sm font-semibold" style={{ color: "#be1717" }}>
                        {status.code}
                      </code>
                      <span className="text-sm text-slate-700 flex-1 ml-4">{status.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Authentication */}
        <section className="w-full py-12 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-800">
                {t("apiDocs.authentication")}
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-600 md:text-lg">{t("apiDocs.secureYourApi")}</p>
            </div>

            <Card className="max-w-4xl mx-auto border-[#be1717]/30">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6" style={{ color: "#be1717" }} />
                  <span className="text-slate-800">{t("apiDocs.headerAuthentication")}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 text-white p-4 rounded-lg">
                  <pre className="text-sm">
                    <code>{`# Authentication endpoint
curl --location 'https://api.xenor.tech/auth' \\
--header 'AUTH_USER=YOUR_AUTH_USER' \\
--header 'AUTH_PW=YOUR_AUTH_PW'

# Other endpoints use API key in URL path
curl --location 'https://api.xenor.tech/post_manifest_data/YOUR_API_KEY' \\
--header 'Content-Type: application/json' \\
--data '[{"waybill": "999-12345678", ...}]'`}</code>
                  </pre>
                </div>
                <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#be171710" }}>
                  <p className="text-sm" style={{ color: "#be1717" }}>
                    <strong>{t("apiDocs.securityNote")}:</strong> {t("apiDocs.keepCredentialsSecure")}{" "}
                    {t("apiDocs.neverExpose")} {t("apiDocs.useEnvironmentVariables")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Resources */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl" style={{ color: "#be1717" }}>
                {t("apiDocs.additionalResources")}
              </h2>
              <p className="text-slate-700 md:text-lg">{t("apiDocs.everythingYouNeed")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="text-white" style={{ backgroundColor: "#be1717" }}>
                  <Link href="https://documenter.getpostman.com/view/32448221/2sB3HqHJHp" target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("apiDocs.postmanCollection")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="bg-transparent hover:text-white"
                  style={{ borderColor: "#be1717", color: "#be1717" }}
                >
                  <Link href="mailto:info@Xenor.com">{t("apiDocs.getSupport")}</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="bg-transparent hover:text-white"
                  style={{ borderColor: "#be1717", color: "#be1717" }}
                >
                  <Link href="/changelog">{t("apiDocs.changelog")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
