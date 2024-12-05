import { User, Operation, Command, Project } from "@prisma/client";

export interface ExtendedPlanning {
  id: string;
  operatorId: string;
  postId: string;
  commandProjectId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  operations: { operationId: string; operation: Operation }[];
  operator: User;
}

export interface ExtendedCommandProject {
  id: string;
  userId: string;
  commandId: string;
  projectId: string;
  organizationId: string;
  target: number;
  done: number;
  startDate: Date | null;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  command: Command;
  project: Project;
}
