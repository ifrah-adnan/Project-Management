"use client";
import React, { useState } from "react";
import { TData } from "../../_utils/schemas";
import List from "../list";
import Header from "../header";
export default function ClientList({
  data,
  total,
}: {
  data: any;
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
