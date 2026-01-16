"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  FileText,
  MessageSquare,
  ArrowRight,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UseCase {
  id: string;
  name: string;
  description: string;
}

export default function SMSCompliancePage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [formData, setFormData] = useState({
    // Brand info
    legalBusinessName: "",
    ein: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    websiteUrl: "",
    businessType: "",
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    // Campaign info
    useCase: "",
    campaignDescription: "",
    sampleMessages: ["", ""],
    optInProcess: "",
    optOutProcess: "Reply STOP to opt out",
    monthlyMessageVolume: "",
    termsAccepted: false,
  });

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch("/api/sms/10dlc");
        if (response.ok) {
          const data = await response.json();
          setRegistrationStatus(data.registered ? "approved" : null);
          setUseCases(data.requirements?.useCaseTypes || []);
        }
      } catch (error) {
        console.error("Failed to fetch 10DLC status:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatus();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/sms/10dlc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegistrationStatus("pending");
      } else {
        const error = await response.json();
        alert(error.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSampleMessage = (index: number, value: string) => {
    const newMessages = [...formData.sampleMessages];
    newMessages[index] = value;
    setFormData((prev) => ({ ...prev, sampleMessages: newMessages }));
  };

  const addSampleMessage = () => {
    if (formData.sampleMessages.length < 5) {
      setFormData((prev) => ({
        ...prev,
        sampleMessages: [...prev.sampleMessages, ""],
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (registrationStatus === "approved") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">10DLC Approved</h2>
            <p className="text-slate-300">
              Your business is registered and approved for SMS messaging.
              You can now send SMS messages from your phone numbers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registrationStatus === "pending") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-8 text-center">
            <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registration Pending</h2>
            <p className="text-slate-300 mb-4">
              Your 10DLC registration is being reviewed. This typically takes 1-14 business days.
            </p>
            <div className="text-left bg-slate-800 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-400">Next steps:</p>
              <ul className="text-sm text-slate-300 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  Registration submitted
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  Brand verification in progress
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                  Campaign approval pending
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">SMS Compliance (10DLC)</h1>
        <p className="text-slate-400 mt-1">
          Register your business for SMS messaging compliance
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-white font-medium">What is 10DLC?</p>
            <p className="text-sm text-slate-300 mt-1">
              10DLC (10-Digit Long Code) registration is required by US carriers to send business
              SMS messages. This ensures better deliverability and compliance with carrier regulations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 py-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? "bg-[#C9A227] text-white"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-white" : "text-slate-500"}`}>
              {s === 1 ? "Brand Info" : s === 2 ? "Campaign" : "Review"}
            </span>
            {s < 3 && <ArrowRight className="h-4 w-4 text-slate-600 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1: Brand Information */}
      {step === 1 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#C9A227]" />
              Brand Registration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Provide your business information for carrier verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Legal Business Name *</Label>
                <Input
                  value={formData.legalBusinessName}
                  onChange={(e) => updateFormData("legalBusinessName", e.target.value)}
                  placeholder="Your Company LLC"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">EIN / Tax ID *</Label>
                <Input
                  value={formData.ein}
                  onChange={(e) => updateFormData("ein", e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Business Address *</Label>
              <Input
                value={formData.businessAddress}
                onChange={(e) => updateFormData("businessAddress", e.target.value)}
                placeholder="123 Main Street"
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-white">City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">State *</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  placeholder="CA"
                  maxLength={2}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">ZIP Code *</Label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Country</Label>
                <Input
                  value="United States"
                  disabled
                  className="bg-slate-900 border-slate-700 text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Website URL *</Label>
                <Input
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData("websiteUrl", e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Business Type *</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => updateFormData("businessType", value)}
                >
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-400 mb-4">Primary Contact</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">First Name *</Label>
                  <Input
                    value={formData.contactFirstName}
                    onChange={(e) => updateFormData("contactFirstName", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Last Name *</Label>
                  <Input
                    value={formData.contactLastName}
                    onChange={(e) => updateFormData("contactLastName", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Email *</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Phone *</Label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData("contactPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Campaign Information */}
      {step === 2 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#C9A227]" />
              Campaign Registration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Describe how you will use SMS messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">Use Case *</Label>
              <Select
                value={formData.useCase}
                onValueChange={(value) => updateFormData("useCase", value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Select use case" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {useCases.map((uc) => (
                    <SelectItem key={uc.id} value={uc.id}>
                      {uc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Campaign Description *</Label>
              <Textarea
                value={formData.campaignDescription}
                onChange={(e) => updateFormData("campaignDescription", e.target.value)}
                placeholder="Describe the purpose of your SMS messages and how recipients will benefit..."
                className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Sample Messages * (2-5 required)</Label>
                {formData.sampleMessages.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSampleMessage}
                    className="border-slate-700 text-slate-300"
                  >
                    Add Message
                  </Button>
                )}
              </div>
              {formData.sampleMessages.map((msg, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-slate-400 text-sm">Sample {index + 1}</Label>
                  <Textarea
                    value={msg}
                    onChange={(e) => updateSampleMessage(index, e.target.value)}
                    placeholder="Enter a sample message you would send to customers..."
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-white">Opt-in Process *</Label>
              <Textarea
                value={formData.optInProcess}
                onChange={(e) => updateFormData("optInProcess", e.target.value)}
                placeholder="Describe how users consent to receive messages (e.g., checkbox on signup form, verbal consent during call)..."
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Opt-out Process *</Label>
              <Input
                value={formData.optOutProcess}
                onChange={(e) => updateFormData("optOutProcess", e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Estimated Monthly Volume *</Label>
              <Select
                value={formData.monthlyMessageVolume}
                onValueChange={(value) => updateFormData("monthlyMessageVolume", value)}
              >
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Select volume" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="low">Low (under 1,000/month)</SelectItem>
                  <SelectItem value="medium">Medium (1,000 - 10,000/month)</SelectItem>
                  <SelectItem value="high">High (10,000 - 100,000/month)</SelectItem>
                  <SelectItem value="very_high">Very High (100,000+/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-slate-700 text-slate-300"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review and Submit */}
      {step === 3 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#C9A227]" />
              Review & Submit
            </CardTitle>
            <CardDescription className="text-slate-400">
              Review your information before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brand Summary */}
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Brand Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-slate-400">Business Name:</p>
                <p className="text-white">{formData.legalBusinessName}</p>
                <p className="text-slate-400">EIN:</p>
                <p className="text-white">{formData.ein}</p>
                <p className="text-slate-400">Website:</p>
                <p className="text-white">{formData.websiteUrl}</p>
                <p className="text-slate-400">Contact:</p>
                <p className="text-white">{formData.contactFirstName} {formData.contactLastName}</p>
              </div>
            </div>

            {/* Campaign Summary */}
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Campaign Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-slate-400">Use Case:</p>
                <p className="text-white capitalize">{formData.useCase.replace("_", " ")}</p>
                <p className="text-slate-400">Volume:</p>
                <p className="text-white capitalize">{formData.monthlyMessageVolume}</p>
              </div>
              <div className="mt-3">
                <p className="text-slate-400 text-sm">Description:</p>
                <p className="text-white text-sm mt-1">{formData.campaignDescription}</p>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => updateFormData("termsAccepted", e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-300">
                I certify that all information provided is accurate and I agree to comply with
                carrier messaging policies and TCPA regulations. I understand that providing
                false information may result in rejection or suspension of messaging privileges.
              </label>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="border-slate-700 text-slate-300"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted || isSubmitting}
                className="bg-[#C9A227] hover:bg-[#B8921F] text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Submit Registration
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
