"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Filter,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock client data
const mockClients = [
  {
    id: "1",
    name: "ABC Corporation",
    email: "admin@abccorp.com",
    phone: "+1 (555) 123-4567",
    plan: "Professional",
    status: "active",
    phoneNumbers: 3,
    users: 5,
    createdAt: "2026-01-10"
  },
  {
    id: "2",
    name: "XYZ Industries",
    email: "contact@xyz.com",
    phone: "+1 (555) 234-5678",
    plan: "Business",
    status: "active",
    phoneNumbers: 5,
    users: 12,
    createdAt: "2026-01-08"
  },
  {
    id: "3",
    name: "Tech Startup LLC",
    email: "hello@techstartup.io",
    phone: "+1 (555) 345-6789",
    plan: "Starter",
    status: "active",
    phoneNumbers: 1,
    users: 2,
    createdAt: "2026-01-05"
  },
  {
    id: "4",
    name: "Global Services Inc",
    email: "info@globalservices.com",
    phone: "+1 (555) 456-7890",
    plan: "Enterprise",
    status: "active",
    phoneNumbers: 15,
    users: 50,
    createdAt: "2026-01-01"
  },
  {
    id: "5",
    name: "Local Business Co",
    email: "owner@localbiz.com",
    phone: "+1 (555) 567-8901",
    plan: "Starter",
    status: "trial",
    phoneNumbers: 1,
    users: 1,
    createdAt: "2026-01-14"
  },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trial: "bg-blue-100 text-blue-800",
  suspended: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800"
};

const planColors: Record<string, string> = {
  Starter: "bg-gray-100 text-gray-700",
  Professional: "bg-blue-100 text-blue-700",
  Business: "bg-purple-100 text-purple-700",
  Enterprise: "bg-amber-100 text-amber-700"
};

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients] = useState(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your client accounts</p>
        </div>
        <Link href="/admin/clients/new">
          <Button className="bg-[#C9A227] hover:bg-[#B8911F] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Phone Numbers
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${planColors[client.plan]}`}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {client.phoneNumbers}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {client.users}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/clients/${client.id}`}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
