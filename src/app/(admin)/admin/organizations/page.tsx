"use client";

import { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Users,
  Phone,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock organization data
const mockOrganizations = [
  {
    id: "org_1",
    name: "Start My Business Inc.",
    type: "Enterprise",
    clients: 47,
    users: 156,
    phoneNumbers: 128,
    status: "active",
    createdAt: "2025-01-01"
  },
  {
    id: "org_2",
    name: "Partner Agency A",
    type: "Reseller",
    clients: 12,
    users: 45,
    phoneNumbers: 38,
    status: "active",
    createdAt: "2025-06-15"
  },
  {
    id: "org_3",
    name: "White Label Corp",
    type: "White Label",
    clients: 23,
    users: 89,
    phoneNumbers: 67,
    status: "active",
    createdAt: "2025-09-01"
  },
];

const typeColors: Record<string, string> = {
  Enterprise: "bg-purple-100 text-purple-700",
  Reseller: "bg-blue-100 text-blue-700",
  "White Label": "bg-amber-100 text-amber-700"
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  suspended: "bg-red-100 text-red-800"
};

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations] = useState(mockOrganizations);

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500 mt-1">Manage multi-tenant organizations and resellers</p>
        </div>
        <Button className="bg-[#C9A227] hover:bg-[#B8911F] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Organizations</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Clients</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {organizations.reduce((sum, o) => sum + o.clients, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {organizations.reduce((sum, o) => sum + o.users, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Phone Numbers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {organizations.reduce((sum, o) => sum + o.phoneNumbers, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Clients
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone Numbers
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{org.name}</p>
                        <p className="text-sm text-gray-500">ID: {org.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[org.type]}`}>
                      {org.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Users className="h-4 w-4 text-gray-400" />
                      {org.clients}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{org.users}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {org.phoneNumbers}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[org.status]}`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
