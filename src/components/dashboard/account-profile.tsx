"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Save,
  Shield,
  Key,
  Clock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Download,
} from "lucide-react";

type AccountProfile = {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  timezone: string;
  language: string;

  // Company Info
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
  industry: string;
  companySize: string;

  // Account Info
  accountId: string;
  plan: string;
  status: "active" | "trial" | "suspended";
  createdAt: string;
  twoFactorEnabled: boolean;
};

const defaultProfile: AccountProfile = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@acmecorp.com",
  phone: "+1 (555) 123-4567",
  timezone: "America/New_York",
  language: "en",
  companyName: "ACME Corporation",
  companyWebsite: "https://acmecorp.com",
  companyAddress: "123 Business Ave",
  companyCity: "New York",
  companyState: "NY",
  companyZip: "10001",
  companyCountry: "United States",
  industry: "Technology",
  companySize: "50-100",
  accountId: "acct_1234567890",
  plan: "Business Pro",
  status: "active",
  createdAt: "2024-01-15T00:00:00Z",
  twoFactorEnabled: true,
};

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Professional Services",
  "Real Estate",
  "Education",
  "Non-Profit",
  "Other",
];

const companySizes = [
  "1-10",
  "11-50",
  "50-100",
  "100-500",
  "500+",
];

export function AccountProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [activeTab, setActiveTab] = useState<"personal" | "company" | "security" | "data">("personal");

  const updateProfile = <K extends keyof AccountProfile>(key: K, value: AccountProfile[K]) => {
    setProfile({ ...profile, [key]: value });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#1E3A5F] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile.firstName[0]}{profile.lastName[0]}
              </span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center text-white">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-500">{profile.companyName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={
                profile.status === "active" ? "bg-green-100 text-green-700" :
                profile.status === "trial" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
              <Badge variant="outline">{profile.plan}</Badge>
            </div>
          </div>
        </div>
        <Button className="btn-primary gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Account Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500">Account ID</p>
                <p className="font-mono text-sm text-[#1E3A5F] dark:text-white">{profile.accountId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="font-medium text-[#1E3A5F] dark:text-white">{profile.plan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium text-[#1E3A5F] dark:text-white">{formatDate(profile.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">2FA Status</p>
                <p className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Enabled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: "personal", label: "Personal Info", icon: User },
          { id: "company", label: "Company", icon: Building2 },
          { id: "security", label: "Security", icon: Shield },
          { id: "data", label: "Data & Privacy", icon: Download },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 shadow-sm font-medium"
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "personal" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => updateProfile("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => updateProfile("lastName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => updateProfile("phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={profile.timezone}
                    onChange={(e) => updateProfile("timezone", e.target.value)}
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={profile.language}
                    onChange={(e) => updateProfile("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "company" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={profile.companyName}
                    onChange={(e) => updateProfile("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    type="url"
                    value={profile.companyWebsite}
                    onChange={(e) => updateProfile("companyWebsite", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={profile.industry}
                    onChange={(e) => updateProfile("industry", e.target.value)}
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company Size</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                    value={profile.companySize}
                    onChange={(e) => updateProfile("companySize", e.target.value)}
                  >
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white mb-4">Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={profile.companyAddress}
                    onChange={(e) => updateProfile("companyAddress", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={profile.companyCity}
                    onChange={(e) => updateProfile("companyCity", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State/Province</label>
                  <Input
                    value={profile.companyState}
                    onChange={(e) => updateProfile("companyState", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                  <Input
                    value={profile.companyZip}
                    onChange={(e) => updateProfile("companyZip", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Input
                    value={profile.companyCountry}
                    onChange={(e) => updateProfile("companyCountry", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">Password</h3>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#1E3A5F]" />
                  <div>
                    <h3 className="font-bold text-[#1E3A5F] dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white">Windows - Chrome</p>
                    <p className="text-sm text-gray-500">New York, NY • Current session</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white">iPhone - Safari</p>
                    <p className="text-sm text-gray-500">New York, NY • 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "data" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1E3A5F] dark:text-white mb-4 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Your Data
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Download a copy of all your data including calls, recordings, contacts, and settings.
              </p>
              <Button variant="outline">Request Data Export</Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-900">
            <CardContent className="p-6">
              <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1E3A5F] dark:text-white">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-300">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
