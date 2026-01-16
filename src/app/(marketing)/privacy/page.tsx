"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  MapPin
} from "lucide-react";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-collected", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "information-sharing", title: "5. Information Sharing & Disclosure" },
  { id: "data-security", title: "6. Data Security" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "your-rights", title: "8. Your Privacy Rights" },
  { id: "ccpa", title: "9. California Privacy Rights (CCPA/CPRA)" },
  { id: "state-privacy", title: "10. Additional State Privacy Rights" },
  { id: "call-recording", title: "11. Call Recording & Voicemail" },
  { id: "cpni", title: "12. CPNI (Telecommunications)" },
  { id: "children", title: "13. Children's Privacy" },
  { id: "international", title: "14. International Data Transfers" },
  { id: "cookies", title: "15. Cookies & Tracking Technologies" },
  { id: "third-party", title: "16. Third-Party Services" },
  { id: "changes", title: "17. Changes to This Policy" },
  { id: "contact", title: "18. Contact Us" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(true);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section bg-gradient-to-br from-[#1E3A5F] via-[#2D4A6F] to-[#1E3A5F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container-narrow text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4 text-[#C9A227]" />
              <span className="text-sm font-medium">Privacy Protection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              How we collect, use, protect, and share your information in compliance with all applicable privacy laws
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/60">
              <span>Effective Date: January 15, 2026</span>
              <span className="hidden sm:inline">|</span>
              <span>Version 2.0</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Bar */}
      <section className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-narrow py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#1E3A5F] hover:text-[#C9A227] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/terms" className="text-gray-600 hover:text-[#C9A227]">Terms of Service</Link>
              <Link href="/sms-terms" className="text-gray-600 hover:text-[#C9A227]">SMS Terms</Link>
              <button
                onClick={() => window.print()}
                className="text-gray-600 hover:text-[#C9A227]"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-narrow py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-32">
              <button
                onClick={() => setShowToc(!showToc)}
                className="flex items-center justify-between w-full lg:hidden mb-4 p-3 bg-gray-100 rounded-lg"
              >
                <span className="font-semibold text-gray-900">Table of Contents</span>
                {showToc ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              <nav className={`${showToc ? 'block' : 'hidden'} lg:block bg-gray-50 rounded-xl p-4`}>
                <h3 className="font-semibold text-gray-900 mb-3 hidden lg:block">Contents</h3>
                <ul className="space-y-1 text-sm max-h-[60vh] overflow-y-auto">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`block py-1.5 px-2 rounded transition-colors ${
                          activeSection === section.id
                            ? "bg-[#C9A227]/10 text-[#C9A227] font-medium"
                            : "text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-100"
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Privacy Highlights Card */}
              <div className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Privacy Highlights
                </h4>
                <ul className="text-xs text-green-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    We never sell your personal data
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    End-to-end encryption for calls
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    You control your data
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    CCPA/CPRA compliant
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Privacy Commitment Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <Lock className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 text-lg mb-2">Our Privacy Commitment</h3>
                  <p className="text-green-800 text-sm">
                    At SMB Voice, we believe privacy is a fundamental right. We are committed to being transparent
                    about how we collect and use your data. We never sell your personal information to third parties,
                    and we implement industry-leading security measures to protect your data.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
              <section id="introduction">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">1</span>
                  Introduction
                </h2>
                <p>
                  Start My Business Inc., doing business as SMB Voice (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                  is committed to protecting your privacy and personal information. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our cloud-based
                  telecommunications services, website, mobile applications, and related services (collectively, the &ldquo;Services&rdquo;).
                </p>
                <p>
                  This Privacy Policy applies to all users of our Services, including customers, prospective customers,
                  website visitors, and anyone who interacts with our platform. Please read this policy carefully to
                  understand our practices regarding your personal information.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                  <p className="text-sm text-blue-800 mb-0">
                    <strong>Scope:</strong> This policy covers all personal information collected through our website
                    (voice.startmybusiness.us), mobile apps, desktop applications, API integrations, and any other
                    means through which you interact with SMB Voice.
                  </p>
                </div>
              </section>

              <section id="information-collected">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">2</span>
                  Information We Collect
                </h2>

                <h3 className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#C9A227]" />
                  2.1 Information You Provide Directly
                </h3>
                <ul>
                  <li><strong>Account Information:</strong> Name, email address, phone number, business name, job title, and mailing address</li>
                  <li><strong>Billing Information:</strong> Payment card details, billing address, tax identification numbers (processed securely through Gumroad)</li>
                  <li><strong>Profile Information:</strong> Username, password, profile picture, and account preferences</li>
                  <li><strong>Communication Content:</strong> Voicemail recordings, voicemail transcriptions, SMS messages, and call recordings (when enabled)</li>
                  <li><strong>AI Configuration:</strong> AI receptionist scripts, greetings, prompts, and customizations</li>
                  <li><strong>Support Requests:</strong> Information provided when contacting customer support</li>
                  <li><strong>Survey Responses:</strong> Feedback and responses to surveys or questionnaires</li>
                </ul>

                <h3 className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#C9A227]" />
                  2.2 Information Collected Automatically
                </h3>
                <ul>
                  <li><strong>Call Detail Records (CDRs):</strong> Phone numbers called, call duration, timestamps, call direction (inbound/outbound)</li>
                  <li><strong>Message Logs:</strong> SMS/MMS metadata, message timestamps, delivery status</li>
                  <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers</li>
                  <li><strong>Network Information:</strong> IP address, ISP, connection type, approximate location</li>
                  <li><strong>Usage Data:</strong> Features used, pages viewed, clicks, session duration, error logs</li>
                  <li><strong>Cookies and Tracking:</strong> Cookies, web beacons, pixels, and similar technologies</li>
                </ul>

                <h3 className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#C9A227]" />
                  2.3 Information from Third Parties
                </h3>
                <ul>
                  <li><strong>Authentication Providers:</strong> Information from single sign-on services (Clerk)</li>
                  <li><strong>Payment Processors:</strong> Transaction confirmations and payment status (from Gumroad)</li>
                  <li><strong>Telecommunications Partners:</strong> Number porting information, caller ID data</li>
                  <li><strong>Business Partners:</strong> Referral information from partners</li>
                  <li><strong>Public Sources:</strong> Publicly available business information</li>
                </ul>

                <div className="bg-gray-50 rounded-xl p-4 my-4 not-prose">
                  <h4 className="font-semibold text-gray-900 mb-2">Categories of Personal Information Collected</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Category</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-900">Examples</th>
                          <th className="px-3 py-2 text-center font-semibold text-gray-900">Collected</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Identifiers</td>
                          <td className="px-3 py-2 text-gray-700">Name, email, phone, IP address</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Commercial Information</td>
                          <td className="px-3 py-2 text-gray-700">Purchase history, subscription details</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Internet Activity</td>
                          <td className="px-3 py-2 text-gray-700">Browsing history, interactions</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Geolocation</td>
                          <td className="px-3 py-2 text-gray-700">Approximate location (IP-based)</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Audio/Visual</td>
                          <td className="px-3 py-2 text-gray-700">Call recordings, voicemails</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Professional Info</td>
                          <td className="px-3 py-2 text-gray-700">Business name, job title</td>
                          <td className="px-3 py-2 text-center text-green-600 font-medium">Yes</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-gray-900">Sensitive Personal Info</td>
                          <td className="px-3 py-2 text-gray-700">Social Security, health data</td>
                          <td className="px-3 py-2 text-center text-red-600 font-medium">No</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="how-we-use">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">3</span>
                  How We Use Your Information
                </h2>
                <p>We use your personal information for the following purposes:</p>

                <h3>3.1 Providing and Improving Services</h3>
                <ul>
                  <li>Creating and managing your account</li>
                  <li>Processing and completing phone calls and messages</li>
                  <li>Providing AI receptionist and voicemail services</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Providing customer support and responding to inquiries</li>
                  <li>Improving and optimizing our Services</li>
                  <li>Developing new features and functionality</li>
                </ul>

                <h3>3.2 Communications</h3>
                <ul>
                  <li>Sending service-related notifications and alerts</li>
                  <li>Providing billing statements and payment confirmations</li>
                  <li>Sending marketing communications (with your consent)</li>
                  <li>Responding to your requests and feedback</li>
                </ul>

                <h3>3.3 Legal and Compliance</h3>
                <ul>
                  <li>Complying with legal obligations and regulatory requirements</li>
                  <li>Responding to lawful requests from law enforcement</li>
                  <li>Enforcing our terms of service and policies</li>
                  <li>Protecting our rights, property, and safety</li>
                </ul>

                <h3>3.4 Security and Fraud Prevention</h3>
                <ul>
                  <li>Detecting, preventing, and investigating fraud</li>
                  <li>Monitoring for security threats and vulnerabilities</li>
                  <li>Protecting against unauthorized access</li>
                  <li>Ensuring platform integrity and availability</li>
                </ul>

                <h3>3.5 Analytics and Research</h3>
                <ul>
                  <li>Analyzing usage patterns and trends</li>
                  <li>Conducting research to improve our Services</li>
                  <li>Generating aggregated, anonymized statistics</li>
                  <li>Training and improving our AI systems</li>
                </ul>
              </section>

              <section id="legal-basis">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">4</span>
                  Legal Basis for Processing
                </h2>
                <p>We process your personal information based on the following legal grounds:</p>
                <ul>
                  <li><strong>Contract Performance:</strong> Processing necessary to provide Services you&apos;ve requested</li>
                  <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests (e.g., fraud prevention, security, service improvement)</li>
                  <li><strong>Legal Compliance:</strong> Processing required to comply with applicable laws and regulations</li>
                  <li><strong>Consent:</strong> Processing based on your explicit consent (e.g., marketing communications)</li>
                </ul>
              </section>

              <section id="information-sharing">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">5</span>
                  Information Sharing &amp; Disclosure
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                  <p className="text-green-800 text-sm mb-0 font-semibold">
                    We DO NOT sell your personal information to third parties. We never have and never will.
                  </p>
                </div>

                <p>We may share your information with the following categories of recipients:</p>

                <h3>5.1 Service Providers</h3>
                <ul>
                  <li><strong>SignalWire:</strong> Telephony infrastructure and VoIP services</li>
                  <li><strong>Clerk:</strong> Authentication and identity management</li>
                  <li><strong>Gumroad:</strong> Payment processing and subscription management</li>
                  <li><strong>Cloud Hosting:</strong> Server infrastructure and data storage</li>
                  <li><strong>Analytics Providers:</strong> Usage analytics and performance monitoring</li>
                </ul>

                <h3>5.2 Legal Requirements</h3>
                <p>We may disclose information when required by:</p>
                <ul>
                  <li>Court orders, subpoenas, or legal process</li>
                  <li>Law enforcement requests</li>
                  <li>Regulatory investigations</li>
                  <li>Protection of our legal rights</li>
                </ul>

                <h3>5.3 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred
                  as part of that transaction. We will provide notice before your information becomes subject
                  to a different privacy policy.
                </p>

                <h3>5.4 With Your Consent</h3>
                <p>We may share information with other third parties when you have given us explicit consent to do so.</p>
              </section>

              <section id="data-security">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">6</span>
                  Data Security
                </h2>
                <p>
                  We implement comprehensive security measures to protect your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[#C9A227]" />
                      Technical Safeguards
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>TLS 1.3 encryption for data in transit</li>
                      <li>AES-256 encryption for data at rest</li>
                      <li>End-to-end encryption for voice calls</li>
                      <li>Secure key management</li>
                      <li>Regular vulnerability assessments</li>
                      <li>Penetration testing</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#C9A227]" />
                      Organizational Measures
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Role-based access controls</li>
                      <li>Employee background checks</li>
                      <li>Security awareness training</li>
                      <li>Incident response procedures</li>
                      <li>Business continuity planning</li>
                      <li>Regular security audits</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <p className="text-amber-800 text-sm mb-0">
                    <strong>Security Incident Notification:</strong> In the event of a data breach affecting your
                    personal information, we will notify you and relevant authorities as required by applicable law.
                  </p>
                </div>
              </section>

              <section id="data-retention">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">7</span>
                  Data Retention
                </h2>
                <p>We retain your personal information for as long as necessary to:</p>
                <ul>
                  <li>Provide the Services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Fulfill legitimate business purposes</li>
                </ul>

                <h3>Specific Retention Periods:</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Data Type</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-2 text-gray-900">Account Information</td>
                        <td className="px-4 py-2 text-gray-700">Duration of account + 3 years</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">Call Detail Records</td>
                        <td className="px-4 py-2 text-gray-700">7 years (regulatory requirement)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-900">Voicemail Recordings</td>
                        <td className="px-4 py-2 text-gray-700">90 days (configurable)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">Call Recordings</td>
                        <td className="px-4 py-2 text-gray-700">90 days (configurable)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-900">Billing Records</td>
                        <td className="px-4 py-2 text-gray-700">7 years (tax requirements)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 text-gray-900">Usage Logs</td>
                        <td className="px-4 py-2 text-gray-700">2 years</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-900">Marketing Preferences</td>
                        <td className="px-4 py-2 text-gray-700">Until you opt out</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="your-rights">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">8</span>
                  Your Privacy Rights
                </h2>
                <p>
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#C9A227]" />
                      Right to Access
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request a copy of the personal information we hold about you.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#C9A227]" />
                      Right to Correction
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request correction of inaccurate or incomplete personal information.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#C9A227]" />
                      Right to Deletion
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request deletion of your personal information, subject to legal retention requirements.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Database className="h-4 w-4 text-[#C9A227]" />
                      Right to Portability
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request your data in a portable, machine-readable format.
                    </p>
                  </div>
                </div>

                <h3>How to Exercise Your Rights</h3>
                <p>To exercise any of these rights, you may:</p>
                <ul>
                  <li>Email us at privacy@startmybusiness.us</li>
                  <li>Call us at 888-534-4145</li>
                  <li>Submit a request through your account dashboard</li>
                  <li>Mail us at: Start My Business Inc., Attn: Privacy, Houston, TX 77002</li>
                </ul>
                <p>
                  We will respond to your request within 45 days. If we need more time, we will notify you
                  of the extension and the reasons for it.
                </p>
              </section>

              <section id="ccpa">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">9</span>
                  California Privacy Rights (CCPA/CPRA)
                </h2>
                <p>
                  If you are a California resident, you have additional rights under the California Consumer
                  Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):
                </p>

                <h3>9.1 Right to Know</h3>
                <p>You have the right to know:</p>
                <ul>
                  <li>What categories of personal information we collect</li>
                  <li>The sources from which we collect information</li>
                  <li>The business or commercial purposes for collection</li>
                  <li>Categories of third parties with whom we share information</li>
                  <li>The specific pieces of personal information we&apos;ve collected about you</li>
                </ul>

                <h3>9.2 Right to Delete</h3>
                <p>
                  You may request that we delete personal information we have collected from you, subject to
                  certain exceptions allowed by law.
                </p>

                <h3>9.3 Right to Correct</h3>
                <p>You may request that we correct inaccurate personal information we maintain about you.</p>

                <h3>9.4 Right to Opt-Out of Sale/Sharing</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                  <p className="text-green-800 text-sm mb-0">
                    <strong>We do not sell or share your personal information</strong> for cross-context behavioral
                    advertising as defined by the CCPA/CPRA. Therefore, there is no need to opt out.
                  </p>
                </div>

                <h3>9.5 Right to Limit Use of Sensitive Personal Information</h3>
                <p>We do not collect sensitive personal information as defined by the CPRA.</p>

                <h3>9.6 Non-Discrimination</h3>
                <p>
                  We will not discriminate against you for exercising any of your CCPA/CPRA rights. We will not:
                </p>
                <ul>
                  <li>Deny goods or services</li>
                  <li>Charge different prices or rates</li>
                  <li>Provide a different level of service quality</li>
                  <li>Suggest you will receive different treatment</li>
                </ul>

                <h3>9.7 Authorized Agent</h3>
                <p>
                  You may designate an authorized agent to submit requests on your behalf. The agent must
                  provide written authorization and we may require identity verification.
                </p>

                <h3>9.8 Shine the Light (Cal. Civ. Code § 1798.83)</h3>
                <p>
                  California residents may request information about disclosure of personal information to
                  third parties for direct marketing purposes. We do not share personal information with
                  third parties for their direct marketing purposes.
                </p>
              </section>

              <section id="state-privacy">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">10</span>
                  Additional State Privacy Rights
                </h2>
                <p>
                  Residents of certain states have additional privacy rights under their respective state laws:
                </p>

                <div className="space-y-4 my-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Virginia (VCDPA)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Virginia residents have rights to access, correct, delete, and obtain a copy of their
                      personal data, as well as opt out of targeted advertising, sale of personal data, and
                      profiling. You may appeal our decision by contacting privacy@startmybusiness.us.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      Colorado (CPA)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Colorado residents have similar rights including access, correction, deletion, data
                      portability, and the right to opt out of targeted advertising, sale, and profiling.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      Connecticut (CTDPA)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Connecticut residents have rights to access, correct, delete, obtain copies, and opt
                      out of targeted advertising, sale, and profiling.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      Utah (UCPA)
                    </h4>
                    <p className="text-sm text-gray-600">
                      Utah residents have rights to access, delete, obtain copies in portable format, and
                      opt out of targeted advertising and sale of personal data.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      Other States
                    </h4>
                    <p className="text-sm text-gray-600">
                      We monitor privacy legislation in all states and will comply with applicable requirements
                      as they become effective, including laws in Oregon, Texas, Montana, Delaware, Iowa,
                      Tennessee, Indiana, New Jersey, and others.
                    </p>
                  </div>
                </div>
              </section>

              <section id="call-recording">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">11</span>
                  Call Recording &amp; Voicemail
                </h2>

                <h3>11.1 Call Recording</h3>
                <p>
                  If you enable call recording features, please be aware of the following:
                </p>
                <ul>
                  <li>Recordings are stored securely and encrypted</li>
                  <li>Only your authorized users can access recordings</li>
                  <li>Recordings are retained for 90 days by default (configurable)</li>
                  <li>You can delete recordings at any time through your dashboard</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-semibold mb-1">Legal Compliance Notice</p>
                      <p className="text-amber-700 text-sm mb-0">
                        <strong>You are responsible</strong> for complying with all applicable call recording laws.
                        Many states require consent from one or all parties before recording. Two-party consent states
                        include California, Connecticut, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana,
                        Nevada, New Hampshire, Pennsylvania, and Washington.
                      </p>
                    </div>
                  </div>
                </div>

                <h3>11.2 Voicemail</h3>
                <ul>
                  <li>Voicemail recordings are automatically transcribed using AI</li>
                  <li>Both audio and transcriptions are stored securely</li>
                  <li>Voicemails are retained for 90 days (configurable)</li>
                  <li>You can download or delete voicemails at any time</li>
                </ul>

                <h3>11.3 AI Processing</h3>
                <p>
                  Our AI systems process call and voicemail content to provide transcription, sentiment analysis,
                  and receptionist services. This processing is done to provide the Services and improve their
                  quality. We do not use your call content for advertising purposes.
                </p>
              </section>

              <section id="cpni">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">12</span>
                  CPNI (Telecommunications)
                </h2>
                <p>
                  As a telecommunications service provider, we collect Customer Proprietary Network Information
                  (CPNI) as defined by the FCC. CPNI includes:
                </p>
                <ul>
                  <li>Quantity, technical configuration, type, destination, and amount of use of telecommunications services</li>
                  <li>Information contained on telephone bills</li>
                  <li>Call detail information (numbers called, duration, location)</li>
                </ul>

                <h3>Your CPNI Rights</h3>
                <p>
                  Under FCC regulations, you have the right to restrict the use and disclosure of your CPNI.
                  We will only use your CPNI to:
                </p>
                <ul>
                  <li>Provide the telecommunications services you have requested</li>
                  <li>Market related telecommunications services to you (unless you opt out)</li>
                  <li>Respond to legal requirements</li>
                </ul>

                <p>
                  To restrict use of your CPNI for marketing purposes, contact us at privacy@startmybusiness.us
                  or call 888-534-4145.
                </p>
              </section>

              <section id="children">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">13</span>
                  Children&apos;s Privacy
                </h2>
                <p>
                  Our Services are not intended for individuals under the age of 18. We do not knowingly collect
                  personal information from children under 13 (or 16 in certain jurisdictions). If you are a
                  parent or guardian and believe your child has provided us with personal information, please
                  contact us immediately at privacy@startmybusiness.us.
                </p>
                <p>
                  If we learn that we have collected personal information from a child without proper consent,
                  we will take steps to delete that information as soon as possible.
                </p>
              </section>

              <section id="international">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">14</span>
                  International Data Transfers
                </h2>
                <p>
                  SMB Voice is based in the United States, and our services are primarily designed for U.S.
                  businesses. Your information may be transferred to, stored, and processed in the United States
                  or other countries where our service providers are located.
                </p>
                <p>
                  If you are accessing our Services from outside the United States, please be aware that your
                  information may be transferred to, stored, and processed in the United States where our servers
                  are located and our central database is operated.
                </p>
                <p>
                  We implement appropriate safeguards for international data transfers, including standard
                  contractual clauses and other mechanisms approved by applicable data protection authorities.
                </p>
              </section>

              <section id="cookies">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">15</span>
                  Cookies &amp; Tracking Technologies
                </h2>
                <p>We use cookies and similar technologies to:</p>
                <ul>
                  <li>Maintain your session and authentication</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve our Services and user experience</li>
                </ul>

                <h3>Types of Cookies We Use</h3>
                <div className="overflow-x-auto not-prose">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Type</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Purpose</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-900">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="px-4 py-2 font-medium text-gray-900">Essential</td>
                        <td className="px-4 py-2 text-gray-700">Authentication, security, core functionality</td>
                        <td className="px-4 py-2 text-gray-700">Session</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">Functional</td>
                        <td className="px-4 py-2 text-gray-700">Preferences, settings, personalization</td>
                        <td className="px-4 py-2 text-gray-700">1 year</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium text-gray-900">Analytics</td>
                        <td className="px-4 py-2 text-gray-700">Usage statistics, performance monitoring</td>
                        <td className="px-4 py-2 text-gray-700">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>Managing Cookies</h3>
                <p>
                  You can control cookies through your browser settings. However, disabling certain cookies may
                  affect the functionality of our Services. We also honor &ldquo;Do Not Track&rdquo; browser signals where
                  technically feasible.
                </p>
              </section>

              <section id="third-party">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">16</span>
                  Third-Party Services
                </h2>
                <p>Our Services may contain links to third-party websites or integrate with third-party services:</p>

                <h3>16.1 Service Integrations</h3>
                <ul>
                  <li><strong>SignalWire:</strong> <a href="https://signalwire.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                  <li><strong>Clerk:</strong> <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                  <li><strong>Gumroad:</strong> <a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                </ul>

                <h3>16.2 External Links</h3>
                <p>
                  This Privacy Policy does not apply to third-party websites. We are not responsible for the
                  privacy practices of websites we link to. Please review the privacy policies of any third-party
                  sites you visit.
                </p>
              </section>

              <section id="changes">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">17</span>
                  Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices,
                  technologies, legal requirements, or other factors. When we make material changes, we will:
                </p>
                <ul>
                  <li>Update the &ldquo;Effective Date&rdquo; at the top of this policy</li>
                  <li>Post a notice on our website</li>
                  <li>Send email notification to registered users (for material changes)</li>
                  <li>Maintain an archive of previous versions upon request</li>
                </ul>
                <p>
                  Your continued use of our Services after changes to this policy constitutes your acceptance
                  of the updated terms.
                </p>
              </section>

              <section id="contact">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">18</span>
                  Contact Us
                </h2>
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>

                <div className="bg-gray-50 rounded-xl p-6 mt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Privacy Team</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>Email:</strong> privacy@startmybusiness.us</li>
                        <li><strong>Phone:</strong> 888-534-4145</li>
                        <li><strong>Hours:</strong> Monday-Friday, 9am-6pm CT</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mailing Address</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Start My Business Inc.</li>
                        <li>Attn: Privacy Officer</li>
                        <li>Houston, Texas 77002</li>
                        <li>United States</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm mb-0">
                    <strong>Response Time:</strong> We aim to respond to privacy inquiries within 5 business days.
                    For formal data subject requests, we will respond within 45 days as required by applicable law.
                  </p>
                </div>
              </section>
            </div>

            {/* Acceptance Box */}
            <div className="mt-12 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-8 text-white">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-[#C9A227] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Privacy Matters</h3>
                  <p className="text-white/80 text-sm">
                    We are committed to protecting your privacy and being transparent about our data practices.
                    If you have any questions or concerns about how we handle your information, please don&apos;t
                    hesitate to contact us.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <Link
                      href="/terms"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      Terms of Service
                    </Link>
                    <Link
                      href="/sms-terms"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      SMS Terms
                    </Link>
                    <a
                      href="mailto:privacy@startmybusiness.us"
                      className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#B8911F] px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Lock className="h-4 w-4" />
                      Contact Privacy Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
