import { getProjectWithOperations } from "@/app/(protected)/products/_utils/actions";
import React from "react";
import { WorkflowDiagram } from "./component/WorklfowDiagram";

export default async function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectWithOperations(params.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="h-screen w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">{project.name} Workflow</h1>
      <WorkflowDiagram project={project} />
    </div>
  );
}
