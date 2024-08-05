"use client";
import React, { useState, useEffect } from "react";
import { TData } from "../../_utils/schemas";
import List from "../list";
import Header from "../header";

export default function ClientList({
  data,
  total,
}: {
  data: TData;
  total: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Search term updated:", term);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <List data={data} total={total} searchTerm={searchTerm} />
    </>
  );
}
