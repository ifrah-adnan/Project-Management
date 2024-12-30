"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";
import List from "../list";
import { TData } from "../../_utils/schemas";

export default function ClientList({
  data,
  total,
}: {
  data: TData;
  total: number;
}) {
  //   const result = await findMany(searchParams);
  //   const operations = await getOperations();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {}, [searchTerm]);
  return (
    <main className="flex flex-col">
      <Header onSearch={setSearchTerm} />
      <List data={data} total={total} />
    </main>
  );
}
