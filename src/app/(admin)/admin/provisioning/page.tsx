"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Phone,
  Search,
  Plus,
  RefreshCw,
  MapPin,
  Globe,
  Check,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AvailableNumber {
  phoneNumber: string;
  type: string;
  region: string;
  city?: string;
  state?: string;
  monthlyPrice: number;
  setupFee: number;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface ProvisionedNumber {
  id: string;
  number: string;
  type: string;
  client: string;
  status: string;
  assignedDate: string;
}

export default function ProvisioningPage() {
  const [searchAreaCode, setSearchAreaCode] = useState("");
  const [searchType, setSearchType] = useState<"local" | "tollfree">("local");
  const [isSearching, setIsSearching] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [provisionedNumbers, setProvisionedNumbers] = useState<ProvisionedNumber[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [isLoadingProvisioned, setIsLoadingProvisioned] = useState(true);

  // Fetch provisioned numbers on mount
  const fetchProvisionedNumbers = useCallback(async () => {
    setIsLoadingProvisioned(true);
    try {
      const response = await fetch("/api/phone-numbers");
      if (response.ok) {
        const data = await response.json();
        setProvisionedNumbers(data.phoneNumbers || []);
      }
    } catch (err) {
      console.error("Failed to fetch provisioned numbers:", err);
    } finally {
      setIsLoadingProvisioned(false);
    }
  }, []);

  useEffect(() => {
    fetchProvisionedNumbers();
  }, [fetchProvisionedNumbers]);

  const handleSearch = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: searchType,
        quantity: "10",
      });
      if (searchAreaCode) {
        params.set("areaCode", searchAreaCode);
      }

      const response = await fetch(`/api/phone-numbers/available?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to search numbers");
      }

      const data = await response.json();
      setAvailableNumbers(data.numbers || []);
      setIsMockData(data.mock === true);
      if (data.mock && data.message) {
        setError(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setAvailableNumbers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProvision = async () => {
    if (selectedNumbers.length === 0) return;
    setIsProvisioning(true);
    setError(null);

    try {
      const response = await fetch("/api/phone-numbers/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: selectedNumbers }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to provision numbers");
      }

      // Refresh provisioned numbers list
      await fetchProvisionedNumbers();
      setSelectedNumbers([]);
      setAvailableNumbers([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Provisioning failed");
    } finally {
      setIsProvisioning(false);
    }
  };

  const toggleNumberSelection = (number: string) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
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

        {/* Error/Info Message */}
        {error && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            isMockData ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"
          }`}>
            <AlertCircle className={`h-5 w-5 ${isMockData ? "text-amber-500" : "text-red-500"}`} />
            <p className={`text-sm ${isMockData ? "text-amber-700" : "text-red-700"}`}>{error}</p>
          </div>
        )}

        {/* Available Numbers */}
        {availableNumbers.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Available Numbers
                {isMockData && <span className="text-xs text-amber-600 ml-2">(Demo)</span>}
              </h3>
              {selectedNumbers.length > 0 && (
                <Button
                  onClick={handleProvision}
                  disabled={isProvisioning}
                  className="bg-[#1E3A5F] hover:bg-[#2D4A6F] text-white"
                >
                  {isProvisioning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Provision {selectedNumbers.length} Number{selectedNumbers.length > 1 ? "s" : ""}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableNumbers.map((num) => (
                <button
                  key={num.phoneNumber}
                  onClick={() => toggleNumberSelection(num.phoneNumber)}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    selectedNumbers.includes(num.phoneNumber)
                      ? "border-[#C9A227] bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{formatPhoneNumber(num.phoneNumber)}</p>
                      <p className="text-sm text-gray-500">
                        {num.city && num.state ? `${num.city}, ${num.state}` : num.type === "tollfree" ? "Nationwide" : num.region}
                      </p>
                      <p className="text-sm text-[#C9A227] font-medium mt-1">${num.monthlyPrice.toFixed(2)}/mo</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedNumbers.includes(num.phoneNumber)
                        ? "border-[#C9A227] bg-[#C9A227]"
                        : "border-gray-300"
                    }`}>
                      {selectedNumbers.includes(num.phoneNumber) && (
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
          <Button
            variant="outline"
            size="icon"
            onClick={fetchProvisionedNumbers}
            disabled={isLoadingProvisioned}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingProvisioned ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="overflow-x-auto">
          {isLoadingProvisioned ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : provisionedNumbers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Phone className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No Numbers Provisioned</p>
              <p className="text-sm">Search and provision numbers above to get started</p>
            </div>
          ) : (
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
                {provisionedNumbers.map((num) => (
                  <tr key={num.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{formatPhoneNumber(num.number)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        num.type === "tollfree" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {num.type === "tollfree" ? "Toll Free" : "Local"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{num.client || "Unassigned"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        num.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {num.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {num.assignedDate ? new Date(num.assignedDate).toLocaleDateString() : "-"}
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
          )}
        </div>
      </div>
    </div>
  );
}
