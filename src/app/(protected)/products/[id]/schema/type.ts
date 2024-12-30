type Operation = {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  organizationId: string;
  description: string | null;
  isFinal: boolean;
  createdAt: Date;
  updatedAt: Date;
  expertiseId: string | null;
};

type ProjectOperation = {
  id: string;
  description: string | null;
  time: number;
  projectId: string;
  operationId: string;
  createdAt: Date;
  updatedAt: Date;
  operation: Operation;
};

type WorkflowNode = {
  id: string;
  workFlowId: string;
  operationId: string;
  data: {
    time: number;
    position: {
      x: number;
      y: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  operation: Operation;
};

type WorkflowEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  workFlowId: string;
  data: any;
  count: number;
  createdAt: Date;
  updatedAt: Date;
};

type WorkFlow = {
  id: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  WorkflowNode: WorkflowNode[];
  WorkFlowEdge: WorkflowEdge[];
};

// This type now matches the Prisma query result
export type Project = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  projectOperations: (ProjectOperation & {
    operation: Operation;
  })[];
  workFlow:
    | (WorkFlow & {
        WorkflowNode: (WorkflowNode & {
          operation: Operation;
        })[];
        WorkFlowEdge: WorkflowEdge[];
      })
    | null;
};
