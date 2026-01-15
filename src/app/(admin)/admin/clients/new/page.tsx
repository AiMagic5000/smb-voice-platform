"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    plan: "starter",
    billingEmail: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    router.push("/admin/clients");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const plans = [
    { id: "starter", name: "Starter", price: "$7.95/mo", description: "1 phone number, 2 users" },
    { id: "professional", name: "Professional", price: "$19.95/mo", description: "3 phone numbers, 5 users" },
    { id: "business", name: "Business", price: "$39.95/mo", description: "10 phone numbers, 15 users" },
    { id: "enterprise", name: "Enterprise", price: "Custom", description: "Unlimited" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
          <p className="text-gray-500">Create a new client account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Primary contact"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Business Ave, Suite 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                <Input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Select Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, plan: plan.id }))}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  formData.plan === plan.id
                    ? "border-[#C9A227] bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-semibold text-gray-900">{plan.name}</p>
                <p className="text-[#C9A227] font-medium mt-1">{plan.price}</p>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Email</label>
            <Input
              name="billingEmail"
              type="email"
              value={formData.billingEmail}
              onChange={handleChange}
              placeholder="billing@company.com (leave empty to use contact email)"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/clients">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#C9A227] hover:bg-[#B8911F] text-white min-w-[150px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Client"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
