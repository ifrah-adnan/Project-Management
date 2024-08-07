"use client";
import React, { useState } from "react";
import List from "../list";
import Header from "../header";

interface Operation {
  id: string;
  name: string;
  code: string;
  description: any;
  isFinal: boolean;
  estimatedTime: number;
  icon: string;
}

interface ClientListProps {
  operations: Operation[];
  userId: string;
}

export default function ClientList({ operations, userId }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <List data={operations} userId={userId} searchTerm={searchTerm} />
    </>
  );
}
