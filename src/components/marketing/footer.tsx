"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Phone, Mail, MapPin, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
    { label: "Download Apps", href: "/downloads" },
  ],
  company: [
    { label: "Start My Business Home", href: "https://startmybusiness.us", external: true },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Status", href: "/status" },
    { label: "API Docs", href: "/docs" },
    { label: "System Requirements", href: "/requirements" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="container-wide py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2">
                Ready to get started?
              </h3>
              <p className="text-white/70">
                Get your business phone in 5 minutes. Just $7.95/month.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="btn-primary text-lg h-14 px-8 gap-2 group"
            >
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Logo and contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo size="md" className="mb-6" />
            <p className="text-white/70 mb-6 max-w-sm">
              Professional business phone systems for small businesses. Simple,
              affordable, and powered by AI.
            </p>

            <div className="space-y-3">
              <a
                href="tel:888-534-4145"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="h-5 w-5 text-[#C9A227]" />
                888-534-4145
              </a>
              <a
                href="mailto:support@startmybusiness.us"
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 text-[#C9A227]" />
                support@startmybusiness.us
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-5 w-5 text-[#C9A227]" />
                United States
              </div>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-[#C9A227] hover:text-[#DEB44A] transition-colors font-medium"
                    >
                      <Home className="h-4 w-4" />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold mb-1">Stay up to date</h4>
              <p className="text-white/70 text-sm">
                Get tips and updates for your business phone.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full md:w-64"
              />
              <Button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Start My Business Inc. All rights
            reserved.
          </p>
          <p className="text-white/50 text-sm">
            Powered by SMB Voice
          </p>
        </div>
      </div>
    </footer>
  );
}
