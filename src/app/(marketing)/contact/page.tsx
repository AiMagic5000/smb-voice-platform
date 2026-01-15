"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Talk to a real person",
    value: "888-534-4145",
    href: "tel:888-534-4145",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "We reply within 24 hours",
    value: "support@startmybusiness.us",
    href: "mailto:support@startmybusiness.us",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're here to help",
    value: "24/7 Support Available",
    href: null,
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Based in the USA",
    value: "United States",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] text-white">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-semibold mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              We&apos;re Here to Help
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Questions? Problems? We&apos;ve got answers. Call us anytime or send a
              message below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section bg-white">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {method.href ? (
                  <a
                    href={method.href}
                    className="block bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#FDF8E8] flex items-center justify-center mb-4">
                      <method.icon className="h-7 w-7 text-[#C9A227]" />
                    </div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {method.description}
                    </p>
                    <p className="font-semibold text-[#1E3A5F]">
                      {method.value}
                    </p>
                  </a>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                    <div className="w-14 h-14 rounded-2xl bg-[#FDF8E8] flex items-center justify-center mb-4">
                      <method.icon className="h-7 w-7 text-[#C9A227]" />
                    </div>
                    <h3 className="font-bold text-[#1E3A5F] mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {method.description}
                    </p>
                    <p className="font-semibold text-[#1E3A5F]">
                      {method.value}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section bg-gray-50">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1E3A5F] mb-6">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form and we&apos;ll get back to you within 24 hours. Or
                just call us - we love talking to people!
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1E3A5F] mb-4">
                  Why Call is Faster
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">1</span>
                    </div>
                    <span>Real humans answer 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">2</span>
                    </div>
                    <span>Average wait time under 30 seconds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">3</span>
                    </div>
                    <span>We can help set up your phone on the call</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <form className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">How can we help?</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your business and what you need..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 btn-primary text-lg gap-2"
                  >
                    Send Message
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
