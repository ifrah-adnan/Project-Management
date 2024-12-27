import React from "react";
import type { TData2 } from "../../_utils/schemas";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import { handleDelete } from "../../_utils/actions";
import ParamsPagination from "@/components/params-pagination";
import { Ellipsis, PencilIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditCommandButton } from "../edit-command-button";
import Link from "next/link";

export function GridView({
  data,
  total,
  user,
}: {
  data: TData2;
  total: number;
  user: any;
}) {
  return (
    <Card className="mx-auto flex h-full w-full max-w-screen-2xl flex-1 flex-col overflow-auto p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/commands/${item.id}`}
                className="text-lg font-semibold text-blue-500 hover:underline"
              >
                {item.reference}
              </Link>
              {(user.role === "ADMIN" || user.role === "SYS_ADMIN") && (
                <Popover>
                  <PopoverTrigger>
                    <Ellipsis size={16} />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="flex w-fit flex-col gap-2"
                  >
                    <EditCommandButton
                      variant="ghost"
                      commands={item}
                      className="justify-start gap-2 bg-none px-6 hover:text-sky-500"
                    >
                      <PencilIcon size={16} />
                      <span>Edit</span>
                    </EditCommandButton>
                    <ConfirmButton
                      variant="ghost"
                      size="icon"
                      className="flex w-full justify-start gap-2 rounded-md px-6 hover:text-red-500"
                      action={async () => {
                        await handleDelete(item.id, user.id);
                      }}
                    >
                      <Trash2Icon size={18} />
                      <span>Delete</span>
                    </ConfirmButton>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="mt-4">
              {item.client ? (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 border-2 border-[#E6B3BA]">
                    <AvatarImage
                      src={item.client?.image || ""}
                      alt={item.client?.name}
                    />
                    <AvatarFallback className="font-bold">
                      {`${item.client?.name.charAt(0).toUpperCase()}`}
                    </AvatarFallback>
                  </Avatar>
                  <span className="capitalize">{item.client?.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-500">
                  No client assigned
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
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
  );
}
