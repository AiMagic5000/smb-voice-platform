"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80">
              Last updated: January 14, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-white">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg max-w-none"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#C9A227] hover:underline mb-8 no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <h2>Introduction</h2>
            <p>
              Start My Business Inc. (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects
              your privacy and is committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use SMB Voice services.
            </p>

            <h2>Information We Collect</h2>

            <h3>Information You Provide</h3>
            <ul>
              <li>Account information (name, email, phone number, business name)</li>
              <li>Billing information (payment card details, billing address)</li>
              <li>Communications with our support team</li>
              <li>AI receptionist configurations and greetings</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li>Call logs (phone numbers, duration, timestamps)</li>
              <li>Voicemail recordings and transcriptions</li>
              <li>Call recordings (when enabled by you)</li>
              <li>Device information and IP addresses</li>
              <li>Usage data and analytics</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our phone services</li>
              <li>Process payments and manage your account</li>
              <li>Send service-related communications</li>
              <li>Improve our products and services</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2>Call Recording and Voicemail</h2>
            <p>
              <strong>Call Recording:</strong> If you enable call recording, recordings
              are stored securely and accessible only to your organization. You are
              responsible for complying with applicable call recording laws, including
              obtaining necessary consent from call participants.
            </p>
            <p>
              <strong>Voicemail:</strong> Voicemails are automatically transcribed using
              AI technology. Both audio recordings and transcriptions are stored securely
              and accessible only to your organization.
            </p>

            <h2>Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>
                <strong>Service Providers:</strong> Third parties that help us operate
                our services (e.g., SignalWire for telephony, Clerk for authentication)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order,
                or government request
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger,
                acquisition, or sale of assets
              </li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data,
              including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Secure data centers with physical security controls</li>
              <li>Regular security audits and penetration testing</li>
              <li>Employee training on data protection</li>
              <li>Access controls and authentication requirements</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed
              to provide services. Call logs and voicemails are retained for 90 days
              by default. You may request deletion of your data at any time.
            </p>

            <h2>Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict processing of your data</li>
            </ul>
            <p>
              To exercise these rights, contact us at support@startmybusiness.us or
              call 888-534-4145.
            </p>

            <h2>California Privacy Rights (CCPA)</h2>
            <p>
              California residents have additional rights under the California Consumer
              Privacy Act, including the right to know what personal information is
              collected, the right to delete personal information, and the right to
              opt out of the sale of personal information.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do
              not knowingly collect personal information from children under 13. If we
              learn we have collected such information, we will delete it promptly.
            </p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other
              than your own. We ensure appropriate safeguards are in place for such
              transfers in compliance with applicable data protection laws.
            </p>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve your experience,
              analyze usage, and personalize content. You can control cookie preferences
              through your browser settings.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you
              of material changes via email or through our website. Your continued use
              of our services after changes constitutes acceptance of the updated policy.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices,
              please contact us:
            </p>
            <ul>
              <li>Phone: 888-534-4145</li>
              <li>Email: privacy@startmybusiness.us</li>
              <li>Website: voice.startmybusiness.us</li>
            </ul>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-0">
                This Privacy Policy is provided in plain language to help you understand
                how we handle your data. We are committed to transparency and protecting
                your privacy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
