"use client";
import React, { useState, useEffect } from "react";
import Header from "../header";
import List from "../list";
import { TData } from "../../_utils/schemas";

type ClientListProps = {
  data: TData;
  total: number;
  userId: string;
};

export default function ClientList({ data, total, userId }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <List data={data} total={total} userId={userId} searchTerm={searchTerm} />
    </>
  );
}
