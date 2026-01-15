"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit2,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart,
  DollarSign,
  Globe,
  Tag,
  RefreshCw,
  ArrowRightLeft,
} from "lucide-react";

type NumberStatus = "active" | "available" | "reserved" | "porting" | "released";
type NumberType = "local" | "toll_free" | "mobile" | "international";

type DIDNumber = {
  id: string;
  number: string;
  formattedNumber: string;
  type: NumberType;
  status: NumberStatus;
  country: string;
  region: string;
  city?: string;
  rateCenter?: string;
  assignedTo?: {
    type: "extension" | "queue" | "ivr" | "ring_group";
    name: string;
    id: string;
  };
  monthlyRate: number;
  features: string[];
  smsEnabled: boolean;
  faxEnabled: boolean;
  e911Configured: boolean;
  acquiredDate?: string;
  tags: string[];
};

const mockNumbers: DIDNumber[] = [
  {
    id: "did_1",
    number: "+15551000000",
    formattedNumber: "+1 (555) 100-0000",
    type: "local",
    status: "active",
    country: "US",
    region: "New York",
    city: "New York City",
    rateCenter: "NWYRCYZN01",
    assignedTo: { type: "ivr", name: "Main IVR", id: "ivr_main" },
    monthlyRate: 1.50,
    features: ["voice", "sms", "fax"],
    smsEnabled: true,
    faxEnabled: true,
    e911Configured: true,
    acquiredDate: "2023-01-15",
    tags: ["main", "primary"],
  },
  {
    id: "did_2",
    number: "+15552000000",
    formattedNumber: "+1 (555) 200-0000",
    type: "local",
    status: "active",
    country: "US",
    region: "California",
    city: "San Francisco",
    rateCenter: "SNFCCA01",
    assignedTo: { type: "queue", name: "Sales Queue", id: "queue_sales" },
    monthlyRate: 1.50,
    features: ["voice", "sms"],
    smsEnabled: true,
    faxEnabled: false,
    e911Configured: true,
    acquiredDate: "2023-03-20",
    tags: ["sales", "west-coast"],
  },
  {
    id: "did_3",
    number: "+18005551234",
    formattedNumber: "+1 (800) 555-1234",
    type: "toll_free",
    status: "active",
    country: "US",
    region: "National",
    assignedTo: { type: "ivr", name: "Support IVR", id: "ivr_support" },
    monthlyRate: 3.00,
    features: ["voice"],
    smsEnabled: false,
    faxEnabled: false,
    e911Configured: false,
    acquiredDate: "2022-06-01",
    tags: ["support", "toll-free"],
  },
  {
    id: "did_4",
    number: "+15553000000",
    formattedNumber: "+1 (555) 300-0000",
    type: "local",
    status: "available",
    country: "US",
    region: "Illinois",
    city: "Chicago",
    rateCenter: "CHCGIL01",
    monthlyRate: 1.50,
    features: ["voice", "sms", "fax"],
    smsEnabled: false,
    faxEnabled: false,
    e911Configured: false,
    acquiredDate: "2024-01-05",
    tags: [],
  },
  {
    id: "did_5",
    number: "+442071234567",
    formattedNumber: "+44 20 7123 4567",
    type: "international",
    status: "active",
    country: "GB",
    region: "London",
    assignedTo: { type: "extension", name: "UK Office", id: "ext_uk" },
    monthlyRate: 5.00,
    features: ["voice"],
    smsEnabled: false,
    faxEnabled: false,
    e911Configured: false,
    acquiredDate: "2023-11-01",
    tags: ["international", "uk"],
  },
  {
    id: "did_6",
    number: "+15554000000",
    formattedNumber: "+1 (555) 400-0000",
    type: "local",
    status: "porting",
    country: "US",
    region: "Texas",
    city: "Austin",
    rateCenter: "AUSTNTX01",
    monthlyRate: 1.50,
    features: ["voice", "sms"],
    smsEnabled: false,
    faxEnabled: false,
    e911Configured: false,
    tags: ["porting-in"],
  },
  {
    id: "did_7",
    number: "+15555000000",
    formattedNumber: "+1 (555) 500-0000",
    type: "local",
    status: "reserved",
    country: "US",
    region: "Florida",
    city: "Miami",
    rateCenter: "MIAMFL01",
    monthlyRate: 1.50,
    features: ["voice", "sms", "fax"],
    smsEnabled: false,
    faxEnabled: false,
    e911Configured: false,
    tags: ["reserved", "expansion"],
  },
];

