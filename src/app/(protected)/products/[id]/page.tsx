import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateProject } from "./utils/action";

// Define types for the project and its related data
type ProjectOperation = {
  id: string;
  description: string | null;
  time: number;
  operation: {
    name: string;
  };
};

type WorkflowNode = {
  id: string;
  data: {
    time: number;
    position: {
      x: number;
      y: number;
    };
  };
  operation: {
    name: string;
  };
};

type WorkflowEdge = {
  id: string;
  sourceId: string;
  targetId: string;
};

type Project = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: boolean;
  projectOperations: ProjectOperation[];
  workFlow: {
    WorkflowNode: WorkflowNode[];
    WorkFlowEdge: WorkflowEdge[];
  } | null;
};

async function getProject(id: string): Promise<Project> {
  const project = await db.project.findUnique({
    where: { id },
    include: {
      workFlow: {
        include: {
          WorkflowNode: {
            include: {
              operation: true,
            },
          },
          WorkFlowEdge: true,
        },
      },
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

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                View and edit project information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateProject.bind(null, project.id)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={project.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" name="code" defaultValue={project.code} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={project.description || ""}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="status"
                      name="status"
                      defaultChecked={project.status}
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                  <div>
                    <Button type="submit">Update Project</Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>Project Operations</CardTitle>
              <CardDescription>
                View all operations associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Time (minutes)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.projectOperations.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell>{po.operation.name}</TableCell>
                      <TableCell>{po.description || "N/A"}</TableCell>
                      <TableCell>{po.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Project Workflow</CardTitle>
              <CardDescription>
                View the workflow for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Nodes</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operation</TableHead>
                        <TableHead>Time (minutes)</TableHead>
                        <TableHead>Position</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.workFlow?.WorkflowNode.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell>{node.operation.name}</TableCell>
                          <TableCell>{node.data.time}</TableCell>
                          <TableCell>
                            x: {node.data.position.x}, y: {node.data.position.y}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Edges</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.workFlow?.WorkFlowEdge.map((edge) => (
                        <TableRow key={edge.id}>
                          <TableCell>{edge.sourceId}</TableCell>
                          <TableCell>{edge.targetId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
