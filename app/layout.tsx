import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeInjector } from '@/components/theme-injector'
import { DynamicHead } from '@/components/dynamic-head'
import { StealingPrevention } from '@/components/stealing-prevention'
import { UIStyleInjector } from '@/components/ui-style-injector'
import { GlobalBackground } from '@/components/global-background'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Portfolio | Full-Stack Developer',
  description: 'Creative developer crafting digital experiences with cutting-edge technology. View my projects, skills, and get in touch.',
  keywords: ['developer', 'portfolio', 'full-stack', 'web development', 'react', 'next.js'],
  authors: [{ name: 'Developer' }],
  creator: 'Developer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Portfolio | Full-Stack Developer',
    description: 'Creative developer crafting digital experiences with cutting-edge technology.',
    siteName: 'Developer Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Full-Stack Developer',
    description: 'Creative developer crafting digital experiences with cutting-edge technology.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#05070A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeInjector />
        <UIStyleInjector />
        <DynamicHead />
        <StealingPrevention />
        <GlobalBackground />
        <SiteHeader />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
