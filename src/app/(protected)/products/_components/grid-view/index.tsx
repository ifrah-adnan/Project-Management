"use client";
import React from "react";
import { TData } from "../../_utils/schemas";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import { deleteById, deleteProductAndRevalidate } from "../../_utils/actions";
import { GitBranchPlusIcon, Trash2Icon } from "lucide-react";
import { revalidatePath } from "next/cache";
import ParamsPagination from "@/components/params-pagination";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Grid({ data, total }: { data: TData; total: number }) {
  return (
    <div className="h-1 flex-1 p-4">
      <div className="mx-auto grid h-full max-w-screen-2xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardContent className="flex-grow p-4">
              <h3 className="text-lg font-semibold">{item.code}</h3>
              <p className="text-sm text-gray-500">name: {item.name}</p>
              <p className="text-sm text-gray-500">
                Status: {item.status ? "Active" : "Inactive"}
              </p>
              <p className="text-sm text-gray-500">
                Created: {format(new Date(item.createdAt), "PP")}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
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
              <ConfirmButton
                variant="ghost"
                size="icon"
                className="size-7"
                action={() => deleteProductAndRevalidate(item.id)}
              >
                <Trash2Icon size={18} />
              </ConfirmButton>
            </CardFooter>
          </Card>
        ))}
        {data.length === 0 && (
          <div className="col-span-full grid place-content-center">
            <span className="text-center text-3xl font-semibold opacity-50">
              No Data
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end px-4">
        <ParamsPagination total={total} />
      </div>
    </div>
  );
}
