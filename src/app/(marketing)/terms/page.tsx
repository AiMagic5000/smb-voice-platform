"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, Scale, Shield, FileText, Phone, AlertTriangle } from "lucide-react";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "definitions", title: "2. Definitions" },
  { id: "services", title: "3. Description of Services" },
  { id: "account", title: "4. Account Registration & Security" },
  { id: "pricing", title: "5. Pricing, Billing & Payments" },
  { id: "acceptable-use", title: "6. Acceptable Use Policy" },
  { id: "service-levels", title: "7. Service Level Agreement" },
  { id: "emergency", title: "8. Emergency Services (911) Limitations" },
  { id: "telecommunications", title: "9. Telecommunications Regulatory Compliance" },
  { id: "portability", title: "10. Number Portability" },
  { id: "intellectual-property", title: "11. Intellectual Property" },
  { id: "confidentiality", title: "12. Confidentiality" },
  { id: "termination", title: "13. Termination" },
  { id: "disclaimers", title: "14. Disclaimers" },
  { id: "limitation", title: "15. Limitation of Liability" },
  { id: "indemnification", title: "16. Indemnification" },
  { id: "dispute", title: "17. Dispute Resolution & Arbitration" },
  { id: "governing-law", title: "18. Governing Law & Jurisdiction" },
  { id: "modifications", title: "19. Modifications to Terms" },
  { id: "general", title: "20. General Provisions" },
  { id: "contact", title: "21. Contact Information" },
];

