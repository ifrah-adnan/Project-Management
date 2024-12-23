import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./_components/SettingForm";
import MainHeader from "./_components/MainHeader";

export const metadata: Metadata = {
  title: "Settings | Your App Name",
  description: "Manage your account and organization settings",
};

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col">
      <MainHeader name="Settings" />

      <SettingsForm />
    </main>
  );
}
