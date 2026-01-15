import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
        <p className="text-white/70">Create your account in under a minute</p>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white shadow-2xl rounded-2xl",
            headerTitle: "text-[#1E3A5F]",
            headerSubtitle: "text-gray-600",
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
