"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  Search,
  MoreVertical,
  PhoneCall,
  MessageSquare,
  Trash2,
  Building2,
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

interface PhoneNumber {
  id: string;
  number: string;
  friendlyName: string | null;
  type: string;
  status: string;
  voiceEnabled: boolean;
  smsEnabled: boolean;
  organizationName: string | null;
  createdAt: string;
}

export default function AdminPhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPhoneNumbers() {
      try {
        const response = await fetch("/api/admin/phone-numbers");
        if (response.ok) {
          const data = await response.json();
          setPhoneNumbers(data.phoneNumbers || []);
        }
      } catch (error) {
        console.error("Failed to fetch phone numbers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhoneNumbers();
  }, []);

  const filteredNumbers = phoneNumbers.filter(
    (phone) =>
      phone.number?.includes(searchTerm) ||
      phone.friendlyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      local: { bg: "bg-blue-500/20", text: "text-blue-400" },
      "toll-free": { bg: "bg-green-500/20", text: "text-green-400" },
      mobile: { bg: "bg-purple-500/20", text: "text-purple-400" },
    };
    const badge = badges[type] || badges.local;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text} capitalize`}>
        {type}
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
          <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
          <p className="text-slate-400 mt-1">Manage all phone numbers across clients</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search numbers..."
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
              <Phone className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{phoneNumbers.length}</p>
              <p className="text-sm text-slate-400">Total Numbers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Phone className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {phoneNumbers.filter((p) => p.status === "active").length}
              </p>
              <p className="text-sm text-slate-400">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
              <PhoneCall className="h-6 w-6 text-[#C9A227]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {phoneNumbers.filter((p) => p.voiceEnabled).length}
              </p>
              <p className="text-sm text-slate-400">Voice Enabled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {phoneNumbers.filter((p) => p.smsEnabled).length}
              </p>
              <p className="text-sm text-slate-400">SMS Enabled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phone Numbers Table */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Phone Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredNumbers.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No phone numbers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Capabilities
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNumbers.map((phone) => (
                    <tr
                      key={phone.id}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-mono font-medium">
                            {formatPhoneNumber(phone.number)}
                          </p>
                          {phone.friendlyName && (
                            <p className="text-sm text-slate-400">{phone.friendlyName}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getTypeBadge(phone.type)}</td>
                      <td className="py-3 px-4">
                        {phone.organizationName ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            {phone.organizationName}
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {phone.voiceEnabled && (
                            <PhoneCall className="h-4 w-4 text-green-400" title="Voice enabled" />
                          )}
                          {phone.smsEnabled && (
                            <MessageSquare className="h-4 w-4 text-blue-400" title="SMS enabled" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(phone.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <Phone className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                              <Building2 className="h-4 w-4 mr-2" />
                              Reassign
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:bg-slate-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Release
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
