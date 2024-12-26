"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createCommandProject } from "@/app/(protected)/projects/_utils/actions";
import { useSession } from "@/components/session-provider";

interface Project {
  id: string;
  name: string;
}

interface Command {
  id: string;
  reference: string;
}

interface CommandProjectFormProps {
  projects: Project[];
  commands: Command[];
}

export default function CommandProjectForm({
  projects,
  commands,
}: CommandProjectFormProps) {
  const [projectId, setProjectId] = useState("");
  const [commandId, setCommandId] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const router = useRouter();
  const session = useSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId || !commandId || !target || !deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      toast.error("The deadline cannot be in the past.");
      return;
    }

    try {
      const result = await createCommandProject(
        {
          project_id: projectId,
          command_id: commandId,
          target: parseInt(target),
          endDate: selectedDate,
        },
        session.session.user.id,
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Command Project created successfully");
        router.push("/projects"); // Redirect to projects list or wherever appropriate
      }
    } catch (error) {
      console.error("Error creating command project:", error);
      toast.error("An error occurred while creating the command project");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Command Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="project">Project</Label>
            <Select required onValueChange={setProjectId} value={projectId}>
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="command">Command</Label>
            <Select required onValueChange={setCommandId} value={commandId}>
              <SelectTrigger id="command">
                <SelectValue placeholder="Select a command" />
              </SelectTrigger>
              <SelectContent>
                {commands.map((command) => (
                  <SelectItem key={command.id} value={command.id}>
                    {command.reference}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <Button type="submit">Create Command Project</Button>
        </form>
      </CardContent>
    </Card>
  );
}
