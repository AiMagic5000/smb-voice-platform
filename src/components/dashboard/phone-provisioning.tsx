"use client";

import React, { useState, useCallback } from "react";

// ============================================
// Types
// ============================================

interface AvailableNumber {
  phoneNumber: string;
  type: "local" | "tollfree" | "mobile";
  region?: string;
  city?: string;
  state?: string;
  monthlyPrice: number;
  setupFee?: number;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax?: boolean;
  };
}

interface SearchFilters {
  type: "local" | "tollfree" | "mobile";
  areaCode?: string;
  contains?: string;
  state?: string;
  city?: string;
}

// ============================================
// Phone Number Provisioning Component
// ============================================

export function PhoneNumberProvisioning({
  onPurchase,
  onCancel,
}: {
  onPurchase?: (number: AvailableNumber) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState<"search" | "results" | "confirm">("search");
  const [filters, setFilters] = useState<SearchFilters>({ type: "local" });
  const [isSearching, setIsSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for available numbers
  const searchNumbers = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("type", filters.type);
      if (filters.areaCode) params.set("areaCode", filters.areaCode);
      if (filters.contains) params.set("contains", filters.contains);
      if (filters.state) params.set("state", filters.state);

      const response = await fetch(`/api/phone-numbers/available?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to search for numbers");
      }

      const data = await response.json();
      setAvailableNumbers(data.numbers || []);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      // For demo, show mock numbers
      setAvailableNumbers(generateMockNumbers(filters));
      setStep("results");
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  // Purchase selected number
  const purchaseNumber = useCallback(async () => {
    if (!selectedNumber) return;

    setIsPurchasing(true);
    setError(null);

    try {
      const response = await fetch("/api/phone-numbers/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: selectedNumber.phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to provision number");
      }

      onPurchase?.(selectedNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedNumber, onPurchase]);

  // Format phone number for display
  const formatPhone = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Get a Phone Number</h2>
          <p className="text-sm text-gray-500 mt-1">Search and purchase a new business phone number</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 py-4 px-6 bg-gray-50 border-b">
        <StepIndicator step={1} label="Search" active={step === "search"} completed={step !== "search"} />
        <div className="w-8 h-px bg-gray-300" />
        <StepIndicator step={2} label="Select" active={step === "results"} completed={step === "confirm"} />
        <div className="w-8 h-px bg-gray-300" />
        <StepIndicator step={3} label="Confirm" active={step === "confirm"} completed={false} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Search Form */}
      {step === "search" && (
        <div className="p-6 space-y-6">
          {/* Number Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(["local", "tollfree", "mobile"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, type })}
                  className={`
                    p-4 rounded-lg border-2 transition-colors text-center
                    ${filters.type === type
                      ? "border-[#C9A227] bg-[#C9A227]/10"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className={`text-lg font-medium ${filters.type === type ? "text-[#C9A227]" : "text-gray-900"}`}>
                    {type === "local" && "Local"}
                    {type === "tollfree" && "Toll-Free"}
                    {type === "mobile" && "Mobile"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type === "local" && "Area code specific"}
                    {type === "tollfree" && "800, 888, 877..."}
                    {type === "mobile" && "SMS capable"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filters based on type */}
          {filters.type === "local" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area Code</label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="e.g., 212"
                  value={filters.areaCode || ""}
                  onChange={(e) => setFilters({ ...filters, areaCode: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contains (optional)</label>
                <input
                  type="text"
                  maxLength={7}
                  placeholder="e.g., 1234"
                  value={filters.contains || ""}
                  onChange={(e) => setFilters({ ...filters, contains: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                />
              </div>
            </div>
          )}

          {filters.type === "tollfree" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vanity Number (optional)</label>
              <input
                type="text"
                maxLength={7}
                placeholder="e.g., FLOWERS"
                value={filters.contains || ""}
                onChange={(e) => setFilters({ ...filters, contains: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              />
              <p className="text-xs text-gray-500 mt-1">Search for memorable words in your number</p>
            </div>
          )}

          {/* Search Button */}
          <button
            onClick={searchNumbers}
            disabled={isSearching || (filters.type === "local" && !filters.areaCode)}
            className="w-full py-3 bg-[#C9A227] text-white rounded-lg font-medium hover:bg-[#B8911F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Numbers
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: Results */}
      {step === "results" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setStep("search")}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to search
            </button>
            <span className="text-sm text-gray-500">{availableNumbers.length} numbers found</span>
          </div>

          {availableNumbers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No numbers found matching your criteria</p>
              <button
                onClick={() => setStep("search")}
                className="mt-3 text-[#C9A227] hover:text-[#B8911F] font-medium"
              >
                Try different search
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {availableNumbers.map((number) => (
                <button
                  key={number.phoneNumber}
                  onClick={() => {
                    setSelectedNumber(number);
                    setStep("confirm");
                  }}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${selectedNumber?.phoneNumber === number.phoneNumber
                      ? "border-[#C9A227] bg-[#C9A227]/5"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-mono font-medium text-gray-900">
                        {formatPhone(number.phoneNumber)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {number.city && number.state && `${number.city}, ${number.state}`}
                        {number.type === "tollfree" && "Toll-Free"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#C9A227]">
                        ${number.monthlyPrice.toFixed(2)}/mo
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {number.capabilities.voice && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">Voice</span>
                        )}
                        {number.capabilities.sms && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">SMS</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === "confirm" && selectedNumber && (
        <div className="p-6">
          <button
            onClick={() => setStep("results")}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to results
          </button>

          <div className="bg-gray-50 rounded-lg p-6 text-center mb-6">
            <div className="text-3xl font-mono font-bold text-gray-900 mb-2">
              {formatPhone(selectedNumber.phoneNumber)}
            </div>
            <div className="text-gray-500">
              {selectedNumber.type === "local" && `Local number in ${selectedNumber.city}, ${selectedNumber.state}`}
              {selectedNumber.type === "tollfree" && "Toll-Free number"}
              {selectedNumber.type === "mobile" && "Mobile number"}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-white border border-gray-200 rounded-lg divide-y">
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-600">Monthly fee</span>
              <span className="font-medium">${selectedNumber.monthlyPrice.toFixed(2)}/mo</span>
            </div>
            {selectedNumber.setupFee && selectedNumber.setupFee > 0 && (
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">One-time setup</span>
                <span className="font-medium">${selectedNumber.setupFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 bg-gray-50">
              <span className="font-medium text-gray-900">Due today</span>
              <span className="font-bold text-[#C9A227]">
                ${((selectedNumber.setupFee || 0) + selectedNumber.monthlyPrice).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            {selectedNumber.capabilities.voice && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Voice calls
              </span>
            )}
            {selectedNumber.capabilities.sms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SMS/Text
              </span>
            )}
            {selectedNumber.capabilities.mms && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                MMS
              </span>
            )}
          </div>

          {/* Purchase Button */}
          <button
            onClick={purchaseNumber}
            disabled={isPurchasing}
            className="w-full mt-6 py-3 bg-[#C9A227] text-white rounded-lg font-medium hover:bg-[#B8911F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPurchasing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm Purchase
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By purchasing, you agree to our terms of service. Number will be available immediately.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Step Indicator Component
// ============================================

function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
          ${completed ? "bg-green-500 text-white" : active ? "bg-[#C9A227] text-white" : "bg-gray-200 text-gray-500"}
        `}
      >
        {completed ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          step
        )}
      </div>
      <span className={`text-sm ${active ? "font-medium text-gray-900" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

// ============================================
// Mock Data Generator (for demo)
// ============================================

function generateMockNumbers(filters: SearchFilters): AvailableNumber[] {
  const count = Math.floor(Math.random() * 8) + 3;
  const numbers: AvailableNumber[] = [];

  for (let i = 0; i < count; i++) {
    const areaCode = filters.areaCode || ["212", "310", "415", "512", "786"][Math.floor(Math.random() * 5)];
    const prefix = String(Math.floor(Math.random() * 900) + 100);
    const line = String(Math.floor(Math.random() * 9000) + 1000);

    let phoneNumber = `+1${areaCode}${prefix}${line}`;
    if (filters.type === "tollfree") {
      const tollfreePrefixes = ["800", "888", "877", "866", "855"];
      phoneNumber = `+1${tollfreePrefixes[Math.floor(Math.random() * tollfreePrefixes.length)]}${prefix}${line}`;
    }

    numbers.push({
      phoneNumber,
      type: filters.type,
      region: "US",
      city: ["New York", "Los Angeles", "San Francisco", "Austin", "Miami"][Math.floor(Math.random() * 5)],
      state: ["NY", "CA", "CA", "TX", "FL"][Math.floor(Math.random() * 5)],
      monthlyPrice: filters.type === "tollfree" ? 4.95 : 1.95,
      setupFee: 0,
      capabilities: {
        voice: true,
        sms: true,
        mms: filters.type !== "tollfree",
      },
    });
  }

  return numbers;
}

export default PhoneNumberProvisioning;
