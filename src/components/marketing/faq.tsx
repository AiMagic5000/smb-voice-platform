"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

const faqs = [
  {
    question: "How fast can I get started?",
    answer:
      "5 minutes. Sign up, pick your phone number, and download the app. That's it. Your new business phone is ready to use right away.",
  },
  {
    question: "Can I keep my current phone number?",
    answer:
      "Yes! We can move your existing phone number to SMB Voice for free. It takes about 1-2 weeks for the transfer, but you can start using a new number right away while you wait.",
  },
  {
    question: "Do I need special equipment?",
    answer:
      "No. Just use our free app on your iPhone, Android phone, or computer. Your existing devices work perfectly. No desk phones or hardware required.",
  },
  {
    question: "Is there a contract?",
    answer:
      "No contracts ever. Pay month-to-month and cancel anytime with one click. No cancellation fees, no questions asked.",
  },
  {
    question: "What if I need help?",
    answer:
      "Call us at 888-534-4145. Real humans answer 24 hours a day, 7 days a week. We're based in the USA and we actually care about helping you.",
  },
  {
    question: "How does the AI receptionist work?",
    answer:
      "When you can't answer, our AI picks up. It greets callers professionally, answers basic questions about your business, takes messages, and sends them to your email. It sounds natural and callers often can't tell it's AI!",
  },
  {
    question: "Can I have multiple people on my account?",
    answer:
      "Yes! Your plan includes 5 extensions. Each person gets their own extension and can use the app on their phone. Need more? Just ask us.",
  },
  {
    question: "What's included in the $7.95/month?",
    answer:
      "Everything. Business phone number, AI receptionist, mobile apps, voicemail to email, call forwarding, call recording, 500 minutes, and 24/7 support. No hidden fees, no surprises.",
  },
  {
    question: "Is my calls private and secure?",
    answer:
      "Absolutely. All calls are encrypted. We take security seriously. Your conversations stay between you and your customers.",
  },
  {
    question: "What happens if I go over 500 minutes?",
    answer:
      "Most small businesses never use more than 500 minutes. If you do, extra minutes are just $0.02 each. We'll let you know before you go over so there are no surprises.",
  },
];

export function FAQ() {
  return (
    <section className="section bg-gray-50" id="faq">
      <div className="container-narrow">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#FDF8E8] text-[#9E7E1E] text-sm font-semibold mb-4">
            Questions & Answers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
            Got Questions?
            <br />
            <span className="text-gradient-gold">We Have Answers.</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about SMB Voice. Can&apos;t find what you&apos;re
            looking for? Call us at 888-534-4145.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white rounded-2xl border border-gray-100 px-6 shadow-sm data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-[#1E3A5F] font-semibold text-lg hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center">
              <MessageCircleQuestion className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E3A5F]">Still have questions?</p>
              <p className="text-sm text-gray-500">
                Call us at{" "}
                <a
                  href="tel:888-534-4145"
                  className="text-[#C9A227] hover:underline font-medium"
                >
                  888-534-4145
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
