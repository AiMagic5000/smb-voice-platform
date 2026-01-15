"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Building2,
  Plus,
  Phone,
  Users,
  Clock,
  Settings,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Globe,
  PhoneCall,
} from "lucide-react";

type LocationStatus = "active" | "inactive" | "setup";

type Location = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  timezone: string;
  status: LocationStatus;
  extensions: number;
  activeUsers: number;
  mainNumber: string;
  businessHoursId?: string;
  holidayScheduleId?: string;
  ivrId?: string;
  isHeadquarters: boolean;
};

const mockLocations: Location[] = [
  {
    id: "loc_1",
    name: "Headquarters",
    address: "123 Business Ave, Suite 100",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    phone: "+1 (555) 100-0000",
    timezone: "America/New_York",
    status: "active",
    extensions: 45,
    activeUsers: 38,
    mainNumber: "+1 (555) 100-0000",
    businessHoursId: "hours_1",
    holidayScheduleId: "hol_1",
    ivrId: "ivr_main",
    isHeadquarters: true,
  },
  {
    id: "loc_2",
    name: "West Coast Office",
    address: "456 Tech Blvd",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    phone: "+1 (555) 200-0000",
    timezone: "America/Los_Angeles",
    status: "active",
    extensions: 28,
    activeUsers: 24,
    mainNumber: "+1 (555) 200-0000",
    businessHoursId: "hours_2",
    isHeadquarters: false,
  },
  {
    id: "loc_3",
    name: "Chicago Branch",
    address: "789 Commerce St",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    country: "United States",
    phone: "+1 (555) 300-0000",
    timezone: "America/Chicago",
    status: "active",
    extensions: 15,
    activeUsers: 12,
    mainNumber: "+1 (555) 300-0000",
    isHeadquarters: false,
  },
  {
    id: "loc_4",
    name: "UK Office",
    address: "10 Piccadilly Circus",
    city: "London",
    state: "",
    zip: "W1J 0DA",
    country: "United Kingdom",
    phone: "+44 20 7123 4567",
    timezone: "Europe/London",
    status: "setup",
    extensions: 0,
    activeUsers: 0,
    mainNumber: "+44 20 7123 4567",
    isHeadquarters: false,
  },
];

const getStatusIcon = (status: LocationStatus) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "inactive":
      return <XCircle className="h-5 w-5 text-gray-400" />;
    case "setup":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
};

const getStatusBadge = (status: LocationStatus) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
    case "inactive":
      return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">Inactive</Badge>;
    case "setup":
      return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Setup</Badge>;
  }
};

export function MultiLocationManager() {
  const [locations, setLocations] = useState(mockLocations);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const stats = {
    total: locations.length,
    active: locations.filter((l) => l.status === "active").length,
    totalExtensions: locations.reduce((acc, l) => acc + l.extensions, 0),
    totalUsers: locations.reduce((acc, l) => acc + l.activeUsers, 0),
  };

  const deleteLocation = (id: string) => {
    setLocations(locations.filter((l) => l.id !== id));
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF8E8] dark:bg-[#C9A227]/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Locations</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Extensions</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalExtensions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Users</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1E3A5F] dark:text-white">All Locations</h3>
        <Button className="btn-primary gap-2" onClick={() => setShowAddLocation(true)}>
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {locations.map((location, i) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`cursor-pointer hover:shadow-md transition-shadow ${
              location.status === "inactive" ? "opacity-60" : ""
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      location.isHeadquarters
                        ? "bg-[#1E3A5F] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-[#1E3A5F] dark:text-white"
                    }`}>
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#1E3A5F] dark:text-white">
                          {location.name}
                        </h4>
                        {location.isHeadquarters && (
                          <Badge className="bg-[#FDF8E8] text-[#C9A227]">HQ</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {location.city}, {location.state || location.country}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(location.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <PhoneCall className="h-4 w-4" />
                    <span>{location.mainNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{location.timezone}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500">Extensions</p>
                    <p className="text-lg font-bold text-[#1E3A5F] dark:text-white">{location.extensions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Users</p>
                    <p className="text-lg font-bold text-[#1E3A5F] dark:text-white">{location.activeUsers}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {!location.isHeadquarters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Location Dialog */}
      {showAddLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Add New Location
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location Name</label>
                    <Input placeholder="e.g., Downtown Office" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <Input placeholder="123 Main Street" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <Input placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State/Province</label>
                      <Input placeholder="State" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
                      <Input placeholder="12345" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country</label>
                      <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Main Phone Number</label>
                    <Input placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option>America/New_York</option>
                      <option>America/Chicago</option>
                      <option>America/Denver</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowAddLocation(false)}>Cancel</Button>
                  <Button className="btn-primary">Add Location</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
