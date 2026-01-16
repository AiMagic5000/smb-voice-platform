"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Search,
  MoreVertical,
  Phone,
  CreditCard,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  phoneCount: number;
  createdAt: string;
  status: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/admin/clients");
        if (response.ok) {
          const data = await response.json();
          setClients(data.clients || []);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierBadge = (tier: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      starter: { bg: "bg-slate-500/20", text: "text-slate-400" },
      professional: { bg: "bg-[#C9A227]/20", text: "text-[#C9A227]" },
      enterprise: { bg: "bg-purple-500/20", text: "text-purple-400" },
    };
    const badge = badges[tier] || badges.starter;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {tier}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 mt-1">Manage business clients and organizations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800 border-slate-700 text-white w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
              <p className="text-sm text-slate-400">Total Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {clients.filter((c) => c.status === "active").length}
              </p>
              <p className="text-sm text-slate-400">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {clients.filter((c) => c.tier === "professional").length}
              </p>
              <p className="text-sm text-slate-400">Professional</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {clients.filter((c) => c.tier === "enterprise").length}
              </p>
              <p className="text-sm text-slate-400">Enterprise</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No clients found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Tier
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Phone Numbers
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Joined
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-[#C9A227]" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{client.name}</p>
                            <p className="text-sm text-slate-400">{client.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getTierBadge(client.tier)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {client.phoneCount}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(client.status)}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <Phone className="h-4 w-4 mr-2" />
                              Phone Numbers
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-slate-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
