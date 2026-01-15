"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Owner, Johnson Consulting",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content:
      "SMB Voice changed how I do business. The AI answers calls when I'm with clients, and I never miss a lead. Best $7.95 I spend each month!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Founder, Chen Marketing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content:
      "I was paying $80/month for a phone system I barely used. SMB Voice gives me everything for less than $8. The setup took 5 minutes.",
    rating: 5,
  },
  {
    name: "Lisa Rodriguez",
    role: "Real Estate Agent",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content:
      "My clients think I have a full office staff. The AI receptionist is so good, people can't tell it's not a real person!",
    rating: 5,
  },
  {
    name: "David Williams",
    role: "Contractor, Williams Home Services",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content:
      "Simple, affordable, and it just works. I can take calls from the job site, and voicemails come straight to my email. Exactly what I needed.",
    rating: 5,
  },
];

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "99%", label: "Would Recommend" },
  { value: "24/7", label: "Support Available" },
];

export function Testimonials() {
  return (
    <section className="section bg-white" id="testimonials">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#FDF8E8] text-[#9E7E1E] text-sm font-semibold mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E3A5F] mb-6">
            Loved by
            <br />
            <span className="text-gradient-gold">Small Business Owners</span>
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of business owners who switched to SMB Voice and never
            looked back.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-gray-50"
            >
              <p className="text-3xl lg:text-4xl font-bold text-[#C9A227] mb-2">
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <Quote className="h-10 w-10 text-[#C9A227]/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-[#C9A227] fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback className="bg-[#1E3A5F] text-white font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-[#1E3A5F]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">
            Ready to join them?{" "}
            <span className="font-semibold text-[#1E3A5F]">
              Start your free trial today.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
