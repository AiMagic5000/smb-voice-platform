import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import { IOSInstallPrompt } from "@/components/pwa/ios-install-prompt";
import "./globals.css";

// Check if Clerk is properly configured
const isClerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SMB Voice - Professional Business Phone | $7.95/month",
    template: "%s | SMB Voice",
  },
  description:
    "Get a professional business phone number, AI receptionist, and mobile apps for just $7.95/month. Set up in 5 minutes. No contracts, no hidden fees.",
  keywords: [
    "business phone",
    "voip",
    "virtual phone number",
    "toll free number",
    "small business phone",
    "ai receptionist",
    "cloud phone system",
    "business communications",
    "cheap business phone",
    "phone service for business",
  ],
  authors: [{ name: "Start My Business Inc." }],
  creator: "Start My Business Inc.",
  publisher: "Start My Business Inc.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://voice.startmybusiness.us"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SMB Voice",
    title: "SMB Voice - Professional Business Phone | $7.95/month",
    description:
      "Get a professional business phone number, AI receptionist, and mobile apps for just $7.95/month. Set up in 5 minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SMB Voice - Business Phone System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMB Voice - Professional Business Phone | $7.95/month",
    description:
      "Professional business phone for just $7.95/month. AI receptionist included.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "ai-content-declaration": "human-created",
  },
};

// Clerk appearance configuration
const clerkAppearance = {
  variables: {
    colorPrimary: "#C9A227",
    colorText: "#1E3A5F",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#F9FAFB",
    colorInputText: "#1E3A5F",
    borderRadius: "0.75rem",
  },
  elements: {
    formButtonPrimary:
      "bg-[#C9A227] hover:bg-[#DEB44A] text-white font-semibold shadow-lg",
    card: "shadow-2xl border border-gray-100 rounded-2xl",
    headerTitle: "text-[#1E3A5F] font-bold text-2xl",
    headerSubtitle: "text-gray-600",
    socialButtonsBlockButton:
      "border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl",
    formFieldLabel: "text-gray-700 font-medium",
    formFieldInput:
      "border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227] rounded-xl",
    footerActionLink: "text-[#C9A227] hover:text-[#DEB44A] font-medium",
    identityPreviewEditButton: "text-[#C9A227]",
    formButtonReset: "text-[#C9A227] hover:text-[#DEB44A]",
  },
};

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#C9A227" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SMB Voice" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SMB Voice" />
        <meta name="msapplication-TileColor" content="#1E3A5F" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/splash/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-1242x2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/splash-828x1792.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('smb-voice-theme') || 'system';
                const resolved = theme === 'system'
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : theme;
                document.documentElement.classList.add(resolved);
                document.documentElement.style.colorScheme = resolved;
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ServiceWorkerRegister />
        <ThemeProvider defaultTheme="system">
          {children}
          <IOSInstallPrompt />
        </ThemeProvider>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // If Clerk is not configured, render without ClerkProvider
  if (!isClerkConfigured) {
    return <AppContent>{children}</AppContent>;
  }

  return (
    <ClerkProvider appearance={clerkAppearance}>
      <AppContent>{children}</AppContent>
    </ClerkProvider>
  );
}
