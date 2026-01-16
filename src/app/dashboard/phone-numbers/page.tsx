"use client";

import { useEffect, useState } from "react";
import {
  Phone,
  Plus,
  Search,
  PhoneCall,
  MessageSquare,
  Settings,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneNumber {
  id: string;
  number: string;
  friendlyName: string | null;
  type: string;
  status: string;
  voiceEnabled: boolean;
  smsEnabled: boolean;
  createdAt: string;
}

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search params
  const [numberType, setNumberType] = useState("local");
  const [areaCode, setAreaCode] = useState("");
  const [contains, setContains] = useState("");

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  async function fetchPhoneNumbers() {
    try {
      const response = await fetch("/api/phone-numbers");
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

  async function searchNumbers() {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (numberType) params.set("type", numberType);
      if (areaCode) params.set("areaCode", areaCode);
      if (contains) params.set("contains", contains);

      const response = await fetch(`/api/phone-numbers/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableNumbers(data.numbers || []);
      }
    } catch (error) {
      console.error("Failed to search numbers:", error);
    } finally {
      setIsSearching(false);
    }
  }

  async function provisionNumber(phoneNumber: string) {
    setIsProvisioning(true);
    try {
      const response = await fetch("/api/phone-numbers/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        setSearchDialogOpen(false);
        fetchPhoneNumbers();
        setAvailableNumbers([]);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to provision number");
      }
    } catch (error) {
      console.error("Failed to provision number:", error);
      alert("An error occurred");
    } finally {
      setIsProvisioning(false);
    }
  }

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

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
          <p className="text-slate-400 mt-1">Manage your business phone numbers</p>
        </div>
        <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C9A227] hover:bg-[#B8921F] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Get New Number
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Get a New Phone Number</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Search Options */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Number Type</Label>
                  <Select value={numberType} onValueChange={setNumberType}>
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="toll-free">Toll-Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Area Code</Label>
                  <Input
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value)}
                    placeholder="e.g., 415"
                    maxLength={3}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Contains</Label>
                  <Input
                    value={contains}
                    onChange={(e) => setContains(e.target.value)}
                    placeholder="e.g., 1234"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <Button
                onClick={searchNumbers}
                disabled={isSearching}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Numbers
                  </>
                )}
              </Button>

              {/* Results */}
              {availableNumbers.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableNumbers.map((num) => (
                    <div
                      key={num.phoneNumber}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800/50"
                    >
                      <div>
                        <p className="text-white font-mono font-medium">
                          {formatPhoneNumber(num.phoneNumber)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {num.locality}, {num.region}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {num.capabilities.voice && (
                            <span className="text-xs text-green-400">Voice</span>
                          )}
                          {num.capabilities.sms && (
                            <span className="text-xs text-blue-400">SMS</span>
                          )}
                          {num.capabilities.mms && (
                            <span className="text-xs text-purple-400">MMS</span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => provisionNumber(num.phoneNumber)}
                        disabled={isProvisioning}
                        className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
                      >
                        {isProvisioning ? "..." : "Select"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Phone Numbers List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : phoneNumbers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No phone numbers yet</p>
              <p className="text-sm mt-1">Get your first business phone number to start receiving calls</p>
              <Button
                onClick={() => setSearchDialogOpen(true)}
                className="mt-4 bg-[#C9A227] hover:bg-[#B8921F] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Get Your First Number
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {phoneNumbers.map((phone) => (
                <div
                  key={phone.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-900 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#C9A227]/20 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-[#C9A227]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-mono font-medium text-lg">
                          {formatPhoneNumber(phone.number)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-slate-400 hover:text-white"
                          onClick={() => copyToClipboard(phone.number, phone.id)}
                        >
                          {copiedId === phone.id ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      {phone.friendlyName && (
                        <p className="text-sm text-slate-400">{phone.friendlyName}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            phone.type === "toll-free"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {phone.type}
                        </span>
                        {phone.voiceEnabled && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <PhoneCall className="h-3 w-3" />
                            Voice
                          </span>
                        )}
                        {phone.smsEnabled && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageSquare className="h-3 w-3" />
                            SMS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300 focus:bg-slate-700">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-slate-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Release Number
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Number Pricing</p>
              <p className="text-sm text-slate-300 mt-1">
                Local numbers: $1/month • Toll-free numbers: $2/month • Included in all plans with unlimited US/Canada calling
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
