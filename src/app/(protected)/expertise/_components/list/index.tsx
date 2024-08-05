"use client";

import { useSession } from "@/components/session-provider";
import React, { useEffect, useState } from "react";
import { TData } from "../../_utils/schemas";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import { CalendarIcon, Ellipsis, PencilIcon, Trash2Icon } from "lucide-react";
import ParamsPagination from "@/components/params-pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditExpertiseButton } from "../edit-expertise-button";
import { handleDelete } from "../../_utils/actions";
import { getServerSession } from "@/lib/auth";
export default function List({
  data,
  total,
  searchTerm,
}: {
  data: TData;
  total: number;
  searchTerm: string;
}) {
  const { session } = useSession();
  const user = session?.user;
  const [filteredData, setFilteredData] = useState<TData>([]);
  const [organizationId, setOrganizationId] = useState<any>("");
  console.log(user);
  console.log(data);

  useEffect(() => {
    const fetchOrganizationImage = async () => {
      const serverSession = await getServerSession();
      const orgId =
        serverSession?.user.organizationId ||
        serverSession?.user.organization?.id;
      setOrganizationId(orgId);
    };

    fetchOrganizationImage();
  }, []);

  useEffect(() => {
    if (organizationId && data.length > 0) {
      let filtered = data.filter(
        (item) => item.organizationId === organizationId,
      );

      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredData(filtered);
    }
  }, [organizationId, data, searchTerm]);
  console.log(searchTerm, "llllll");

  console.log("filteredData", filteredData);
  return (
    <main className="p-2 sm:p-4 md:p-6">
      <Card className="mx-auto flex h-full w-full max-w-screen-2xl flex-1 flex-col overflow-auto p-2 sm:p-4">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-xs sm:text-sm">
                <th className="p-2 sm:p-3">Name</th>
                <th className="p-2 sm:p-3">Code</th>
                <th className="p-2 sm:p-3">Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="text-xs sm:text-sm">
                  <td className="p-2 sm:p-3">{item.name}</td>
                  <td className="p-2 sm:p-3">{item.code}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <div className="max-w-[8rem] truncate sm:max-w-[20rem]">
                        {item.operations.map((op) => op.name).join(", ")}
                      </div>
                      {(user.role === "ADMIN" || user.role === "SYS_ADMIN") && (
                        <Popover>
                          <PopoverTrigger>
                            <Ellipsis size={16} />
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="flex w-fit flex-col gap-1 sm:gap-2"
                          >
                            <EditExpertiseButton
                              expertise={item}
                              variant="ghost"
                              className="justify-start gap-1 bg-none px-3 text-xs hover:text-sky-500 sm:gap-2 sm:px-6 sm:text-sm"
                            >
                              <PencilIcon size={14} className="sm:size-16" />
                              <span>Edit</span>
                            </EditExpertiseButton>
                            <ConfirmButton
                              variant="ghost"
                              size="icon"
                              className="flex w-full justify-start gap-1 rounded-md px-3 text-xs hover:text-red-500 sm:gap-2 sm:px-6 sm:text-sm"
                              action={async () => {
                                await handleDelete(item.id, user.id);
                              }}
                            >
                              <Trash2Icon size={14} className="sm:size-16" />
                              <span>Delete</span>
                            </ConfirmButton>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {data.length === 0 && (
          <div className="grid flex-1 place-content-center">
            <span className="text-center text-xl font-semibold opacity-50 sm:text-2xl md:text-3xl">
              No Data
            </span>
          </div>
        )}
        <div className="mt-auto flex justify-end px-2 pb-2 pt-1 sm:px-4 sm:pb-4">
          <ParamsPagination total={total} />
        </div>
      </Card>
    </main>
  );
}
