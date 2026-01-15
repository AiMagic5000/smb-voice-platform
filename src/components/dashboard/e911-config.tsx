"use client";

import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Shield,
  Building,
  User,
  Check,
  Edit2,
  Save,
  X,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface E911Location {
  id: string;
  phoneNumber: string;
  name: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  callerName: string;
  isVerified: boolean;
  lastUpdated: string;
}

// Mock E911 locations
const mockLocations: E911Location[] = [
  {
    id: "1",
    phoneNumber: "+1 (555) 123-4567",
    name: "Main Office",
    address: {
      street1: "123 Business Ave",
      street2: "Suite 100",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
    },
    callerName: "Acme Corp",
    isVerified: true,
    lastUpdated: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    phoneNumber: "+1 (555) 987-6543",
    name: "Remote Office",
    address: {
      street1: "456 Tech Blvd",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
    },
    callerName: "Acme Corp - Austin",
    isVerified: true,
    lastUpdated: "2024-01-10T14:20:00Z",
  },
  {
    id: "3",
    phoneNumber: "+1 (555) 456-7890",
    name: "Home Office",
    address: {
      street1: "789 Residential St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    callerName: "John Smith - Remote",
    isVerified: false,
    lastUpdated: "2024-01-18T09:15:00Z",
  },
];

export function E911Config() {
  const [locations, setLocations] = useState<E911Location[]>(mockLocations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLocation, setNewLocation] = useState({
    phoneNumber: "",
    name: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
    callerName: "",
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddLocation = () => {
    if (
      !newLocation.phoneNumber ||
      !newLocation.street1 ||
      !newLocation.city
    ) {
      return;
    }

    const newEntry: E911Location = {
      id: Date.now().toString(),
      phoneNumber: newLocation.phoneNumber,
      name: newLocation.name || "New Location",
      address: {
        street1: newLocation.street1,
        street2: newLocation.street2 || undefined,
        city: newLocation.city,
        state: newLocation.state,
        zip: newLocation.zip,
        country: "USA",
      },
      callerName: newLocation.callerName || "Business",
      isVerified: false,
      lastUpdated: new Date().toISOString(),
    };

    setLocations([...locations, newEntry]);
    setShowAddForm(false);
    setNewLocation({
      phoneNumber: "",
      name: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      callerName: "",
    });
  };

  const unverifiedCount = locations.filter((l) => !l.isVerified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            E911 Emergency Services
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure emergency calling locations for your phone numbers
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="btn-primary gap-2"
        >
          <MapPin className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Warning Banner */}
      {unverifiedCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">
              {unverifiedCount} location{unverifiedCount > 1 ? "s" : ""} pending
              verification
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Unverified addresses may result in delayed emergency response.
              Please verify all E911 locations.
            </p>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">
            Important E911 Information
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            E911 service requires accurate physical address information to
            dispatch emergency responders. Keep your addresses up to date,
            especially for remote workers.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {locations.filter((l) => l.isVerified).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Verified Locations
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {unverifiedCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending Verification
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {locations.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Numbers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Add E911 Location
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number *
              </label>
              <Input
                value={newLocation.phoneNumber}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, phoneNumber: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location Name
              </label>
              <Input
                value={newLocation.name}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, name: e.target.value })
                }
                placeholder="Main Office, Home, etc."
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Street Address *
              </label>
              <Input
                value={newLocation.street1}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, street1: e.target.value })
                }
                placeholder="123 Main St"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Apt/Suite/Unit
              </label>
              <Input
                value={newLocation.street2}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, street2: e.target.value })
                }
                placeholder="Suite 100"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City *
              </label>
              <Input
                value={newLocation.city}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, city: e.target.value })
                }
                placeholder="San Francisco"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State *
              </label>
              <Input
                value={newLocation.state}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, state: e.target.value })
                }
                placeholder="CA"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ZIP Code *
              </label>
              <Input
                value={newLocation.zip}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, zip: e.target.value })
                }
                placeholder="94105"
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caller Name (shown to 911)
            </label>
            <Input
              value={newLocation.callerName}
              onChange={(e) =>
                setNewLocation({ ...newLocation, callerName: e.target.value })
              }
              placeholder="Business Name or Person"
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleAddLocation} className="btn-primary gap-2">
              <Save className="h-4 w-4" />
              Save Location
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
              className="dark:border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className={cn(
              "p-5 bg-white dark:bg-gray-800 rounded-xl border transition-colors",
              location.isVerified
                ? "border-gray-200 dark:border-gray-700"
                : "border-amber-300 dark:border-amber-700"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    location.isVerified
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  )}
                >
                  <MapPin
                    className={cn(
                      "h-6 w-6",
                      location.isVerified
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {location.name}
                    </h3>
                    {location.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {location.phoneNumber}
                    </span>
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 pl-16 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Physical Address
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {location.address.street1}
                  {location.address.street2 && (
                    <>, {location.address.street2}</>
                  )}
                  <br />
                  {location.address.city}, {location.address.state}{" "}
                  {location.address.zip}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Caller ID Name
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {location.callerName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Last updated: {formatDate(location.lastUpdated)}
                </p>
              </div>
            </div>

            {!location.isVerified && (
              <div className="mt-4 pl-16">
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  <Check className="h-4 w-4" />
                  Verify Address
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legal Notice */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          E911 Legal Notice
        </h4>
        <p>
          You are required by law to provide accurate location information for
          E911 emergency services. Failure to maintain accurate E911 records may
          result in delayed emergency response. By using this VoIP service, you
          acknowledge the limitations of E911 service compared to traditional
          landline 911 service.
        </p>
      </div>
    </div>
  );
}
