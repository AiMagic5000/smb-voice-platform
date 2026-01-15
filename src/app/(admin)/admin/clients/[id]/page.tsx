"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Users,
  Settings,
  Trash2,
  Edit,
  Plus,
  PhoneCall,
  Voicemail,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock client data
const mockClientDetail = {
  id: "1",
  name: "ABC Corporation",
  email: "admin@abccorp.com",
  phone: "+1 (555) 123-4567",
  plan: "Professional",
  status: "active",
  address: "123 Business Ave, Suite 100",
  city: "New York",
  state: "NY",
  zip: "10001",
  createdAt: "2026-01-10",
  billingEmail: "billing@abccorp.com",
  monthlySpend: 23.85,
  phoneNumbers: [
    { number: "+1 (555) 123-4567", type: "Main", status: "active" },
    { number: "+1 (555) 123-4568", type: "Sales", status: "active" },
    { number: "+1 (800) 555-1234", type: "Toll Free", status: "active" },
  ],
  users: [
    { name: "John Smith", email: "john@abccorp.com", role: "Admin", status: "active" },
    { name: "Jane Doe", email: "jane@abccorp.com", role: "User", status: "active" },
    { name: "Bob Wilson", email: "bob@abccorp.com", role: "User", status: "active" },
  ],
  stats: {
    totalCalls: 1247,
    avgCallDuration: "4:12",
    voicemails: 34,
    missedCalls: 89
  }
};

export default function ClientDetailPage() {
  const params = useParams();
  const [client] = useState(mockClientDetail);
  const [isEditing, setIsEditing] = useState(false);

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-500">Client ID: {params.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <PhoneCall className="h-4 w-4" />
            <span className="text-sm">Total Calls</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{client.stats.totalCalls}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Avg Duration</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{client.stats.avgCallDuration}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Voicemail className="h-4 w-4" />
            <span className="text-sm">Voicemails</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{client.stats.voicemails}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm">Monthly Spend</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${client.monthlySpend}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="phone-numbers">Phone Numbers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Company Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{client.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{client.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{client.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="text-gray-900 mt-1">{client.address}</p>
                  <p className="text-gray-900">{client.city}, {client.state} {client.zip}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Created</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="phone-numbers" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
              <Button className="bg-[#C9A227] hover:bg-[#B8911F] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Number
              </Button>
            </div>
            <div className="divide-y divide-gray-200">
              {client.phoneNumbers.map((phone, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{phone.number}</p>
                      <p className="text-sm text-gray-500">{phone.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[phone.status]}`}>
                      {phone.status}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <Button className="bg-[#C9A227] hover:bg-[#B8911F] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>
            <div className="divide-y divide-gray-200">
              {client.users.map((user, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{user.role}</span>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Current Plan</label>
                  <p className="text-gray-900 font-medium mt-1">{client.plan}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Monthly Cost</label>
                  <p className="text-gray-900 font-medium mt-1">${client.monthlySpend}/month</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Billing Email</label>
                  <p className="text-gray-900 mt-1">{client.billingEmail}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Next Invoice</label>
                  <p className="text-gray-900 mt-1">February 1, 2026</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Payment Method</label>
                  <p className="text-gray-900 mt-1">•••• •••• •••• 4242</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Auto-renew Subscription</p>
                  <p className="text-sm text-gray-500">Automatically renew at the end of billing period</p>
                </div>
                <Input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email updates about account activity</p>
                </div>
                <Input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900">API Access</p>
                  <p className="text-sm text-gray-500">Allow API access for integrations</p>
                </div>
                <Input type="checkbox" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
