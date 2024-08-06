import React from "react";
import ListO from "./_component/list";
import Header from "./_component/header";
import { OrganizationfindMany, getOrganizations } from "./_utils/action";
import { AdminComponent } from "../projects/_components/AdminComponent";
import AdminComponentList from "./_component/AdminComponentList";

export default async function Organizations({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await OrganizationfindMany(searchParams);

  if (
    !result ||
    !result.data ||
    !Array.isArray(result.data) ||
    typeof result.total !== "number"
  ) {
    return <div>Error loading data</div>;
  }

  return (
    <main className="flex flex-col">
      <AdminComponentList data={result.data} total={result.total} />
    </main>
  );
}
