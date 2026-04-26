import { SignUp } from "@clerk/nextjs";
import { Check } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
        <p className="text-white/70">Create your SMB Voice account in under a minute</p>
      </div>

      {/* Trial confirmation */}
      <div className="mb-6 w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-[#C9A227] text-white text-xs font-semibold rounded-full">
            14-DAY FREE TRIAL
          </span>
          <span className="text-white/80 text-sm">No credit card required</span>
        </div>
        <p className="text-white text-sm font-semibold mb-2">You&apos;re starting with the Starter plan ($7.95/month after trial)</p>
        <ul className="space-y-1 text-white/80 text-xs">
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-[#C9A227]" /> 1 Local or Toll-Free Number</li>
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-[#C9A227]" /> Unlimited Calling (US &amp; Canada)</li>
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-[#C9A227]" /> 500 SMS Messages</li>
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-[#C9A227]" /> Basic AI Receptionist</li>
          <li className="flex items-center gap-2"><Check className="h-3 w-3 text-[#C9A227]" /> Cancel anytime</li>
        </ul>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white shadow-2xl rounded-2xl",
            headerBox: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formButtonPrimary:
              "bg-gradient-to-r from-[#C9A227] to-[#DEB44A] hover:from-[#B8922A] hover:to-[#CDA33D] text-white",
            formFieldInput:
              "border-gray-200 focus:border-[#C9A227] focus:ring-[#C9A227]",
            footerActionLink: "text-[#C9A227] hover:text-[#B8922A]",
          },
        }}
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
