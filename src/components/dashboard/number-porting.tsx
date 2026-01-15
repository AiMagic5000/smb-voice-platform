"use client";

import { motion } from "framer-motion";
import {
  PhoneIncoming,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  FileText,
  Phone,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PortingStatus =
  | "submitted"
  | "pending_loa"
  | "carrier_review"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "failed";

interface PortingRequest {
  id: string;
  phoneNumber: string;
  currentCarrier: string;
  status: PortingStatus;
  submittedDate: Date;
  estimatedCompletionDate?: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  notes?: string;
}

interface NumberPortingProps {
  request?: PortingRequest;
  onStartPort?: () => void;
  className?: string;
}

const sampleRequest: PortingRequest = {
  id: "PORT-001",
  phoneNumber: "(555) 444-3333",
  currentCarrier: "Previous Carrier Inc",
  status: "carrier_review",
  submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  estimatedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

const statusSteps: { key: PortingStatus; label: string }[] = [
  { key: "submitted", label: "Submitted" },
  { key: "pending_loa", label: "LOA Review" },
  { key: "carrier_review", label: "Carrier Review" },
  { key: "scheduled", label: "Scheduled" },
  { key: "in_progress", label: "Porting" },
  { key: "completed", label: "Complete" },
];

const statusInfo: Record<
  PortingStatus,
  { label: string; color: string; icon: typeof Clock; description: string }
> = {
  submitted: {
    label: "Request Submitted",
    color: "text-blue-600 bg-blue-50",
    icon: Clock,
    description: "Your port request has been submitted and is awaiting processing.",
  },
  pending_loa: {
    label: "LOA Required",
    color: "text-yellow-600 bg-yellow-50",
    icon: FileText,
    description: "Please sign the Letter of Authorization to proceed with the port.",
  },
  carrier_review: {
    label: "Carrier Review",
    color: "text-purple-600 bg-purple-50",
    icon: Clock,
    description: "Your request is being reviewed by your current carrier.",
  },
  scheduled: {
    label: "Port Scheduled",
    color: "text-cyan-600 bg-cyan-50",
    icon: Calendar,
    description: "Your number transfer has been scheduled.",
  },
  in_progress: {
    label: "Porting in Progress",
    color: "text-orange-600 bg-orange-50",
    icon: Loader2,
    description: "Your number is currently being transferred to SMB Voice.",
  },
  completed: {
    label: "Port Complete",
    color: "text-green-600 bg-green-50",
    icon: CheckCircle,
    description: "Your number has been successfully transferred!",
  },
  failed: {
    label: "Port Failed",
    color: "text-red-600 bg-red-50",
    icon: AlertCircle,
    description: "There was an issue with your port request. Please contact support.",
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStepIndex(status: PortingStatus): number {
  return statusSteps.findIndex((s) => s.key === status);
}

export function NumberPorting({
  request = sampleRequest,
  onStartPort,
  className,
}: NumberPortingProps) {
  const currentStepIndex = request ? getStepIndex(request.status) : -1;
  const info = request ? statusInfo[request.status] : null;

  if (!request) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
            <PhoneIncoming className="h-5 w-5" />
            Port Your Number
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FDF8E8] flex items-center justify-center mx-auto mb-4">
              <PhoneIncoming className="h-8 w-8 text-[#C9A227]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
              Keep Your Existing Number
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Transfer your current business phone number to SMB Voice. The process
              typically takes 5-10 business days.
            </p>
            <Button
              onClick={onStartPort}
              className="gap-2 bg-[#C9A227] hover:bg-[#B8911F] text-white"
            >
              Start Number Port
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#1E3A5F]">
          <PhoneIncoming className="h-5 w-5" />
          Number Porting Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        {info && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-4 rounded-xl", info.color.split(" ")[1])}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  info.color.split(" ")[1].replace("50", "100")
                )}
              >
                <info.icon
                  className={cn(
                    "h-5 w-5",
                    info.color.split(" ")[0],
                    request.status === "in_progress" && "animate-spin"
                  )}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={cn(
                    "font-semibold",
                    info.color.split(" ")[0].replace("600", "700")
                  )}
                >
                  {info.label}
                </h4>
                <p className="text-sm mt-1 opacity-80">{info.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="relative">
          <div className="flex justify-between">
            {statusSteps.map((step, index) => {
              const isComplete = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isFuture = index > currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center z-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isComplete && "bg-green-500 text-white",
                      isCurrent && "bg-[#C9A227] text-white",
                      isFuture && "bg-gray-100 text-gray-400"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs mt-2 text-center max-w-[60px]",
                      isCurrent ? "text-[#1E3A5F] font-medium" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-0">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
              }}
              className="h-full bg-green-500"
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Phone className="h-4 w-4" />
              Number Being Ported
            </div>
            <p className="font-semibold text-[#1E3A5F]">{request.phoneNumber}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <FileText className="h-4 w-4" />
              Current Carrier
            </div>
            <p className="font-semibold text-[#1E3A5F]">{request.currentCarrier}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              Submitted Date
            </div>
            <p className="font-semibold text-[#1E3A5F]">
              {formatDate(request.submittedDate)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4" />
              {request.status === "completed" ? "Completed" : "Estimated Completion"}
            </div>
            <p className="font-semibold text-[#1E3A5F]">
              {request.completedDate
                ? formatDate(request.completedDate)
                : request.estimatedCompletionDate
                ? formatDate(request.estimatedCompletionDate)
                : "TBD"}
            </p>
          </div>
        </div>

        {/* Action Button (for pending_loa status) */}
        {request.status === "pending_loa" && (
          <div className="flex items-center justify-center pt-2">
            <Button className="gap-2 bg-[#C9A227] hover:bg-[#B8911F] text-white">
              <FileText className="h-4 w-4" />
              Sign Letter of Authorization
            </Button>
          </div>
        )}

        {/* Notes */}
        {request.notes && (
          <div className="p-4 rounded-xl bg-[#FDF8E8] border border-[#C9A227]/20">
            <p className="text-sm text-gray-600">
              <strong className="text-[#1E3A5F]">Note:</strong> {request.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NumberPorting;
