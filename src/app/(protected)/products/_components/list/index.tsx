import React from "react";
import dynamic from "next/dynamic";
import { TData } from "../../_utils/schemas";

const ClientListView = dynamic(() => import("../Client-listView"), {
  ssr: false,
});

export default function List({ data, total }: { data: TData; total: number }) {
  return (
    <main className="h-1 flex-1 p-6">
      <ClientListView data={data} total={total} />
    </main>
  );
}
