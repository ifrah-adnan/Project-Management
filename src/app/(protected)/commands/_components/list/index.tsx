"use client";

import React, { useEffect, useState } from "react";
import type { TData2 } from "../../_utils/schemas";
import { useSession } from "@/components/session-provider";
import { GridView } from "../grid-view";
import { ListView } from "../list-view";
import { useStore } from "../../_utils/store";

export default function List({
  data,
  total,
  searchTerm,
}: {
  data: TData2;
  total: number;
  searchTerm: string;
}) {
  const { view } = useStore();
  const { session } = useSession();
  const user = session?.user;
  const [filteredData, setFilteredData] = useState<TData2>([]);

  useEffect(() => {
    if (user) {
      let filtered = data.filter((item) =>
        item.reference.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [data, user, searchTerm]);

  return (
    <main className="h-1 flex-1 p-6">
      {view === "list" ? (
        <ListView data={filteredData} total={total} user={user} />
      ) : (
        <GridView data={filteredData} total={total} user={user} />
      )}
    </main>
  );
}
