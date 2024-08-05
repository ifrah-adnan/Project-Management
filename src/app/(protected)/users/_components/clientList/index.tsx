"use client";
import React, { useState, useEffect } from "react";
import { TData } from "../../_utils/schemas";
import List from "../list";
import Header from "../header";

export default function ClientList({
  data,
  total,
  userId,
}: {
  data: TData;
  total: number;
  userId: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <List data={data} total={total} userId={userId} searchTerm={searchTerm} />
    </>
  );
}
