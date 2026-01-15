"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Phone,
  Mail,
  MoreVertical,
  PhoneForwarded,
} from "lucide-react";

const extensions = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    extension: "101",
    status: "available",
    phone: "+1 (555) 123-4567",
    avatar: null,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    extension: "102",
    status: "on-call",
    phone: "+1 (555) 234-5678",
    avatar: null,
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@company.com",
    extension: "103",
    status: "away",
    phone: "+1 (555) 345-6789",
    avatar: null,
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    email: "lisa@company.com",
    extension: "104",
    status: "available",
    phone: "+1 (555) 456-7890",
    avatar: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "on-call":
      return "bg-blue-500";
    case "away":
      return "bg-yellow-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "available":
      return "Available";
    case "on-call":
      return "On Call";
    case "away":
      return "Away";
    case "offline":
      return "Offline";
    default:
      return status;
  }
};

export default function ExtensionsPage() {
  return (
    <>
      <Header
        title="Extensions"
        description="Manage team members and their extensions"
      />

      <div className="p-8 space-y-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1E3A5F]">
              Team Members
            </h2>
            <p className="text-sm text-gray-500">
              {extensions.length} of 5 extensions used
            </p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Add Extension
          </Button>
        </div>

        {/* Extensions List */}
        <div className="grid gap-4">
          {extensions.map((ext, i) => (
            <motion.div
              key={ext.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={ext.avatar || ""} alt={ext.name} />
                        <AvatarFallback className="bg-[#1E3A5F] text-white text-lg">
                          {ext.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                          ext.status
                        )}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-[#1E3A5F]">
                          {ext.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-[#FDF8E8] text-[#9E7E1E] border-[#C9A227]/20"
                        >
                          Ext. {ext.extension}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {ext.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {ext.phone}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="hidden sm:block">
                      <Badge
                        variant="outline"
                        className={`${
                          ext.status === "available"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : ext.status === "on-call"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : ext.status === "away"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {getStatusLabel(ext.status)}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <PhoneForwarded className="h-4 w-4" />
                        <span className="hidden sm:inline">Call</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add More Hint */}
        {extensions.length < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-dashed border-2 bg-gray-50/50">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">
                  You can add {5 - extensions.length} more team member(s) with
                  your plan
                </p>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}
