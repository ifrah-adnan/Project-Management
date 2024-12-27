"use client";
import React from "react";
import { TData } from "../../_utils/schemas";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import { deleteById } from "../../_utils/actions";
import { GitBranchPlusIcon, Trash2Icon } from "lucide-react";
import { revalidatePath } from "next/cache";
import ParamsPagination from "@/components/params-pagination";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useStore } from "../../_utils/store";
import Grid from "../grid-view";
import ListView from "../list-view";

export default function List({ data, total }: { data: TData; total: number }) {
  const { view } = useStore();

  return (
    <main className="h-1 flex-1 p-6">
      {view === "list" ? (
        <ListView data={data} total={total} />
      ) : (
        <Grid data={data} total={total} />
      )}
    </main>
  );
}
