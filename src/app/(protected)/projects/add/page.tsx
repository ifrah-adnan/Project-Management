import React from "react";
import {
  getCommands,
  getProjects,
} from "@/app/(protected)/commands/_utils/actions";
import { findMany } from "../../products/_utils/actions";
import CommandProjectForm from "./components/CommandProjectForm";

export default async function ProjectsAddPage() {
  const projects = await getProjects();
  const commands = await getCommands();

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Command Project</h1>
      <CommandProjectForm projects={projects} commands={commands} />
    </div>
  );
}
