import React from "react";
import ListH from "./_component";
import { getHistory } from "./_utils/action";
import { useSession } from "@/components/session-provider";

export default async function History() {
  const result = await getHistory();

  return <ListH data={result} />;
}
