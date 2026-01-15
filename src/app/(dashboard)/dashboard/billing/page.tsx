"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  Phone,
  Users,
  Voicemail,
  AlertCircle,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";

interface BillingData {
  subscription: {
    id?: string;
    plan: string;
    planId: string;
    status: string;
    billingCycle: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    trialEndsAt?: string;
    basePrice: number;
    nextBillingDate?: string;
  };
  phoneNumbers: {
    local: number;
    tollFree: number;
    total: number;
    included: number | string;
  };
  usage: {
    current: {
      aiMinutes: number;
      smsOutbound: number;
      smsInbound: number;
      callRecording: number;
      internationalMinutes: number;
    };
    aiMinutesIncluded: number | string;
    charges: number;
  };
  charges: {
    base: number;
    additionalNumbers: number;
    tollFree: number;
    usage: number;
    total: number;
  };
  upcomingInvoice?: {
    amountDue: number;
    periodEnd: string;
  };
  recentInvoices: {
    id: string;
    amount: number;
    status: string;
    date: string;
    invoiceUrl?: string;
    pdfUrl?: string;
  }[];
  paymentMethod?: {
    id: string;
    type: string;
    last4: string;
    brand: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  pricing: Record<string, { monthly: number; name: string; phoneNumbers: number; users: number; aiMinutes: number }>;
  usagePricing: Record<string, number>;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await fetch("/api/billing");
      if (!response.ok) {
        throw new Error("Failed to fetch billing data");
      }
      const data = await response.json();
      setBillingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createBillingPortal" }),
      });
      const data = await response.json();
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    } catch (err) {
      console.error("Failed to open billing portal:", err);
    } finally {
      setPortalLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "trialing":
        return <Badge className="bg-[#C9A227] text-white">Trial</Badge>;
      case "past_due":
        return <Badge className="bg-red-500 text-white">Past Due</Badge>;
      case "canceled":
        return <Badge className="bg-gray-500 text-white">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <>
        <Header
          title="Billing"
          description="Manage your subscription and payment methods"
        />
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
        </div>
      </>
    );
  }

  if (error || !billingData) {
    return (
      <>
        <Header
          title="Billing"
          description="Manage your subscription and payment methods"
        />
        <div className="p-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error || "Failed to load billing data"}</p>
              </div>
              <Button onClick={fetchBillingData} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const { subscription, phoneNumbers, usage, charges, recentInvoices, paymentMethod, upcomingInvoice } = billingData;
  const aiMinutesIncluded = typeof usage.aiMinutesIncluded === "number" ? usage.aiMinutesIncluded : 0;
  const minutesPercentage = aiMinutesIncluded > 0
    ? (usage.current.aiMinutes / aiMinutesIncluded) * 100
    : 0;
  const numbersIncluded = typeof phoneNumbers.included === "number" ? phoneNumbers.included : 999;

  return (
    <>
      <Header
        title="Billing"
        description="Manage your subscription and payment methods"
      />

      <div className="p-8 space-y-8">
        {/* Trial Banner */}
        {subscription.status === "trialing" && subscription.trialEndsAt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 border-[#C9A227]/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-[#C9A227]" />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Free Trial Active</p>
                      <p className="text-sm text-gray-600">
                        Your trial ends on {formatDate(subscription.trialEndsAt)}
                      </p>
                    </div>
                  </div>
                  <Button onClick={openBillingPortal} className="btn-primary">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2D4A6F] p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{subscription.plan}</h2>
                    {getStatusBadge(subscription.status)}
                    {subscription.cancelAtPeriodEnd && (
                      <Badge variant="outline" className="text-white border-white/50">
                        Canceling
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70">
                    {subscription.currentPeriodEnd
                      ? `Your plan renews on ${formatDate(subscription.currentPeriodEnd)}`
                      : subscription.nextBillingDate
                      ? `Next billing date: ${subscription.nextBillingDate}`
                      : "No active subscription"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{formatCurrency(subscription.basePrice)}</p>
                  <p className="text-white/70">per month</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">AI Minutes</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-[#1E3A5F]">
                        {usage.current.aiMinutes}
                      </span>
                      <span className="text-gray-400">
                        /{usage.aiMinutesIncluded === "unlimited" ? "∞" : usage.aiMinutesIncluded}
                      </span>
                    </div>
                    {usage.aiMinutesIncluded !== "unlimited" && (
                      <span className="text-sm text-gray-500">
                        {Math.round(minutesPercentage)}%
                      </span>
                    )}
                  </div>
                  {usage.aiMinutesIncluded !== "unlimited" && (
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          minutesPercentage > 90
                            ? "bg-red-500"
                            : minutesPercentage > 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(minutesPercentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Phone Numbers</span>
                  </div>
                  <p>
                    <span className="text-2xl font-bold text-[#1E3A5F]">
                      {phoneNumbers.total}
                    </span>
                    <span className="text-gray-400">
                      /{phoneNumbers.included === "unlimited" ? "∞" : phoneNumbers.included}
                    </span>
                  </p>
                  {phoneNumbers.tollFree > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      ({phoneNumbers.tollFree} toll-free)
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Voicemail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">SMS Sent</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {usage.current.smsOutbound}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Current Charges</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {formatCurrency(charges.total)}
                  </p>
                  {charges.usage > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Includes {formatCurrency(charges.usage)} usage
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Invoice */}
        {upcomingInvoice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-[#1E3A5F]">Upcoming Invoice</p>
                      <p className="text-sm text-gray-600">
                        Due on {formatDate(upcomingInvoice.periodEnd)}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#1E3A5F]">
                    {formatCurrency(upcomingInvoice.amountDue)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase">
                        {paymentMethod.brand}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1E3A5F]">
                        •••• •••• •••• {paymentMethod.last4}
                      </p>
                      {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                        <p className="text-sm text-gray-500">
                          Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" onClick={openBillingPortal} disabled={portalLoading}>
                    {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Card"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <p className="text-gray-500">No payment method on file</p>
                  <Button onClick={openBillingPortal} disabled={portalLoading}>
                    {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Payment Method"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
                  <Calendar className="h-5 w-5" />
                  Billing History
                </CardTitle>
                <Button variant="outline" size="sm" className="gap-2" onClick={openBillingPortal}>
                  <ExternalLink className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentInvoices.length > 0 ? (
                <div className="space-y-2">
                  {recentInvoices.map((invoice, i) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          invoice.status === "paid" ? "bg-green-100" :
                          invoice.status === "failed" ? "bg-red-100" : "bg-gray-100"
                        }`}>
                          {getInvoiceStatusIcon(invoice.status)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3A5F]">
                            {invoice.id}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(invoice.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-[#1E3A5F]">
                          {formatCurrency(invoice.amount)}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            invoice.status === "paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : invoice.status === "failed"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                        {invoice.pdfUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No invoices yet</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Manage Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[#1E3A5F]">
                    Manage Your Subscription
                  </h3>
                  <p className="text-sm text-gray-600">
                    Change your plan, update billing info, or view detailed usage.
                  </p>
                </div>
                <Button onClick={openBillingPortal} disabled={portalLoading} className="btn-primary gap-2">
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Open Billing Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#FDF8E8] border-[#C9A227]/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#C9A227] mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#1E3A5F]">
                      Need help with billing?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Our support team is available 24/7 to answer your questions.
                    </p>
                  </div>
                </div>
                <Button className="btn-primary">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
