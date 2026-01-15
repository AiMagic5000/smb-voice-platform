"use client";

import { useState } from "react";
import {
  Phone,
  Search,
  Plus,
  RefreshCw,
  MapPin,
  Globe,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock available numbers
const mockAvailableNumbers = [
  { number: "+1 (555) 100-1001", type: "Local", areaCode: "555", city: "New York, NY", price: 1.00 },
  { number: "+1 (555) 100-1002", type: "Local", areaCode: "555", city: "New York, NY", price: 1.00 },
  { number: "+1 (555) 200-2001", type: "Local", areaCode: "555", city: "Los Angeles, CA", price: 1.00 },
  { number: "+1 (555) 200-2002", type: "Local", areaCode: "555", city: "Los Angeles, CA", price: 1.00 },
  { number: "+1 (800) 555-0001", type: "Toll Free", areaCode: "800", city: "Nationwide", price: 2.00 },
  { number: "+1 (888) 555-0002", type: "Toll Free", areaCode: "888", city: "Nationwide", price: 2.00 },
  { number: "+1 (877) 555-0003", type: "Toll Free", areaCode: "877", city: "Nationwide", price: 2.00 },
];

// Mock provisioned numbers
const mockProvisionedNumbers = [
  { number: "+1 (555) 123-4567", type: "Local", client: "ABC Corporation", status: "active", assignedDate: "2026-01-10" },
  { number: "+1 (555) 234-5678", type: "Local", client: "XYZ Industries", status: "active", assignedDate: "2026-01-08" },
  { number: "+1 (800) 555-1234", type: "Toll Free", client: "Global Services", status: "active", assignedDate: "2026-01-05" },
  { number: "+1 (555) 345-6789", type: "Local", client: "Tech Startup", status: "active", assignedDate: "2026-01-12" },
];

export default function ProvisioningPage() {
  const [searchAreaCode, setSearchAreaCode] = useState("");
  const [searchType, setSearchType] = useState<"local" | "tollfree">("local");
  const [isSearching, setIsSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState(mockAvailableNumbers);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      // Filter mock data based on search
      const filtered = mockAvailableNumbers.filter(n => {
        if (searchType === "tollfree") {
          return n.type === "Toll Free";
        }
        if (searchAreaCode) {
          return n.areaCode.includes(searchAreaCode);
        }
        return n.type === "Local";
      });
      setAvailableNumbers(filtered);
    }, 1000);
  };

  const toggleNumberSelection = (number: string) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phone Number Provisioning</h1>
        <p className="text-gray-500 mt-1">Search and provision phone numbers for clients</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Available Numbers</h2>

        {/* Number Type Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSearchType("local")}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              searchType === "local"
                ? "border-[#C9A227] bg-amber-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <MapPin className={`h-6 w-6 mx-auto mb-2 ${searchType === "local" ? "text-[#C9A227]" : "text-gray-400"}`} />
            <p className="font-medium text-gray-900">Local Numbers</p>
            <p className="text-sm text-gray-500">$1.00/month</p>
          </button>
          <button
            onClick={() => setSearchType("tollfree")}
            className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
              searchType === "tollfree"
                ? "border-[#C9A227] bg-amber-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Globe className={`h-6 w-6 mx-auto mb-2 ${searchType === "tollfree" ? "text-[#C9A227]" : "text-gray-400"}`} />
            <p className="font-medium text-gray-900">Toll Free</p>
            <p className="text-sm text-gray-500">$2.00/month</p>
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchType === "local" ? "Enter area code (e.g., 212)" : "Search toll-free numbers"}
              value={searchAreaCode}
              onChange={(e) => setSearchAreaCode(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-[#C9A227] hover:bg-[#B8911F] text-white min-w-[120px]"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Available Numbers */}
        {availableNumbers.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Available Numbers</h3>
              {selectedNumbers.length > 0 && (
                <Button className="bg-[#1E3A5F] hover:bg-[#2D4A6F] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Provision {selectedNumbers.length} Number{selectedNumbers.length > 1 ? "s" : ""}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableNumbers.map((num) => (
                <button
                  key={num.number}
                  onClick={() => toggleNumberSelection(num.number)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    selectedNumbers.includes(num.number)
                      ? "border-[#C9A227] bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{num.number}</p>
                      <p className="text-sm text-gray-500">{num.city}</p>
                      <p className="text-sm text-[#C9A227] font-medium mt-1">${num.price.toFixed(2)}/mo</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedNumbers.includes(num.number)
                        ? "border-[#C9A227] bg-[#C9A227]"
                        : "border-gray-300"
                    }`}>
                      {selectedNumbers.includes(num.number) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Provisioned Numbers */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Provisioned Numbers</h2>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assigned Date
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockProvisionedNumbers.map((num, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{num.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      num.type === "Toll Free" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {num.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{num.client}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                      {num.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(num.assignedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <X className="h-4 w-4 mr-1" />
                      Release
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
