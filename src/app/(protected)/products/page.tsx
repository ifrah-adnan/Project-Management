import React from "react";
import Header from "./_components/header";
import { findMany } from "./_utils/actions";
import List from "./_components/list";
import { getOperations } from "../expertise/_utils/actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await findMany(searchParams);
  const operations = await getOperations();

  return (
    <main className="flex flex-col">
      <Header operations={operations} />
      <List {...result} />
    </main>
  );
}
