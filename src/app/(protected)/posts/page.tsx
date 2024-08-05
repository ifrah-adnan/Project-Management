import React from "react";
import { findMany } from "./_utils/actions";
import List from "./_components/list";
import ClientList from "./_components/ClientList";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await findMany(searchParams);
  return (
    <main className="flex flex-col">
      <ClientList {...result} />
    </main>
  );
}
