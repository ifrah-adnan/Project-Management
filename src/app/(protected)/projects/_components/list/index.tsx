"use client";
import React from "react";
import { TData } from "../../_utils/schemas";
import { useStore } from "../../_utils/store";
import { GridView } from "../grid-view";
import { ListView } from "../list-view";

export default function List({
  data,
  total,
  searchTerm,
}: {
  data: TData;
  total: number;
  userId: string;
  searchTerm: string;
}) {
  const { view } = useStore();
  return (
    <main className="p-6">
      {view === "list" ? (
        <ListView data={data} searchTerm={searchTerm} />
      ) : (
        <GridView data={data} />
      )}
    </main>
  );
}
