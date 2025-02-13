"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { useSession } from "@/components/session-provider";
import { useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis, PencilIcon, Trash2Icon, ArrowUpDown } from "lucide-react";
import { EditOperationButton } from "../edit-operation-button";
import { ConfirmButton } from "@/components/confirm-button";
import { handleDeleteO } from "../../_utils/actions";

interface Operation {
  id: string;
  name: string;
  code: string; // Nous gardons cela comme une chaîne, mais nous le traiterons comme un nombre pour le tri
  icon?: string;
  description: string;
  isFinal: boolean;
}

interface ListProps {
  data: Operation[];
  userId: string;
  searchTerm: string;
}

type SortOrder = "asc" | "desc" | null;

const List: React.FC<ListProps> = ({ data, userId, searchTerm }) => {
  const { session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const [filteredData, setFilteredData] = useState<Operation[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === null) return "asc";
      if (prevOrder === "asc") return "desc";
      return null;
    });
  };

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortOrder) {
      filtered.sort((a, b) => {
        const codeA = Number.parseInt(a.code, 10);
        const codeB = Number.parseInt(b.code, 10);
        if (sortOrder === "asc") {
          return codeA - codeB;
        } else {
          return codeB - codeA;
        }
      });
    }

    setFilteredData(filtered);
  }, [data, searchTerm, sortOrder]);

  return (
    <div className="h-1 flex-1 p-3">
      <Card className="flex h-full flex-1 flex-col overflow-auto p-1">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th className="cursor-pointer" onClick={toggleSortOrder}>
                Code
                <ArrowUpDown className="ml-2 inline-block h-4 w-4" />
                {sortOrder && (
                  <span className="ml-1 text-xs">
                    ({sortOrder === "asc" ? "↑" : "↓"})
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>
                  {(user.role === "ADMIN" || user.role === "SYS_ADMIN") && (
                    <Popover>
                      <PopoverTrigger>
                        <Ellipsis size={16} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="flex w-fit flex-col gap-1 sm:gap-2"
                      >
                        <EditOperationButton
                          operation={item}
                          variant="ghost"
                          className="justify-start gap-1 bg-none px-3 text-xs hover:text-sky-500 sm:gap-2 sm:px-6 sm:text-sm"
                        >
                          <PencilIcon size={16} />
                          <span>Edit</span>
                        </EditOperationButton>
                        <ConfirmButton
                          variant="ghost"
                          size="icon"
                          className="flex w-full justify-start gap-1 rounded-md px-3 text-xs hover:text-red-500 sm:gap-2 sm:px-6 sm:text-sm"
                          action={async () => {
                            await handleDeleteO(item.id);
                          }}
                        >
                          <Trash2Icon size={16} />
                          <span>Delete</span>
                        </ConfirmButton>
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
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
