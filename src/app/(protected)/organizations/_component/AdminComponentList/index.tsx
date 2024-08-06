"use client";
import React, { useState } from "react";
import Header from "../header";
import { TData } from "../../_utils/action";
import { AdminComponent } from "@/app/(protected)/projects/_components/AdminComponent";

interface OrganizationsProps {
  searchParams: Record<string, string>;
}
interface AdminComponentListProps {
  data: TData;
  total: number;
}

const AdminComponentList: React.FC<AdminComponentListProps> = ({
  data,
  total,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="flex flex-col">
      <Header onSearch={setSearchTerm} />
      <AdminComponent data={data} total={total} searchTerm={searchTerm} />
    </main>
  );
};

export default AdminComponentList;