const getStatusBadge = (status: NumberStatus) => {
  const styles: Record<NumberStatus, string> = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    available: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    reserved: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    porting: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    released: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
};

const getTypeBadge = (type: NumberType) => {
  const styles: Record<NumberType, string> = {
    local: "bg-blue-100 text-blue-600",
    toll_free: "bg-green-100 text-green-600",
    mobile: "bg-purple-100 text-purple-600",
    international: "bg-orange-100 text-orange-600",
  };
  const labels: Record<NumberType, string> = {
    local: "Local",
    toll_free: "Toll-Free",
    mobile: "Mobile",
    international: "Int'l",
  };
  return <Badge variant="outline" className={styles[type]}>{labels[type]}</Badge>;
};

export function DIDInventory() {
  const [numbers, setNumbers] = useState(mockNumbers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<NumberStatus | "all">("all");
  const [filterType, setFilterType] = useState<NumberType | "all">("all");
  const [showBuyNumber, setShowBuyNumber] = useState(false);

  const filteredNumbers = numbers.filter((num) => {
    const matchesSearch =
      num.number.includes(searchQuery) ||
      num.formattedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || num.status === filterStatus;
    const matchesType = filterType === "all" || num.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: numbers.length,
    active: numbers.filter((n) => n.status === "active").length,
    available: numbers.filter((n) => n.status === "available").length,
    monthlySpend: numbers.filter((n) => n.status === "active").reduce((acc, n) => acc + n.monthlyRate, 0),
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
                  <Phone className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Numbers</p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">{stats.available}</p>
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
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Cost</p>
                  <p className="text-xl font-bold text-[#1E3A5F] dark:text-white">${stats.monthlySpend.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search numbers..."
              className="pl-9"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as NumberStatus | "all")}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="porting">Porting</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as NumberType | "all")}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Types</option>
            <option value="local">Local</option>
            <option value="toll_free">Toll-Free</option>
            <option value="international">International</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="btn-primary gap-2" onClick={() => setShowBuyNumber(true)}>
            <ShoppingCart className="h-4 w-4" />
            Buy Numbers
          </Button>
        </div>
      </div>

      {/* Numbers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Number</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Assigned To</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Features</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Rate</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNumbers.map((num) => (
                  <tr key={num.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-mono font-medium text-[#1E3A5F] dark:text-white">{num.formattedNumber}</p>
                        {num.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {num.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">{getTypeBadge(num.type)}</td>
                    <td className="py-4 px-4">{getStatusBadge(num.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {num.city ? `${num.city}, ${num.region}` : num.region}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {num.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {num.assignedTo.type.replace("_", " ")}
                          </Badge>
                          <span className="text-sm">{num.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        {num.smsEnabled && <Badge variant="outline" className="text-xs">SMS</Badge>}
                        {num.faxEnabled && <Badge variant="outline" className="text-xs">Fax</Badge>}
                        {num.e911Configured && <Badge className="bg-green-100 text-green-700 text-xs">E911</Badge>}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">${num.monthlyRate.toFixed(2)}/mo</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNumbers.length === 0 && (
            <div className="p-12 text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No numbers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buy Numbers Dialog */}
      {showBuyNumber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-lg mx-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-4">
                  Purchase Phone Numbers
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Number Type</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option value="local">Local Number</option>
                      <option value="toll_free">Toll-Free Number</option>
                      <option value="international">International Number</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Region</label>
                    <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <option>New York</option>
                      <option>California</option>
                      <option>Texas</option>
                      <option>Florida</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Area Code (Optional)</label>
                    <Input placeholder="e.g., 212" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <Input type="number" defaultValue={1} min={1} max={100} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="sms" className="rounded" defaultChecked />
                    <label htmlFor="sms" className="text-sm">Enable SMS capability (+$0.50/mo)</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowBuyNumber(false)}>Cancel</Button>
                  <Button className="btn-primary">Search Numbers</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
