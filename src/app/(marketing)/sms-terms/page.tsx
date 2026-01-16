"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Phone,
  Ban,
  Clock,
  Users,
  Scale
} from "lucide-react";

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "consent", title: "2. Consent to Receive Messages" },
  { id: "message-types", title: "3. Types of Messages" },
  { id: "frequency", title: "4. Message Frequency" },
  { id: "opt-out", title: "5. How to Opt Out" },
  { id: "costs", title: "6. Message & Data Rates" },
  { id: "tcpa", title: "7. TCPA Compliance" },
  { id: "customer-obligations", title: "8. Your Obligations" },
  { id: "prohibited-content", title: "9. Prohibited Content" },
  { id: "carrier-filtering", title: "10. Carrier Filtering" },
  { id: "a2p-10dlc", title: "11. A2P 10DLC Registration" },
  { id: "data-privacy", title: "12. Data & Privacy" },
  { id: "disclaimers", title: "13. Disclaimers" },
  { id: "contact", title: "14. Contact Information" },
];

export default function SMSTermsPage() {
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
              <MessageSquare className="h-4 w-4 text-[#C9A227]" />
              <span className="text-sm font-medium">SMS Compliance</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              SMS Terms &amp; Conditions
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Terms governing SMS/MMS messaging services and TCPA compliance requirements
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
              <Link href="/privacy" className="text-gray-600 hover:text-[#C9A227]">Privacy Policy</Link>
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

              {/* Quick Opt-Out Card */}
              <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Stop Messages
                </h4>
                <p className="text-xs text-red-800 mb-3">
                  To stop receiving messages from SMB Voice, reply STOP to any message.
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  <li><strong>STOP</strong> - Stop all messages</li>
                  <li><strong>HELP</strong> - Get help</li>
                  <li><strong>INFO</strong> - Request info</li>
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
            {/* TCPA Notice Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <Scale className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 text-lg mb-2">TCPA &amp; Messaging Compliance</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    These SMS Terms and Conditions govern the use of SMS/MMS messaging services provided through
                    SMB Voice. By using our messaging services, you agree to comply with the Telephone Consumer
                    Protection Act (TCPA), CAN-SPAM Act, CTIA guidelines, and all applicable federal and state
                    messaging regulations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      <CheckCircle className="h-3 w-3" /> TCPA Compliant
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      <CheckCircle className="h-3 w-3" /> CTIA Registered
                    </span>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      <CheckCircle className="h-3 w-3" /> A2P 10DLC
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
              <section id="overview">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">1</span>
                  Overview
                </h2>
                <p>
                  These SMS Terms and Conditions (&ldquo;SMS Terms&rdquo;) govern the use of Short Message Service (SMS)
                  and Multimedia Messaging Service (MMS) features provided through SMB Voice, a service of
                  Start My Business Inc. (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                </p>
                <p>
                  These SMS Terms supplement our <Link href="/terms">Terms of Service</Link> and{" "}
                  <Link href="/privacy">Privacy Policy</Link>. In the event of any conflict between these SMS Terms
                  and our Terms of Service, these SMS Terms shall govern with respect to SMS/MMS messaging.
                </p>
                <div className="bg-gray-50 border-l-4 border-[#C9A227] p-4 my-4">
                  <p className="text-sm text-gray-700 mb-0">
                    <strong>Applicability:</strong> These terms apply to both (1) messages SMB Voice sends to you
                    as a customer or prospect, and (2) messages you send to your customers using SMB Voice
                    messaging features.
                  </p>
                </div>
              </section>

              <section id="consent">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">2</span>
                  Consent to Receive Messages
                </h2>

                <h3>2.1 Your Consent to SMB Voice Messages</h3>
                <p>
                  By providing your mobile phone number to SMB Voice, you expressly consent to receive SMS/MMS
                  messages from us, including:
                </p>
                <ul>
                  <li>Account notifications and alerts</li>
                  <li>Service updates and announcements</li>
                  <li>Authentication and verification codes</li>
                  <li>Billing and payment reminders</li>
                  <li>Customer support communications</li>
                  <li>Marketing and promotional messages (with additional consent)</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-semibold mb-1">Consent Requirements</p>
                      <p className="text-amber-700 text-sm mb-0">
                        Marketing messages require separate, express written consent. You may receive transactional
                        messages related to your account without additional consent, but you can opt out at any time.
                      </p>
                    </div>
                  </div>
                </div>

                <h3>2.2 Consent for Messages You Send</h3>
                <p>
                  When you use SMB Voice to send SMS/MMS messages to your customers, <strong>you are solely
                  responsible</strong> for obtaining proper consent under the TCPA and all applicable laws.
                  This includes:
                </p>
                <ul>
                  <li><strong>Express Written Consent:</strong> Required for marketing/promotional messages</li>
                  <li><strong>Express Consent:</strong> Required for non-marketing informational messages</li>
                  <li><strong>Prior Express Written Consent:</strong> Required for messages using an autodialer or artificial/prerecorded voice</li>
                </ul>

                <h3>2.3 Valid Consent Elements</h3>
                <p>For marketing messages, valid consent must include:</p>
                <ul>
                  <li>Clear disclosure that the consumer is consenting to receive marketing messages</li>
                  <li>The specific phone number authorized to receive messages</li>
                  <li>The identity of the business sending messages</li>
                  <li>Disclosure that consent is not a condition of purchase</li>
                  <li>Disclosure that message and data rates may apply</li>
                  <li>Disclosure of message frequency</li>
                  <li>Instructions on how to opt out</li>
                </ul>
              </section>

              <section id="message-types">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">3</span>
                  Types of Messages
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Message Type</th>
                        <th className="px-4 py-3 text-left font-semibold">Description</th>
                        <th className="px-4 py-3 text-left font-semibold">Consent Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 font-medium">Transactional</td>
                        <td className="px-4 py-3">Account alerts, verification codes, appointment reminders</td>
                        <td className="px-4 py-3 text-green-700">Express Consent</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium">Informational</td>
                        <td className="px-4 py-3">Service updates, status notifications, delivery alerts</td>
                        <td className="px-4 py-3 text-green-700">Express Consent</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Conversational</td>
                        <td className="px-4 py-3">Two-way customer service, support inquiries</td>
                        <td className="px-4 py-3 text-green-700">Express Consent</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 font-medium">Marketing</td>
                        <td className="px-4 py-3">Promotions, offers, sales announcements</td>
                        <td className="px-4 py-3 text-red-700 font-semibold">Express Written Consent</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="frequency">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">4</span>
                  Message Frequency
                </h2>

                <h3>4.1 Messages from SMB Voice to You</h3>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#C9A227]" />
                      <h4 className="font-semibold text-gray-900 mb-0">Transactional Messages</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                      Frequency varies based on your account activity. Expect 1-5 messages per week for
                      account notifications, alerts, and verification codes.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-[#C9A227]" />
                      <h4 className="font-semibold text-gray-900 mb-0">Marketing Messages</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                      Maximum 4 marketing messages per month. You can opt out of marketing messages
                      while continuing to receive transactional messages.
                    </p>
                  </div>
                </div>

                <h3>4.2 Messages You Send Through SMB Voice</h3>
                <p>
                  You must clearly disclose expected message frequency to your recipients before they consent.
                  We recommend including language such as:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <p className="text-blue-800 text-sm mb-0 italic">
                    &ldquo;By providing your phone number, you consent to receive up to [X] text messages per [week/month]
                    from [Your Business Name] regarding [purpose]. Message and data rates may apply. Reply STOP to
                    unsubscribe at any time.&rdquo;
                  </p>
                </div>
              </section>

              <section id="opt-out">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">5</span>
                  How to Opt Out
                </h2>

                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 my-4">
                  <div className="flex gap-4">
                    <Ban className="h-8 w-8 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-900 font-bold text-lg mb-2">Stop Receiving Messages</h3>
                      <p className="text-red-800 mb-4">
                        You can opt out of receiving SMS messages at any time by using one of the following methods:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h4 className="font-semibold text-red-900 mb-2">Reply Keywords</h4>
                          <ul className="text-sm text-red-800 space-y-1">
                            <li><strong>STOP</strong> - Stop all messages</li>
                            <li><strong>STOP ALL</strong> - Stop all messages</li>
                            <li><strong>UNSUBSCRIBE</strong> - Stop all messages</li>
                            <li><strong>CANCEL</strong> - Stop all messages</li>
                            <li><strong>END</strong> - Stop all messages</li>
                            <li><strong>QUIT</strong> - Stop all messages</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h4 className="font-semibold text-red-900 mb-2">Other Methods</h4>
                          <ul className="text-sm text-red-800 space-y-1">
                            <li>Email: sms-optout@startmybusiness.us</li>
                            <li>Phone: 888-534-4145</li>
                            <li>Account Dashboard Settings</li>
                            <li>Contact Customer Support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3>5.1 Opt-Out Confirmation</h3>
                <p>
                  After you text STOP, you will receive a one-time confirmation message stating that you have
                  been unsubscribed. No additional messages will be sent unless you re-subscribe.
                </p>

                <h3>5.2 Re-Subscribing</h3>
                <p>
                  To start receiving messages again after opting out, reply <strong>START</strong>,{" "}
                  <strong>YES</strong>, or <strong>UNSTOP</strong> to any SMB Voice number, or update your
                  preferences in your account dashboard.
                </p>

                <h3>5.3 Help Information</h3>
                <p>
                  At any time, you can text <strong>HELP</strong> or <strong>INFO</strong> for assistance.
                  You will receive a message with contact information and instructions.
                </p>
              </section>

              <section id="costs">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">6</span>
                  Message &amp; Data Rates
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <p className="text-amber-800 text-sm mb-0">
                    <strong>Message and data rates may apply.</strong> Check with your mobile carrier for details
                    about your text messaging plan. SMB Voice does not charge for SMS messages you receive from us,
                    but your carrier may charge standard messaging rates.
                  </p>
                </div>

                <h3>6.1 SMB Voice Pricing</h3>
                <ul>
                  <li><strong>Outbound SMS:</strong> $0.02 per message segment</li>
                  <li><strong>Inbound SMS:</strong> $0.01 per message segment</li>
                  <li><strong>MMS Messages:</strong> $0.05 per message</li>
                </ul>

                <h3>6.2 Message Segments</h3>
                <p>
                  Standard SMS messages are limited to 160 characters. Messages exceeding this limit are split
                  into multiple segments and billed accordingly. Messages containing special characters
                  (emojis, non-Latin characters) may have a lower character limit (70 characters).
                </p>

                <h3>6.3 Carrier Surcharges</h3>
                <p>
                  Mobile carriers impose per-message surcharges for A2P (Application-to-Person) messaging.
                  These fees are passed through to customers as part of our messaging pricing.
                </p>
              </section>

              <section id="tcpa">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">7</span>
                  TCPA Compliance
                </h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                  <div className="flex gap-3">
                    <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm mb-0">
                        <strong>Legal Framework:</strong> All SMS/MMS messaging through SMB Voice must comply with
                        the Telephone Consumer Protection Act (47 U.S.C. § 227), FCC regulations, CTIA guidelines,
                        and all applicable state and federal laws.
                      </p>
                    </div>
                  </div>
                </div>

                <h3>7.1 TCPA Requirements</h3>
                <p>The TCPA requires:</p>
                <ul>
                  <li><strong>Prior Express Written Consent</strong> for marketing messages sent using an autodialer</li>
                  <li><strong>Clear identification</strong> of the sender in each message</li>
                  <li><strong>Opt-out mechanism</strong> in every message</li>
                  <li><strong>Honoring opt-outs</strong> within 10 business days (we honor them immediately)</li>
                  <li><strong>Time restrictions:</strong> No messages before 8:00 AM or after 9:00 PM (recipient&apos;s local time)</li>
                </ul>

                <h3>7.2 Penalties for Non-Compliance</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                  <p className="text-red-800 text-sm mb-0">
                    <strong>Warning:</strong> TCPA violations can result in statutory damages of $500-$1,500 per
                    unsolicited message. Class action lawsuits for TCPA violations can result in damages in the
                    millions of dollars. You are responsible for ensuring your use of SMB Voice messaging
                    complies with all applicable laws.
                  </p>
                </div>

                <h3>7.3 Do Not Call Registry</h3>
                <p>
                  You must scrub your messaging lists against the National Do Not Call Registry if you are
                  sending marketing messages. Transactional messages are generally exempt from DNC requirements,
                  but you should consult legal counsel for specific guidance.
                </p>
              </section>

              <section id="customer-obligations">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">8</span>
                  Your Obligations
                </h2>

                <p>When using SMB Voice messaging services, you agree to:</p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      You MUST
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Obtain proper consent before messaging</li>
                      <li>Honor all opt-out requests immediately</li>
                      <li>Include opt-out instructions in messages</li>
                      <li>Identify your business in messages</li>
                      <li>Maintain consent records for 4+ years</li>
                      <li>Comply with quiet hours (8am-9pm local)</li>
                      <li>Register for A2P 10DLC</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Ban className="h-4 w-4 text-red-600" />
                      You MUST NOT
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Send messages without consent</li>
                      <li>Purchase or rent phone lists</li>
                      <li>Send prohibited content</li>
                      <li>Ignore opt-out requests</li>
                      <li>Spoof caller ID or sender info</li>
                      <li>Send to reassigned numbers knowingly</li>
                      <li>Exceed reasonable message frequency</li>
                    </ul>
                  </div>
                </div>

                <h3>8.1 Consent Record Keeping</h3>
                <p>
                  You must maintain records of consent for at least 4 years after the last message was sent.
                  Records should include:
                </p>
                <ul>
                  <li>Phone number that provided consent</li>
                  <li>Date and time consent was given</li>
                  <li>Method of consent (web form, verbal, etc.)</li>
                  <li>Language of the consent disclosure</li>
                  <li>IP address (for web-based consent)</li>
                </ul>

                <h3>8.2 Compliance Audits</h3>
                <p>
                  SMB Voice reserves the right to audit your messaging practices for compliance. We may request
                  proof of consent, review message content, and suspend messaging capabilities for non-compliance.
                </p>
              </section>

              <section id="prohibited-content">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">9</span>
                  Prohibited Content
                </h2>

                <p>The following content is strictly prohibited in all SMS/MMS messages:</p>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-4">
                  <h4 className="font-semibold text-red-900 mb-3">Absolutely Prohibited (SHAFT)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm text-red-800 space-y-1">
                      <li><strong>S</strong> - Sex/Adult content</li>
                      <li><strong>H</strong> - Hate speech</li>
                      <li><strong>A</strong> - Alcohol (unlicensed)</li>
                      <li><strong>F</strong> - Firearms</li>
                      <li><strong>T</strong> - Tobacco/Cannabis</li>
                    </ul>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>Illegal products/services</li>
                      <li>Phishing or fraud attempts</li>
                      <li>Malware or viruses</li>
                      <li>Gambling (unlicensed)</li>
                      <li>High-risk financial services</li>
                    </ul>
                  </div>
                </div>

                <h3>9.1 Age-Gated Content</h3>
                <p>
                  Certain industries (alcohol, gambling where legal, age-restricted products) require additional
                  compliance measures including age verification. Contact us before sending age-gated content.
                </p>

                <h3>9.2 Content Review</h3>
                <p>
                  SMB Voice and our carrier partners reserve the right to review message content and suspend
                  messaging for prohibited content without prior notice.
                </p>
              </section>

              <section id="carrier-filtering">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">10</span>
                  Carrier Filtering
                </h2>

                <p>
                  Mobile carriers actively filter SMS messages to protect consumers from spam and fraud.
                  Messages may be filtered or blocked for:
                </p>
                <ul>
                  <li>Sending from unregistered 10DLC numbers</li>
                  <li>High volume sending patterns</li>
                  <li>Prohibited or suspicious content</li>
                  <li>Low-quality phone number lists</li>
                  <li>High opt-out rates</li>
                  <li>Consumer complaints</li>
                </ul>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <p className="text-amber-800 text-sm mb-0">
                    <strong>No Delivery Guarantee:</strong> While we strive for maximum deliverability, we cannot
                    guarantee delivery of any specific message. Carrier filtering decisions are outside our control.
                  </p>
                </div>
              </section>

              <section id="a2p-10dlc">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">11</span>
                  A2P 10DLC Registration
                </h2>

                <p>
                  All business text messaging in the United States requires registration with the A2P 10DLC
                  (Application-to-Person 10-Digit Long Code) system. This is a carrier-mandated requirement.
                </p>

                <h3>11.1 Registration Requirements</h3>
                <ul>
                  <li><strong>Brand Registration:</strong> Register your business identity with The Campaign Registry (TCR)</li>
                  <li><strong>Campaign Registration:</strong> Register each messaging use case (campaign)</li>
                  <li><strong>Vetting:</strong> Some businesses require additional vetting</li>
                </ul>

                <h3>11.2 SMB Voice Support</h3>
                <p>
                  SMB Voice assists with A2P 10DLC registration. When you set up messaging in your account,
                  we will guide you through the registration process. Most registrations are approved within 24-48 hours.
                </p>

                <h3>11.3 Unregistered Traffic</h3>
                <p>
                  Unregistered A2P traffic faces:
                </p>
                <ul>
                  <li>Significant carrier filtering (most messages blocked)</li>
                  <li>Higher fees per message</li>
                  <li>Risk of complete blocking</li>
                </ul>
              </section>

              <section id="data-privacy">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">12</span>
                  Data &amp; Privacy
                </h2>

                <p>
                  Your privacy is important to us. For complete details on how we collect, use, and protect
                  your data, please see our <Link href="/privacy">Privacy Policy</Link>.
                </p>

                <h3>12.1 Information We Collect</h3>
                <ul>
                  <li>Phone numbers you provide</li>
                  <li>Message content and metadata</li>
                  <li>Opt-in/opt-out records</li>
                  <li>Delivery status information</li>
                </ul>

                <h3>12.2 How We Use SMS Data</h3>
                <ul>
                  <li>Delivering your messages</li>
                  <li>Providing customer support</li>
                  <li>Improving message deliverability</li>
                  <li>Compliance monitoring</li>
                  <li>Fraud prevention</li>
                </ul>

                <h3>12.3 Data Sharing</h3>
                <p>
                  We share phone numbers and message content with our telephony provider (SignalWire) and
                  mobile carriers to deliver messages. We do not sell phone numbers or message content to
                  third parties.
                </p>
              </section>

              <section id="disclaimers">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">13</span>
                  Disclaimers
                </h2>

                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 my-4 text-sm">
                  <p className="mb-3">
                    SMS MESSAGING SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT
                    GUARANTEE MESSAGE DELIVERY, TIMING, OR QUALITY.
                  </p>
                  <p className="mb-3">
                    YOU ARE SOLELY RESPONSIBLE FOR COMPLIANCE WITH ALL APPLICABLE LAWS, INCLUDING THE TCPA,
                    CAN-SPAM ACT, AND STATE MESSAGING LAWS. SMB VOICE IS NOT LIABLE FOR YOUR VIOLATIONS.
                  </p>
                  <p className="mb-0">
                    MOBILE CARRIERS MAY FILTER OR BLOCK MESSAGES AT THEIR DISCRETION. WE ARE NOT RESPONSIBLE
                    FOR CARRIER ACTIONS OR FAILURES TO DELIVER MESSAGES.
                  </p>
                </div>

                <h3>13.1 Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, SMB Voice shall not be liable for any damages arising
                  from your use of SMS messaging services, including but not limited to:
                </p>
                <ul>
                  <li>Failed or delayed message delivery</li>
                  <li>Messages blocked by carriers</li>
                  <li>TCPA or other regulatory violations by you</li>
                  <li>Loss of business due to messaging issues</li>
                </ul>

                <h3>13.2 Indemnification</h3>
                <p>
                  You agree to indemnify and hold harmless SMB Voice from any claims, damages, or expenses
                  arising from your use of SMS messaging services, including claims related to TCPA violations,
                  unsolicited messages, or prohibited content.
                </p>
              </section>

              <section id="contact">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">14</span>
                  Contact Information
                </h2>

                <p>For questions about these SMS Terms or our messaging services:</p>

                <div className="bg-gray-50 rounded-xl p-6 mt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">SMS Support</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>Email:</strong> sms-support@startmybusiness.us</li>
                        <li><strong>Phone:</strong> 888-534-4145</li>
                        <li><strong>Text HELP to:</strong> Any SMB Voice number</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Opt-Out Requests</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>Text <strong>STOP</strong> to any SMB Voice number</li>
                        <li><strong>Email:</strong> sms-optout@startmybusiness.us</li>
                        <li>Manage in your account dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Company Information</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Company:</strong> Start My Business Inc. d/b/a SMB Voice</li>
                    <li><strong>Address:</strong> Houston, Texas 77002</li>
                    <li><strong>Phone:</strong> 888-534-4145</li>
                    <li><strong>Website:</strong> voice.startmybusiness.us</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Acceptance Box */}
            <div className="mt-12 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-8 text-white">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-8 w-8 text-[#C9A227] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">SMS Consent Acknowledgment</h3>
                  <p className="text-white/80 text-sm">
                    By using SMB Voice messaging services, you acknowledge that you have read, understood, and
                    agree to these SMS Terms and Conditions. You understand that message and data rates may apply,
                    and you can opt out at any time by replying STOP.
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
                      href="/privacy"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                    </Link>
                    <a
                      href="mailto:sms-support@startmybusiness.us"
                      className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#B8911F] px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Contact SMS Support
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
