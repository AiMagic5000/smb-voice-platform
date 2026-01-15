"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Loader2,
  FileText,
  ArrowRight,
} from "lucide-react";

type ImportStep = "upload" | "mapping" | "preview" | "importing" | "complete";

type ImportedContact = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  company?: string;
  isValid: boolean;
  errors?: string[];
};

const sampleContacts: ImportedContact[] = [
  { firstName: "John", lastName: "Smith", phone: "+15551234567", email: "john@example.com", company: "ABC Corp", isValid: true },
  { firstName: "Sarah", lastName: "Johnson", phone: "+15552345678", email: "sarah@example.com", isValid: true },
  { firstName: "Mike", lastName: "Chen", phone: "invalid", email: "mike@example.com", isValid: false, errors: ["Invalid phone number"] },
  { firstName: "", lastName: "Wilson", phone: "+15554567890", isValid: false, errors: ["First name is required"] },
  { firstName: "Emily", lastName: "Brown", phone: "+15555678901", company: "Tech Inc", isValid: true },
];

export function ContactImport() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [contacts, setContacts] = useState<ImportedContact[]>([]);

  const validContacts = contacts.filter((c) => c.isValid);
  const invalidContacts = contacts.filter((c) => !c.isValid);

  const handleFileUpload = () => {
    // Simulate file processing
    setContacts(sampleContacts);
    setStep("preview");
  };

  const handleImport = () => {
    setStep("importing");
    // Simulate import progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep("complete");
      }
    }, 200);
  };

  const handleExport = (format: "csv" | "xlsx") => {
    // Simulate export
    alert(`Exporting contacts as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white">
            Import & Export Contacts
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Bulk manage your contact list
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleExport("xlsx")}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {(["upload", "preview", "importing", "complete"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-[#C9A227] text-white"
                  : ["preview", "importing", "complete"].indexOf(step) >= ["upload", "preview", "importing", "complete"].indexOf(s)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {["preview", "importing", "complete"].indexOf(step) > ["upload", "preview", "importing", "complete"].indexOf(s) ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-sm ${step === s ? "font-medium text-[#1E3A5F] dark:text-white" : "text-gray-500"}`}>
              {s === "upload" ? "Upload" : s === "preview" ? "Preview" : s === "importing" ? "Import" : "Complete"}
            </span>
            {i < 3 && <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-8">
                <div
                  className="border-2 border-dashed rounded-xl p-12 text-center hover:border-[#C9A227] transition-colors cursor-pointer dark:border-gray-700"
                  onClick={handleFileUpload}
                >
                  <FileSpreadsheet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-2">
                    Drop your file here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Supports CSV, XLSX, and XLS formats
                  </p>
                  <Button className="btn-primary gap-2">
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-[#1E3A5F] dark:text-white mb-2">Required columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">First Name</Badge>
                    <Badge variant="outline">Last Name</Badge>
                    <Badge variant="outline">Phone</Badge>
                  </div>
                  <h4 className="font-medium text-[#1E3A5F] dark:text-white mt-4 mb-2">Optional columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Email</Badge>
                    <Badge variant="outline">Company</Badge>
                    <Badge variant="outline">Department</Badge>
                    <Badge variant="outline">Notes</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                    <Users className="h-6 w-6 text-[#C9A227] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#1E3A5F] dark:text-white">{contacts.length}</div>
                    <div className="text-sm text-gray-500">Total Rows</div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{validContacts.length}</div>
                    <div className="text-sm text-gray-500">Valid</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                    <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{invalidContacts.length}</div>
                    <div className="text-sm text-gray-500">Errors</div>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((contact, i) => (
                        <tr key={i} className={`border-b dark:border-gray-800 ${!contact.isValid ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
                          <td className="py-3 px-4">
                            {contact.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <span className="text-xs text-red-500">{contact.errors?.[0]}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#1E3A5F] dark:text-white">
                            {contact.firstName} {contact.lastName}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{contact.phone}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{contact.email || "-"}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{contact.company || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep("upload")}>
                    Back
                  </Button>
                  <div className="flex items-center gap-3">
                    {invalidContacts.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {invalidContacts.length} contact(s) will be skipped
                      </p>
                    )}
                    <Button className="btn-primary gap-2" onClick={handleImport} disabled={validContacts.length === 0}>
                      Import {validContacts.length} Contacts
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "importing" && (
          <motion.div
            key="importing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 text-[#C9A227] animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1E3A5F] dark:text-white mb-2">
                  Importing Contacts...
                </h3>
                <p className="text-gray-500 mb-6">Please wait while we process your file</p>
                <div className="max-w-md mx-auto">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#C9A227]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E3A5F] dark:text-white mb-2">
                  Import Complete!
                </h3>
                <p className="text-gray-500 mb-6">
                  Successfully imported {validContacts.length} contacts
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => { setStep("upload"); setContacts([]); setProgress(0); }}>
                    Import More
                  </Button>
                  <Button className="btn-primary">
                    View Contacts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
