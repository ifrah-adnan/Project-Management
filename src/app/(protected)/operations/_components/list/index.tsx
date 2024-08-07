"use client";
import React, { useEffect, useState } from "react";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { useSession } from "@/components/session-provider";
import { useSearchParams } from "next/navigation";
import IconComponent from "../IconComponent";

interface Operation {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  isFinal: boolean;
  estimatedTime: number;
}

interface ListProps {
  data: Operation[];
  userId: string;
  searchTerm: string;
}

const List: React.FC<ListProps> = ({ data, userId, searchTerm }) => {
  const { session } = useSession();
  const searchParams = useSearchParams();
  const [filteredData, setFilteredData] = useState<Operation[]>([]);

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredData(filtered);
  }, [data, searchTerm]);

  return (
    <div className="h-1 flex-1 p-3">
      <Card className="flex h-full flex-1 flex-col overflow-auto p-1">
        <Table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Is Final</th>
              <th>Estimated Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>
                  <IconComponent iconName={item.icon} />
                </td>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.description}</td>
                <td>{item.isFinal ? "Yes" : "No"}</td>
                <td>{item.estimatedTime} minutes</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="mt-auto flex justify-end px-4 pb-4 pt-1">
          {/* If pagination is needed, adjust it here */}
        </div>
      </Card>
    </div>
  );
};

export default List;
