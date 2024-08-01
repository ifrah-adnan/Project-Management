import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/components/session-provider";
import SideBarLayout from "./_components/sideBarLayout.tsx";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  return (
    <SessionProvider session={session}>
      <main className="flex h-screen w-full text-sm">
        <SideBarLayout>{children}</SideBarLayout>
      </main>
    </SessionProvider>
  );
}
