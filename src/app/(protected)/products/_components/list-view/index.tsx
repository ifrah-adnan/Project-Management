import React from "react";
import { TData } from "../../_utils/schemas";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import {
  GitBranchPlusIcon,
  Trash2Icon,
  PencilIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import ParamsPagination from "@/components/params-pagination";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteProductAndRevalidate } from "../../_utils/actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ListView({
  data,
  total,
}: {
  data: TData;
  total: number;
}) {
  return (
    <div className="h-full w-full flex-1 p-4">
      <Card className="mx-auto flex h-full max-w-screen-2xl flex-1 flex-col overflow-auto p-4">
        <Table>
          <thead>
            <tr>
              <th>name</th>
              <th>status</th>
              <th>created at</th>
              <th>operations</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.status ? "Active" : "Inactive"}</td>
                <td>
                  <span>{format(new Date(item.createdAt), "PP")}</span>
                </td>
                <td className="w-[15rem]">
                  <div className="flex items-center justify-between gap-4">
                    <Link href={`/projects/workflow3/${item.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-fit gap-2 bg-card py-1 font-normal"
                      >
                        <GitBranchPlusIcon size={16} />
                        <span>View operations</span>
                      </Button>
                    </Link>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreHorizontalIcon size={18} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0">
                        <Link
                          href={`/products/edit/${item.id}`}
                          className="flex items-center px-3 py-2 hover:bg-muted"
                        >
                          <EditIcon size={16} className="mr-2" />
                          <span>Edit</span>
                        </Link>
                        <ConfirmButton
                          variant="ghost"
                          size="sm"
                          className="flex w-full items-center px-3 py-2 hover:bg-muted"
                          action={() => deleteProductAndRevalidate(item.id)}
                        >
                          <TrashIcon size={16} className="mr-2" />
                          <span>Delete</span>
                        </ConfirmButton>
                      </PopoverContent>
                    </Popover>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {data.length === 0 && (
          <div className="grid flex-1 place-content-center">
            <span className="text-center text-3xl font-semibold opacity-50">
              No Data
            </span>
          </div>
        )}
        <div className="mt-auto flex justify-end px-4 pb-4 pt-1">
          <ParamsPagination total={total} />
        </div>
      </Card>
    </div>
  );
}
