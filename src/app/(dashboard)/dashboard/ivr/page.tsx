import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { IVRBuilder } from "@/components/dashboard/ivr-builder";

export const metadata: Metadata = {
  title: "IVR Menu | SMB Voice",
  description: "Build and manage your phone menu system",
};

export default async function IVRPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Phone Menu (IVR)</h1>
        <p className="text-gray-500 mt-1">
          Create a professional phone menu for your callers
        </p>
      </div>

      {/* IVR Builder Component */}
      <IVRBuilder />
    </div>
  );
}
