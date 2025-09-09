'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider
    attribute="class"         // use class strategy for Tailwind
    defaultTheme="light"      // force light as the default
    enableSystem={false}      // ignore OS preference
    disableTransitionOnChange // optional: avoid flicker
    {...props}>
    {children}
  </NextThemesProvider>
}
