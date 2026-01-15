"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useOrganization } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Phone,
  Bot,
  Clock,
  Download,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Search,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Phone Number", icon: Phone },
  { id: 3, title: "AI Receptionist", icon: Bot },
  { id: 4, title: "Business Hours", icon: Clock },
  { id: 5, title: "Get Started", icon: Download },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [searchingNumbers, setSearchingNumbers] = useState(false);

  const [formData, setFormData] = useState({
    // Company Info
    companyName: organization?.name || "",
    industry: "",
    // Phone Number
    areaCode: "",
    selectedNumber: "",
    numberType: "local",
    // AI Receptionist
    greeting: "",
    businessDescription: "",
    // Business Hours
    timezone: "America/New_York",
    schedule: {
      monday: { enabled: true, open: "09:00", close: "17:00" },
      tuesday: { enabled: true, open: "09:00", close: "17:00" },
      wednesday: { enabled: true, open: "09:00", close: "17:00" },
      thursday: { enabled: true, open: "09:00", close: "17:00" },
      friday: { enabled: true, open: "09:00", close: "17:00" },
      saturday: { enabled: false, open: "10:00", close: "14:00" },
      sunday: { enabled: false, open: "10:00", close: "14:00" },
    },
  });

  useEffect(() => {
    if (organization?.name && !formData.companyName) {
      setFormData(prev => ({ ...prev, companyName: organization.name }));
    }
  }, [organization, formData.companyName]);

  const searchNumbers = async () => {
    if (!formData.areaCode || formData.areaCode.length !== 3) return;

    setSearchingNumbers(true);
    try {
      const response = await fetch(`/api/phone-numbers/search?areaCode=${formData.areaCode}&type=${formData.numberType}`);
      const data = await response.json();
      setAvailableNumbers(data.numbers || []);
    } catch (error) {
      console.error("Error searching numbers:", error);
    }
    setSearchingNumbers(false);
  };

  const handleNext = async () => {
    if (currentStep === steps.length) {
      // Complete onboarding
      setIsLoading(true);
      try {
        await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Error completing onboarding:", error);
      }
      setIsLoading(false);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tell us about your business</h2>
              <p className="text-gray-500 mt-2">This helps us customize your phone system</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Your Company Name"
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
                >
                  <option value="">Select your industry</option>
                  <option value="professional_services">Professional Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="retail">Retail</option>
                  <option value="restaurant">Restaurant / Food Service</option>
                  <option value="construction">Construction / Home Services</option>
                  <option value="legal">Legal Services</option>
                  <option value="finance">Finance / Accounting</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Choose your business number</h2>
              <p className="text-gray-500 mt-2">Search for an available number in your area</p>
            </div>

            {/* Number Type Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, numberType: "local" }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.numberType === "local"
                    ? "border-[#C9A227] bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <MapPin className="h-5 w-5 text-[#C9A227] mb-2" />
                <p className="font-semibold text-gray-900">Local Number</p>
                <p className="text-sm text-gray-500">Included in your plan</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, numberType: "toll_free" }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  formData.numberType === "toll_free"
                    ? "border-[#C9A227] bg-amber-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Phone className="h-5 w-5 text-[#C9A227] mb-2" />
                <p className="font-semibold text-gray-900">Toll-Free</p>
                <p className="text-sm text-gray-500">+$10/month</p>
              </button>
            </div>

            {/* Area Code Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.numberType === "local" ? "Area Code" : "Prefix (800, 888, etc.)"}
                </label>
                <Input
                  value={formData.areaCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, areaCode: e.target.value.slice(0, 3) }))}
                  placeholder={formData.numberType === "local" ? "e.g. 212" : "e.g. 800"}
                  maxLength={3}
                  className="h-12"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={searchNumbers}
                  disabled={formData.areaCode.length !== 3 || searchingNumbers}
                  className="h-12 bg-[#1E3A5F] hover:bg-[#152d4a]"
                >
                  {searchingNumbers ? (
                    <span className="animate-spin">...</span>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Available Numbers */}
            {availableNumbers.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Available Numbers</p>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {availableNumbers.map((num) => (
                    <button
                      key={num.phone_number}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, selectedNumber: num.phone_number }))}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.selectedNumber === num.phone_number
                          ? "border-[#C9A227] bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-mono text-lg font-semibold text-gray-900">
                        {formatPhoneNumber(num.phone_number)}
                      </p>
                      <p className="text-sm text-gray-500">{num.city}, {num.state}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableNumbers.length === 0 && formData.areaCode.length === 3 && !searchingNumbers && (
              <div className="text-center py-8 text-gray-500">
                <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Click "Search" to find available numbers</p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-[#C9A227]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Set up your AI Receptionist</h2>
              <p className="text-gray-500 mt-2">Your AI will answer calls professionally 24/7</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Greeting Message
                </label>
                <Input
                  value={formData.greeting}
                  onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
                  placeholder={`Thank you for calling ${formData.companyName || "our company"}. How may I help you today?`}
                  className="h-12"
                />
                <p className="text-xs text-gray-500 mt-1">This is what callers hear first</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Your Business
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                  placeholder="Describe your business, services, and any important information the AI should know when answering questions..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Help your AI answer caller questions accurately</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Pro tip:</strong> Include information about your services, pricing, hours,
                  and frequently asked questions to make your AI more helpful.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Set your business hours</h2>
              <p className="text-gray-500 mt-2">Calls outside these hours go to voicemail</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Anchorage">Alaska Time (AKT)</option>
                <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
              </select>
            </div>

            <div className="space-y-3">
              {Object.entries(formData.schedule).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                  <div className="w-24">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hours.enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            [day]: { ...hours, enabled: e.target.checked }
                          }
                        }))}
                        className="rounded border-gray-300 text-[#C9A227] focus:ring-[#C9A227]"
                      />
                      <span className="capitalize text-sm font-medium">{day}</span>
                    </label>
                  </div>
                  {hours.enabled ? (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            [day]: { ...hours, open: e.target.value }
                          }
                        }))}
                        className="w-32"
                      />
                      <span className="text-gray-400">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            [day]: { ...hours, close: e.target.value }
                          }
                        }))}
                        className="w-32"
                      />
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">You're all set!</h2>
              <p className="text-gray-500 mt-2">Your business phone system is ready to use</p>
            </div>

            {formData.selectedNumber && (
              <div className="bg-[#1E3A5F] rounded-xl p-6 text-center">
                <p className="text-amber-300 text-sm font-medium mb-2">YOUR BUSINESS NUMBER</p>
                <p className="text-white text-3xl font-bold font-mono">
                  {formatPhoneNumber(formData.selectedNumber)}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Get the apps:</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:bg-amber-50 transition-all"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">iOS App</p>
                    <p className="text-sm text-gray-500">iPhone & iPad</p>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:bg-amber-50 transition-all"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.523 2.246c-.913-.024-1.9.32-2.604 1.025l-.017.017-8.76 8.761c-.253.254-.395.585-.448.93l-.006.092v4.393c0 .217.07.427.197.6l.056.066c.15.155.357.244.576.244h4.392c.382 0 .748-.152 1.018-.422l8.778-8.778c.632-.633.988-1.493.988-2.39 0-.898-.356-1.758-.988-2.39-.703-.703-1.687-1.123-2.678-1.147l-.504-.001zm-5.052 15.247H7.93v-4.542l6.035-6.035 4.541 4.541-6.035 6.036z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Android App</p>
                    <p className="text-sm text-gray-500">Phone & Tablet</p>
                  </div>
                </a>

                <a
                  href="/downloads/SMBVoice-Setup.exe"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#C9A227] hover:bg-amber-50 transition-all"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Desktop App</p>
                    <p className="text-sm text-gray-500">Windows & Mac</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>What's next?</strong> Make a test call to your new number to hear how
                your AI receptionist sounds. You can customize everything in your dashboard.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-[#C9A227] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 hidden sm:block ${
                    currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-2 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLoading || (currentStep === 2 && !formData.selectedNumber)}
              className="bg-[#C9A227] hover:bg-[#B8911F] text-white px-6"
            >
              {isLoading ? (
                "Finishing..."
              ) : currentStep === steps.length ? (
                <>
                  Go to Dashboard
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Skip link */}
        {currentStep < steps.length && (
          <p className="text-center mt-6 text-sm text-gray-500">
            Already set up?{" "}
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[#C9A227] hover:underline font-medium"
            >
              Skip to dashboard
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
