"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Bot,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Phone;
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to SMB Voice",
    description: "Let's get your business phone system set up in just a few minutes.",
    icon: Sparkles,
  },
  {
    id: "phone",
    title: "Choose Your Number",
    description: "Select a local or toll-free number for your business.",
    icon: Phone,
  },
  {
    id: "ai",
    title: "Set Up AI Receptionist",
    description: "Configure how your AI assistant answers calls.",
    icon: Bot,
  },
  {
    id: "apps",
    title: "Download Apps",
    description: "Get our free apps on your devices.",
    icon: Smartphone,
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Your business phone system is ready to use.",
    icon: CheckCircle,
  },
];

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    areaCode: "",
    numberType: "local" as "local" | "toll-free",
    greeting: "",
    businessDescription: "",
  });

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "welcome":
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-[#FDF8E8] flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="h-12 w-12 text-[#C9A227]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">
              Welcome to SMB Voice!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              In the next few minutes, we&apos;ll help you set up your professional
              business phone system. It&apos;s easy - just follow along!
            </p>
          </div>
        );

      case "phone":
        return (
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-base">Number Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, numberType: "local" }))
                  }
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    formData.numberType === "local"
                      ? "border-[#C9A227] bg-[#FDF8E8]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <p className="font-semibold text-[#1E3A5F]">Local Number</p>
                  <p className="text-sm text-gray-500">
                    Great for local businesses
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, numberType: "toll-free" }))
                  }
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    formData.numberType === "toll-free"
                      ? "border-[#C9A227] bg-[#FDF8E8]"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <p className="font-semibold text-[#1E3A5F]">Toll-Free</p>
                  <p className="text-sm text-gray-500">
                    Free calls nationwide
                  </p>
                </button>
              </div>
            </div>

            {formData.numberType === "local" && (
              <div>
                <Label htmlFor="areaCode">Preferred Area Code (optional)</Label>
                <Input
                  id="areaCode"
                  placeholder="e.g., 512, 415, 212"
                  value={formData.areaCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      areaCode: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll find an available number in this area
                </p>
              </div>
            )}
          </div>
        );

      case "ai":
        return (
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="greeting">AI Greeting</Label>
              <Textarea
                id="greeting"
                placeholder="e.g., Thank you for calling Smith's Plumbing. How can I help you today?"
                value={formData.greeting}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, greeting: e.target.value }))
                }
                className="mt-2 min-h-[100px]"
              />
              <p className="text-sm text-gray-500 mt-1">
                This is what callers will hear when the AI answers
              </p>
            </div>

            <div>
              <Label htmlFor="businessDescription">
                Business Description (optional)
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="e.g., We're a family-owned plumbing company serving the Austin area for over 20 years..."
                value={formData.businessDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessDescription: e.target.value,
                  }))
                }
                className="mt-2 min-h-[100px]"
              />
              <p className="text-sm text-gray-500 mt-1">
                Helps the AI answer questions about your business
              </p>
            </div>
          </div>
        );

      case "apps":
        return (
          <div className="space-y-6 py-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-[#1E3A5F] mb-1">iPhone</p>
                  <Button variant="outline" size="sm" className="w-full">
                    App Store
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-[#1E3A5F] mb-1">Android</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Play Store
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="font-semibold text-[#1E3A5F] mb-1">Desktop</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-sm text-gray-500">
              You can also download apps later from your dashboard
            </p>
          </div>
        );

      case "complete":
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-4">
              You&apos;re All Set!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Your business phone system is ready. Make a test call to your new
              number to see how it works!
            </p>
            <div className="p-4 bg-[#FDF8E8] rounded-xl inline-block">
              <p className="text-sm text-[#9E7E1E] mb-1">Your new number</p>
              <p className="text-2xl font-bold text-[#C9A227]">
                {formData.numberType === "toll-free"
                  ? "+1 (888) 555-0123"
                  : `+1 (${formData.areaCode || "512"}) 555-0123`}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-[#C9A227]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Indicators */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    i <= currentStep
                      ? "bg-[#C9A227] text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {i < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1",
                      i < currentStep ? "bg-[#C9A227]" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-[#1E3A5F] mb-1">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div>
            {!isFirstStep && (
              <Button variant="ghost" onClick={prevStep} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onSkip && !isLastStep && (
              <Button variant="ghost" onClick={onSkip}>
                Skip Setup
              </Button>
            )}
            <Button onClick={nextStep} className="btn-primary gap-2">
              {isLastStep ? "Go to Dashboard" : "Continue"}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OnboardingWizard;
