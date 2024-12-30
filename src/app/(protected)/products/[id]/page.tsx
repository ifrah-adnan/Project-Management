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
import { Activity, Clock, FileText, Share2 } from "lucide-react";

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
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-2 text-gray-500">Project Code: {project.code}</p>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Workflow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="border-none shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Project Details</CardTitle>
              <CardDescription>
                Update your project information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={updateProject.bind(null, project.id)}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Project Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={project.name}
                      className="w-full lg:w-2/3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Project Code
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      defaultValue={project.code}
                      className="w-full lg:w-1/3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={project.description || ""}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="status"
                      name="status"
                      defaultChecked={project.status}
                    />
                    <Label htmlFor="status" className="font-medium">
                      Project Active
                    </Label>
                  </div>
                </div>
                <Button type="submit" className="w-full lg:w-auto">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="border-none shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Operations Overview</CardTitle>
              <CardDescription>
                Manage and track all operations associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">
                        Operation Name
                      </TableHead>
                      <TableHead className="font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Duration
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.projectOperations.map((po) => (
                      <TableRow key={po.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {po.operation.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {po.description || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {po.time} min
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="border-none shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Workflow Diagram</CardTitle>
              <CardDescription>
                Visual representation of the project workflow and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Activity className="h-4 w-4" />
                    Workflow Nodes
                  </h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            Operation
                          </TableHead>
                          <TableHead className="font-semibold">
                            Duration
                          </TableHead>
                          <TableHead className="font-semibold">
                            Position
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.workFlow?.WorkflowNode.map((node) => (
                          <TableRow key={node.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              {node.operation.name}
                            </TableCell>
                            <TableCell>{node.data.time} min</TableCell>
                            <TableCell>
                              ({node.data.position.x}, {node.data.position.y})
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Share2 className="h-4 w-4" />
                    Connections
                  </h3>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            Source Node
                          </TableHead>
                          <TableHead className="font-semibold">
                            Target Node
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {project.workFlow?.WorkFlowEdge.map((edge) => (
                          <TableRow key={edge.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              {edge.sourceId}
                            </TableCell>
                            <TableCell className="font-medium">
                              {edge.targetId}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
