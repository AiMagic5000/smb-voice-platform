import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ContactList } from "@/components/dashboard/contact-list";

export const metadata: Metadata = {
  title: "Contacts | SMB Voice",
  description: "Manage your business contacts and call history",
};

export default async function ContactsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Contacts</h1>
        <p className="text-gray-500 mt-1">
          Manage your business contacts and communication history
        </p>
      </div>

      {/* Contact List Component */}
      <ContactList />
    </div>
  );
}
