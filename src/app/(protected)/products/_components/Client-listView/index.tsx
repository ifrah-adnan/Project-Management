"use client";

import React from "react";
import { TData } from "../../_utils/schemas";
import ListView from "../list-view";
import Grid from "../grid-view";
import { useStore } from "../../_utils/store";

export default function ClientListView({
  data,
  total,
}: {
  data: TData;
  total: number;
}) {
  const { view } = useStore();

  return (
    <>
      {view === "list" ? (
        <ListView data={data} total={total} />
      ) : (
        <Grid data={data} total={total} />
      )}
    </>
  );
}
