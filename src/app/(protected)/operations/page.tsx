import React from "react";
import Header from "./_components/header";
import List from "./_components/list";
import { findMany } from "./_utils/actions";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientList from "./_components/clientList";
import { getOperations } from "../expertise/_utils/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const operations = await getOperations();
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  console.log("this is operations", operations);

  return (
    <main className="flex flex-col">
      <ClientList operations={operations} userId={session.user.id} />
    </main>
  );
}
