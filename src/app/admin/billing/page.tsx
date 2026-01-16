"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Search,
  TrendingUp,
  CreditCard,
  Receipt,
  Download,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Invoice {
  id: string;
  organizationName: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

interface BillingStats {
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  pendingInvoices: number;
}

export default function AdminBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchBilling() {
      try {
        const response = await fetch("/api/admin/billing");
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices || []);
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch billing:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBilling();
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      paid: { bg: "bg-green-500/20", text: "text-green-400" },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
      failed: { bg: "bg-red-500/20", text: "text-red-400" },
      refunded: { bg: "bg-purple-500/20", text: "text-purple-400" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-slate-400 mt-1">Revenue and invoice management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-700 text-slate-300">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ${((stats?.totalRevenue || 0) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-slate-400">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                ${((stats?.monthlyRevenue || 0) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-slate-400">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.activeSubscriptions || 0}
              </p>
              <p className="text-sm text-slate-400">Active Subscriptions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.pendingInvoices || 0}
              </p>
              <p className="text-sm text-slate-400">Pending Invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Invoices Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4">
                        <span className="text-white font-mono text-sm">
                          #{invoice.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {invoice.organizationName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white font-medium">
                          ${(invoice.amount / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