export default function TermsPage() {
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
              <Scale className="h-4 w-4 text-[#C9A227]" />
              <span className="text-sm font-medium">Legal Documentation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Master Services Agreement governing your use of SMB Voice telecommunications services
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
              <Link href="/privacy" className="text-gray-600 hover:text-[#C9A227]">Privacy Policy</Link>
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
                <ul className="space-y-1 text-sm">
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
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Important Legal Notice</h3>
                  <p className="text-amber-800 text-sm">
                    PLEASE READ THESE TERMS OF SERVICE CAREFULLY. BY ACCESSING OR USING SMB VOICE SERVICES,
                    YOU AGREE TO BE BOUND BY THESE TERMS AND ALL APPLICABLE LAWS AND REGULATIONS. THESE TERMS
                    CONTAIN A BINDING ARBITRATION CLAUSE AND CLASS ACTION WAIVER THAT AFFECT YOUR LEGAL RIGHTS.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:scroll-mt-24">
              <section id="acceptance">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">1</span>
                  Acceptance of Terms
                </h2>
                <p>
                  These Terms of Service (&ldquo;Terms&rdquo; or &ldquo;Agreement&rdquo;) constitute a legally binding agreement
                  between you (the &ldquo;User,&rdquo; &ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and Start My Business Inc.,
                  a Texas corporation doing business as SMB Voice (&ldquo;Company,&rdquo; &ldquo;SMB Voice,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                  governing your access to and use of our cloud-based telecommunications services.
                </p>
                <p>
                  By creating an account, accessing our website, using our mobile or desktop applications,
                  or utilizing any of our services, you acknowledge that you have read, understood, and agree
                  to be bound by these Terms, our <Link href="/privacy">Privacy Policy</Link>, our{" "}
                  <Link href="/sms-terms">SMS Terms and Conditions</Link>, and any additional guidelines or
                  policies referenced herein.
                </p>
                <p>
                  If you are entering into these Terms on behalf of a business entity, you represent and warrant
                  that you have the authority to bind such entity to these Terms, in which case &ldquo;you&rdquo; and &ldquo;your&rdquo;
                  shall refer to such entity.
                </p>
                <div className="bg-gray-50 border-l-4 border-[#C9A227] p-4 my-4">
                  <p className="text-sm text-gray-700 mb-0">
                    <strong>Eligibility:</strong> You must be at least 18 years of age and have the legal capacity
                    to enter into binding contracts to use our services. Our services are intended for business
                    use only and are not available to consumers for personal, family, or household purposes.
                  </p>
                </div>
              </section>

              <section id="definitions">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">2</span>
                  Definitions
                </h2>
                <p>For purposes of these Terms, the following definitions apply:</p>
                <ul>
                  <li><strong>&ldquo;Services&rdquo;</strong> means all cloud-based telecommunications services provided by SMB Voice, including but not limited to virtual phone numbers, AI receptionist, voicemail, call routing, and related applications.</li>
                  <li><strong>&ldquo;Account&rdquo;</strong> means the registered user account required to access and use the Services.</li>
                  <li><strong>&ldquo;Virtual Phone Number&rdquo;</strong> means any local or toll-free telephone number provisioned through our platform.</li>
                  <li><strong>&ldquo;AI Receptionist&rdquo;</strong> means our artificial intelligence-powered automated attendant service.</li>
                  <li><strong>&ldquo;PSTN&rdquo;</strong> means the Public Switched Telephone Network.</li>
                  <li><strong>&ldquo;VoIP&rdquo;</strong> means Voice over Internet Protocol technology.</li>
                  <li><strong>&ldquo;User Content&rdquo;</strong> means any data, recordings, messages, or other content you upload, transmit, or store through the Services.</li>
                  <li><strong>&ldquo;Subscription Plan&rdquo;</strong> means the specific tier of service you have selected (Starter, Professional, Business, or Enterprise).</li>
                </ul>
              </section>

              <section id="services">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">3</span>
                  Description of Services
                </h2>
                <p>
                  SMB Voice provides enterprise-grade cloud telecommunications services designed for small and
                  medium-sized businesses. Our platform includes:
                </p>

                <h3>3.1 Core Telephony Services</h3>
                <ul>
                  <li>Local and toll-free virtual phone numbers across all United States area codes</li>
                  <li>Inbound and outbound calling capabilities via VoIP technology</li>
                  <li>Advanced call routing, forwarding, and transfer functionality</li>
                  <li>Interactive Voice Response (IVR) menu systems</li>
                  <li>Call queuing and hold music</li>
                  <li>Caller ID management and customization</li>
                </ul>

                <h3>3.2 AI-Powered Features</h3>
                <ul>
                  <li>AI Receptionist with natural language understanding</li>
                  <li>Automated voicemail transcription</li>
                  <li>Intelligent call screening and routing</li>
                  <li>Real-time call analytics and insights</li>
                  <li>Sentiment analysis and conversation summaries</li>
                </ul>

                <h3>3.3 Messaging Services</h3>
                <ul>
                  <li>SMS and MMS text messaging capabilities</li>
                  <li>Two-way business texting</li>
                  <li>Automated message responses</li>
                  <li>Message templates and scheduling</li>
                </ul>

                <h3>3.4 Platform Access</h3>
                <ul>
                  <li>Web-based dashboard and control panel</li>
                  <li>iOS and Android mobile applications</li>
                  <li>Windows, macOS, and Linux desktop applications</li>
                  <li>API access for custom integrations (Enterprise plans)</li>
                </ul>

                <h3>3.5 Additional Features</h3>
                <ul>
                  <li>Voicemail with customizable greetings</li>
                  <li>Call recording (subject to applicable laws)</li>
                  <li>Fax-to-email capabilities</li>
                  <li>Business hours and holiday scheduling</li>
                  <li>Multi-user and team management</li>
                </ul>
              </section>

              <section id="account">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">4</span>
                  Account Registration &amp; Security
                </h2>

                <h3>4.1 Account Creation</h3>
                <p>
                  To access our Services, you must create an account by providing accurate, current, and complete
                  information as prompted by our registration form. You agree to maintain and promptly update your
                  account information to keep it accurate, current, and complete.
                </p>

                <h3>4.2 Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. You agree to:
                </p>
                <ul>
                  <li>Create a strong, unique password</li>
                  <li>Enable two-factor authentication when available</li>
                  <li>Not share your login credentials with unauthorized parties</li>
                  <li>Immediately notify us of any unauthorized access or security breach</li>
                  <li>Log out from your account at the end of each session</li>
                </ul>

                <h3>4.3 Account Verification</h3>
                <p>
                  We may require identity verification, including but not limited to government-issued identification,
                  business registration documents, or address verification, to comply with regulatory requirements
                  and prevent fraud.
                </p>

                <h3>4.4 Account Suspension</h3>
                <p>
                  We reserve the right to suspend or terminate your account immediately, without prior notice, if we
                  reasonably believe that you have violated these Terms, engaged in fraudulent activity, or pose a
                  security risk to our platform or other users.
                </p>
              </section>

              <section id="pricing">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">5</span>
                  Pricing, Billing &amp; Payments
                </h2>

                <h3>5.1 Subscription Plans</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Monthly Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Phone Numbers</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">AI Minutes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm">Starter</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#C9A227]">$7.95</td>
                        <td className="px-4 py-3 text-sm">1 Local Number</td>
                        <td className="px-4 py-3 text-sm">100 minutes</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm">Professional</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#C9A227]">$19.95</td>
                        <td className="px-4 py-3 text-sm">3 Numbers</td>
                        <td className="px-4 py-3 text-sm">500 minutes</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Business</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#C9A227]">$39.95</td>
                        <td className="px-4 py-3 text-sm">10 Numbers</td>
                        <td className="px-4 py-3 text-sm">2,000 minutes</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm">Enterprise</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#C9A227]">Custom</td>
                        <td className="px-4 py-3 text-sm">Unlimited</td>
                        <td className="px-4 py-3 text-sm">Unlimited</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>5.2 Usage-Based Charges</h3>
                <ul>
                  <li><strong>Additional Phone Numbers:</strong> $5.00/month per additional local number</li>
                  <li><strong>Toll-Free Numbers:</strong> $10.00/month per number</li>
                  <li><strong>AI Minute Overage:</strong> $0.10 per minute beyond plan allocation</li>
                  <li><strong>Outbound SMS:</strong> $0.02 per message</li>
                  <li><strong>Inbound SMS:</strong> $0.01 per message</li>
                  <li><strong>International Calls:</strong> Rates vary by destination (see rate table)</li>
                </ul>

                <h3>5.3 Payment Terms</h3>
                <p>
                  All payments are processed through Gumroad, our authorized payment processor. By subscribing to
                  our Services, you authorize recurring charges to your designated payment method. Subscription fees
                  are billed in advance on a monthly basis, and usage-based charges are billed in arrears.
                </p>

                <h3>5.4 Taxes</h3>
                <p>
                  All prices are exclusive of applicable taxes unless otherwise stated. You are responsible for paying
                  all taxes, including but not limited to federal, state, and local telecommunications taxes, Universal
                  Service Fund (USF) contributions, regulatory fees, and any other taxes or charges imposed by governmental
                  authorities.
                </p>

                <h3>5.5 Refund Policy</h3>
                <p>
                  Subscription fees are non-refundable except as required by applicable law. If you cancel your
                  subscription, you will continue to have access to the Services until the end of your current
                  billing period. No prorated refunds are provided for early cancellation.
                </p>

                <h3>5.6 Price Changes</h3>
                <p>
                  We reserve the right to modify our pricing at any time. We will provide at least thirty (30) days
                  prior notice of any price increase via email or through your account dashboard. Continued use of
                  the Services after the effective date of a price change constitutes acceptance of the new pricing.
                </p>
              </section>

              <section id="acceptable-use">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">6</span>
                  Acceptable Use Policy
                </h2>
                <p>
                  You agree to use the Services only for lawful purposes and in compliance with these Terms and all
                  applicable laws and regulations. You agree not to:
                </p>

                <h3>6.1 Prohibited Communications</h3>
                <ul>
                  <li>Make harassing, threatening, abusive, or defamatory calls or messages</li>
                  <li>Transmit unsolicited commercial communications (spam) or robocalls</li>
                  <li>Engage in telemarketing activities without proper consent and compliance</li>
                  <li>Make fraudulent, deceptive, or misleading communications</li>
                  <li>Use the Services for any form of illegal activity</li>
                  <li>Violate the Telephone Consumer Protection Act (TCPA) or similar laws</li>
                  <li>Engage in &ldquo;caller ID spoofing&rdquo; for fraudulent purposes</li>
                </ul>

                <h3>6.2 Technical Prohibitions</h3>
                <ul>
                  <li>Attempt to gain unauthorized access to our systems or networks</li>
                  <li>Interfere with or disrupt the Services or server infrastructure</li>
                  <li>Use the Services to transmit viruses, malware, or harmful code</li>
                  <li>Reverse engineer, decompile, or disassemble any aspect of the Services</li>
                  <li>Circumvent any security measures or access controls</li>
                  <li>Use automated systems to access the Services without authorization</li>
                </ul>

                <h3>6.3 Business Conduct</h3>
                <ul>
                  <li>Resell or redistribute the Services without authorization</li>
                  <li>Use the Services to compete directly with SMB Voice</li>
                  <li>Misrepresent your identity or affiliation</li>
                  <li>Violate any third-party rights, including intellectual property rights</li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                  <p className="text-sm text-red-800 mb-0">
                    <strong>Violation Consequences:</strong> Violation of this Acceptable Use Policy may result in
                    immediate suspension or termination of your account, legal action, and reporting to appropriate
                    law enforcement authorities.
                  </p>
                </div>
              </section>

              <section id="service-levels">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">7</span>
                  Service Level Agreement
                </h2>

                <h3>7.1 Uptime Commitment</h3>
                <p>
                  SMB Voice commits to maintaining 99.9% service availability, measured on a monthly basis
                  (&ldquo;Uptime SLA&rdquo;). Availability is calculated as: (Total Minutes - Downtime Minutes) / Total Minutes × 100.
                </p>

                <h3>7.2 Exclusions</h3>
                <p>The Uptime SLA does not apply to:</p>
                <ul>
                  <li>Scheduled maintenance (with at least 24 hours notice)</li>
                  <li>Force majeure events beyond our reasonable control</li>
                  <li>Issues caused by your equipment, software, or network</li>
                  <li>Third-party service provider outages (carriers, internet providers)</li>
                  <li>Actions or omissions by you or your authorized users</li>
                  <li>Denial of service attacks or security incidents</li>
                </ul>

                <h3>7.3 Service Credits</h3>
                <p>
                  If we fail to meet our Uptime SLA, you may be eligible for service credits upon request. Credits
                  are calculated based on the duration of the outage and are applied to your next billing cycle.
                  Service credits are your sole remedy for service interruptions.
                </p>
              </section>

              <section id="emergency">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">8</span>
                  Emergency Services (911) Limitations
                </h2>
                <div className="bg-red-100 border-2 border-red-500 rounded-xl p-6 my-4">
                  <div className="flex gap-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-900 font-bold text-lg mb-2">CRITICAL 911 EMERGENCY SERVICES NOTICE</h3>
                      <p className="text-red-800 mb-3">
                        SMB VOICE IS NOT A REPLACEMENT FOR TRADITIONAL LANDLINE OR MOBILE PHONE SERVICE FOR EMERGENCY CALLS.
                        OUR VoIP-BASED SERVICES HAVE INHERENT LIMITATIONS THAT MAY AFFECT YOUR ABILITY TO REACH EMERGENCY SERVICES.
                      </p>
                      <ul className="text-red-800 text-sm space-y-2">
                        <li><strong>Routing Limitations:</strong> 911 calls may not route correctly or may route to the wrong
                        Public Safety Answering Point (PSAP).</li>
                        <li><strong>Location Information:</strong> Your location information may not be automatically transmitted
                        to emergency responders.</li>
                        <li><strong>Service Dependency:</strong> 911 functionality requires power, working internet, and our
                        servers to be operational.</li>
                        <li><strong>Alternative Required:</strong> You MUST maintain an alternative means of reaching 911
                        emergency services (traditional landline, mobile phone, or VoIP E911 service).</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p>
                  By using SMB Voice, you acknowledge and accept these limitations and release us from any liability
                  arising from the inability to reach emergency services through our platform.
                </p>
              </section>

              <section id="telecommunications">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">9</span>
                  Telecommunications Regulatory Compliance
                </h2>

                <h3>9.1 FCC Regulations</h3>
                <p>
                  SMB Voice operates in compliance with applicable Federal Communications Commission (FCC) regulations
                  governing VoIP and interconnected telecommunications services. We maintain all necessary registrations
                  and contribute to applicable regulatory funds.
                </p>

                <h3>9.2 CPNI Protection</h3>
                <p>
                  We protect your Customer Proprietary Network Information (CPNI) in accordance with FCC rules. CPNI
                  includes information about your telephone service, such as call details, services purchased, and
                  usage patterns. We will not share your CPNI with third parties without your consent, except as
                  required by law.
                </p>

                <h3>9.3 TCPA Compliance</h3>
                <p>
                  You are responsible for ensuring your use of our messaging and calling services complies with the
                  Telephone Consumer Protection Act (TCPA) and all applicable telemarketing regulations. See our{" "}
                  <Link href="/sms-terms">SMS Terms</Link> for detailed messaging compliance requirements.
                </p>

                <h3>9.4 Do Not Call Registry</h3>
                <p>
                  If you use the Services for telemarketing purposes, you must comply with the National Do Not Call
                  Registry requirements and maintain your own internal do-not-call lists.
                </p>

                <h3>9.5 STIR/SHAKEN</h3>
                <p>
                  Our platform implements STIR/SHAKEN caller ID authentication protocols to combat illegal robocalls
                  and caller ID spoofing, as required by FCC regulations.
                </p>
              </section>

              <section id="portability">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">10</span>
                  Number Portability
                </h2>

                <h3>10.1 Porting Numbers to SMB Voice</h3>
                <p>
                  We support porting of existing phone numbers from other carriers in accordance with FCC Local Number
                  Portability (LNP) rules. Porting requests typically take 7-14 business days for local numbers and
                  up to 21 business days for toll-free numbers. We are not responsible for delays caused by your
                  current carrier.
                </p>

                <h3>10.2 Porting Numbers Away</h3>
                <p>
                  You have the right to port your phone numbers to another carrier at any time. We will process
                  port-out requests in accordance with FCC timelines. Your account must be in good standing and
                  all outstanding balances must be paid.
                </p>

                <h3>10.3 Early Termination</h3>
                <p>
                  You are responsible for any early termination fees charged by your previous carrier when porting
                  numbers to SMB Voice. SMB Voice does not charge early termination fees.
                </p>
              </section>

              <section id="intellectual-property">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">11</span>
                  Intellectual Property
                </h2>

                <h3>11.1 Our Intellectual Property</h3>
                <p>
                  The Services, including all software, content, trademarks, service marks, logos, and other
                  intellectual property, are owned by or licensed to Start My Business Inc. You are granted a
                  limited, non-exclusive, non-transferable license to use the Services in accordance with these Terms.
                </p>

                <h3>11.2 Your Content</h3>
                <p>
                  You retain all rights to your User Content. By uploading or transmitting User Content through
                  the Services, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and
                  process such content solely for the purpose of providing the Services to you.
                </p>

                <h3>11.3 Feedback</h3>
                <p>
                  Any feedback, suggestions, or ideas you provide regarding the Services become our property,
                  and we may use such feedback without any obligation to you.
                </p>
              </section>

              <section id="confidentiality">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">12</span>
                  Confidentiality
                </h2>
                <p>
                  Each party agrees to maintain the confidentiality of the other party&apos;s confidential information
                  and not to disclose such information to third parties without prior written consent, except as
                  required by law or to provide the Services.
                </p>
                <p>
                  Confidential information includes, but is not limited to, business plans, customer data,
                  pricing information, technical specifications, and any information designated as confidential.
                </p>
              </section>

              <section id="termination">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">13</span>
                  Termination
                </h2>

                <h3>13.1 Termination by You</h3>
                <p>
                  You may terminate your account at any time through your account dashboard or by contacting
                  customer support. Upon termination, your access to the Services will continue until the end
                  of your current billing period.
                </p>

                <h3>13.2 Termination by Us</h3>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for any reason,
                  including but not limited to:
                </p>
                <ul>
                  <li>Violation of these Terms or our Acceptable Use Policy</li>
                  <li>Non-payment of fees</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Actions that harm our platform, other users, or third parties</li>
                  <li>Extended periods of inactivity</li>
                </ul>

                <h3>13.3 Effect of Termination</h3>
                <p>Upon termination:</p>
                <ul>
                  <li>Your right to access and use the Services immediately ceases</li>
                  <li>Phone numbers may be released and become unavailable</li>
                  <li>User Content may be deleted after a 30-day grace period</li>
                  <li>All outstanding fees become immediately due and payable</li>
                  <li>Sections that by their nature should survive will remain in effect</li>
                </ul>
              </section>

              <section id="disclaimers">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">14</span>
                  Disclaimers
                </h2>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 my-4 text-sm not-prose">
                  <p className="mb-4 text-amber-900 font-medium leading-relaxed">
                    THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
                    EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                  </p>
                  <p className="mb-4 text-amber-900 font-medium leading-relaxed">
                    WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF
                    VIRUSES OR OTHER HARMFUL COMPONENTS. WE DO NOT WARRANT THAT THE RESULTS OBTAINED FROM THE
                    USE OF THE SERVICES WILL BE ACCURATE OR RELIABLE.
                  </p>
                  <p className="mb-0 text-amber-900 font-medium leading-relaxed">
                    SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO SOME OF THE ABOVE
                    EXCLUSIONS MAY NOT APPLY TO YOU.
                  </p>
                </div>
              </section>

              <section id="limitation">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">15</span>
                  Limitation of Liability
                </h2>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 my-4 text-sm not-prose">
                  <p className="mb-4 text-amber-900 font-medium leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL START MY BUSINESS INC.,
                    ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, OR ASSIGNS BE LIABLE FOR
                    ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING
                    BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, USE, OR OTHER INTANGIBLE LOSSES,
                    REGARDLESS OF WHETHER WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                  </p>
                  <p className="mb-4 text-amber-900 font-medium leading-relaxed">
                    OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR
                    THE SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE TWELVE
                    (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED DOLLARS ($100.00).
                  </p>
                  <p className="mb-0 text-amber-900 font-medium leading-relaxed">
                    THE LIMITATIONS IN THIS SECTION APPLY REGARDLESS OF THE THEORY OF LIABILITY, WHETHER BASED
                    ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR ANY OTHER LEGAL THEORY.
                  </p>
                </div>
              </section>

              <section id="indemnification">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">16</span>
                  Indemnification
                </h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Start My Business Inc., its officers, directors,
                  employees, agents, affiliates, successors, and assigns from and against any and all claims,
                  liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees)
                  arising from or relating to:
                </p>
                <ul>
                  <li>Your use of the Services</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any applicable laws or regulations</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your User Content</li>
                  <li>Any claims by your customers, employees, or end users</li>
                </ul>
              </section>

              <section id="dispute">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">17</span>
                  Dispute Resolution &amp; Arbitration
                </h2>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                  <p className="text-amber-800 text-sm mb-0">
                    <strong>IMPORTANT:</strong> This section contains a binding arbitration clause and class action
                    waiver that affect your legal rights. Please read carefully.
                  </p>
                </div>

                <h3>17.1 Informal Resolution</h3>
                <p>
                  Before initiating any formal dispute resolution proceeding, you agree to first contact us at
                  legal@startmybusiness.us to attempt to resolve the dispute informally. We will attempt to resolve
                  the dispute within 60 days.
                </p>

                <h3>17.2 Binding Arbitration</h3>
                <p>
                  Any dispute, claim, or controversy arising out of or relating to these Terms or the Services,
                  including the determination of the scope or applicability of this agreement to arbitrate, shall
                  be determined by binding arbitration in Houston, Texas, before a single arbitrator, administered
                  by JAMS pursuant to its Comprehensive Arbitration Rules and Procedures.
                </p>

                <h3>17.3 Class Action Waiver</h3>
                <p>
                  YOU AND SMB VOICE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
                  INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
                  REPRESENTATIVE PROCEEDING.
                </p>

                <h3>17.4 Exceptions</h3>
                <p>
                  Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in
                  any court of competent jurisdiction to prevent the actual or threatened infringement of
                  intellectual property rights.
                </p>
              </section>

              <section id="governing-law">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">18</span>
                  Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Texas,
                  United States of America, without regard to its conflict of law provisions.
                </p>
                <p>
                  For any disputes not subject to arbitration, you consent to the exclusive jurisdiction of the
                  state and federal courts located in Harris County, Texas, and waive any objection to venue or
                  inconvenient forum.
                </p>
              </section>

              <section id="modifications">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">19</span>
                  Modifications to Terms
                </h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will provide notice of material
                  changes by posting the updated Terms on our website and updating the &ldquo;Effective Date&rdquo; above.
                  For material changes, we will also send an email notification to the address associated with
                  your account.
                </p>
                <p>
                  Your continued use of the Services after the effective date of any modifications constitutes
                  your acceptance of the updated Terms. If you do not agree to the modified Terms, you must
                  discontinue use of the Services.
                </p>
              </section>

              <section id="general">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">20</span>
                  General Provisions
                </h2>

                <h3>20.1 Entire Agreement</h3>
                <p>
                  These Terms, together with our Privacy Policy, SMS Terms, and any other policies referenced
                  herein, constitute the entire agreement between you and SMB Voice regarding the Services and
                  supersede all prior agreements, understandings, and communications.
                </p>

                <h3>20.2 Severability</h3>
                <p>
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining
                  provisions shall continue in full force and effect.
                </p>

                <h3>20.3 Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms shall not constitute a waiver of
                  such right or provision.
                </p>

                <h3>20.4 Assignment</h3>
                <p>
                  You may not assign or transfer these Terms or your rights hereunder without our prior written
                  consent. We may assign these Terms without restriction.
                </p>

                <h3>20.5 Force Majeure</h3>
                <p>
                  Neither party shall be liable for any failure or delay in performance due to circumstances
                  beyond its reasonable control, including but not limited to acts of God, natural disasters,
                  war, terrorism, labor disputes, government actions, or internet or telecommunications failures.
                </p>

                <h3>20.6 Notices</h3>
                <p>
                  All notices under these Terms shall be in writing and shall be deemed given when sent by email
                  to the addresses on file or by certified mail to the addresses provided during registration.
                </p>

                <h3>20.7 Headings</h3>
                <p>
                  Section headings are for convenience only and shall not affect the interpretation of these Terms.
                </p>
              </section>

              <section id="contact">
                <h2 className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold">21</span>
                  Contact Information
                </h2>
                <p>For questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-50 rounded-xl p-6 mt-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">General Inquiries</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>Company:</strong> Start My Business Inc.</li>
                        <li><strong>DBA:</strong> SMB Voice</li>
                        <li><strong>Phone:</strong> 888-534-4145</li>
                        <li><strong>Email:</strong> support@startmybusiness.us</li>
                        <li><strong>Website:</strong> voice.startmybusiness.us</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li><strong>Email:</strong> legal@startmybusiness.us</li>
                        <li><strong>Mail:</strong> Start My Business Inc.</li>
                        <li>Attn: Legal Department</li>
                        <li>Houston, Texas 77002</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Acceptance Box */}
            <div className="mt-12 bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] rounded-xl p-8 text-white">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-[#C9A227] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Acknowledgment</h3>
                  <p className="text-white/80 text-sm">
                    By using SMB Voice services, you acknowledge that you have read, understood, and agree to be
                    bound by these Terms of Service, our Privacy Policy, and our SMS Terms and Conditions. You
                    further acknowledge the limitations regarding emergency services (911) and agree to maintain
                    alternative means of accessing emergency services.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                    </Link>
                    <Link
                      href="/sms-terms"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      SMS Terms
                    </Link>
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
