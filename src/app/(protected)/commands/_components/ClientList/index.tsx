"use client";
import React, { useState } from "react";
import { TData, TData2 } from "../../_utils/schemas";
import List from "../list";
import Header from "../header";
export default function ClientList({
  data,
  total,
}: {
  data: TData2;
  total: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <List data={data} total={total} searchTerm={searchTerm} />
    </>
  );
}
