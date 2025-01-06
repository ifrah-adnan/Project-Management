import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductDetails from "./component/ProductId";

export type ProjectOperation = {
  id: string;
  description: string | null;
  time: number;
  operation: {
    id: string;
    name: string;
  };
};

export type Project = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  status: boolean;
  organizationId: string;
  workFlowId: string | null;
  createdAt: Date;
  updatedAt: Date;
  projectOperations: ProjectOperation[];
};

async function getProject(id: string): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id },
    include: {
      projectOperations: {
        include: {
          operation: true,
        },
      },
    },
  });

  if (!project) notFound();

  return project as Project;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  return <ProductDetails project={project} />;
}
