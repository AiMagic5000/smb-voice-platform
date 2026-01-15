"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              Terms of Service
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

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using SMB Voice services provided by Start My Business Inc.
              (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these
              Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do
              not use our services.
            </p>

            <h2>2. Description of Services</h2>
            <p>
              SMB Voice provides cloud-based business phone services including but not
              limited to:
            </p>
            <ul>
              <li>Virtual phone numbers (local and toll-free)</li>
              <li>AI-powered receptionist services</li>
              <li>Voicemail with transcription</li>
              <li>Call forwarding and routing</li>
              <li>Mobile and desktop applications</li>
              <li>Call recording (where legally permitted)</li>
            </ul>

            <h2>3. Account Registration</h2>
            <p>
              To use our services, you must create an account and provide accurate,
              complete information. You are responsible for maintaining the security
              of your account credentials and for all activities under your account.
            </p>

            <h2>4. Pricing and Payment</h2>
            <p>
              Our basic plan is $7.95 per month, which includes 500 minutes of calling
              time. Additional minutes are billed at $0.02 per minute. All fees are
              non-refundable unless otherwise required by law.
            </p>
            <p>
              We reserve the right to change pricing with 30 days&apos; notice. Continued
              use of services after price changes constitutes acceptance.
            </p>

            <h2>5. Acceptable Use Policy</h2>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Make harassing, threatening, or fraudulent calls</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit spam, unsolicited marketing, or robocalls</li>
              <li>Interfere with or disrupt our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for illegal telemarketing</li>
            </ul>

            <h2>6. Service Availability</h2>
            <p>
              We strive for 99.9% uptime but do not guarantee uninterrupted service.
              We are not liable for service interruptions due to maintenance, technical
              issues, or circumstances beyond our control.
            </p>

            <h2>7. Emergency Services (911)</h2>
            <p>
              <strong>IMPORTANT:</strong> SMB Voice is not a replacement for traditional
              phone service for emergency calls. Our VoIP service may not support or
              properly route 911 emergency calls. You should maintain an alternative
              means of accessing emergency services.
            </p>

            <h2>8. Number Portability</h2>
            <p>
              We support number porting in accordance with FCC regulations. Porting
              requests typically take 7-14 business days to complete. You are responsible
              for any early termination fees from your previous carrier.
            </p>

            <h2>9. Termination</h2>
            <p>
              Either party may terminate this agreement at any time. You may cancel
              your subscription through your account dashboard. Upon termination, your
              access to services will end, and phone numbers may be released.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMB VOICE AND START MY BUSINESS INC.
              SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
              OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OUR SERVICES.
            </p>

            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Start My Business Inc., its
              officers, directors, employees, and agents from any claims, damages, or
              expenses arising from your use of our services or violation of these Terms.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify users of material
              changes via email or through our website. Continued use of services after
              changes constitutes acceptance of the new Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Texas, United States,
              without regard to conflict of law principles.
            </p>

            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us:
            </p>
            <ul>
              <li>Phone: 888-534-4145</li>
              <li>Email: support@startmybusiness.us</li>
              <li>Website: voice.startmybusiness.us</li>
            </ul>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-0">
                By using SMB Voice, you acknowledge that you have read, understood, and
                agree to be bound by these Terms of Service.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
