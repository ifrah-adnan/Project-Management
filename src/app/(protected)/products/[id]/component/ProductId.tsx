"use client";

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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  FileText,
  Activity,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Settings,
  Save,
} from "lucide-react";
import { updateProject } from "../utils/action";
import { Project } from "../schema/type";

const ProjectStatusBadge = ({ status }: { status: boolean }) => {
  return status ? (
    <Badge className="bg-green-100 text-green-800 transition-colors hover:bg-green-200">
      <CheckCircle2 className="mr-1 h-3 w-3" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="bg-gray-100 text-gray-800 transition-colors hover:bg-gray-200"
    >
      <AlertCircle className="mr-1 h-3 w-3" />
      Inactive
    </Badge>
  );
};

interface ProjectDetailsProps {
  project: any;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Code: {project.code}
            </span>
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-8">
        <Card className="border-none bg-white/50 shadow-lg backdrop-blur-sm">
          <CardContent className="p-2">
            <TabsList className="grid w-full grid-cols-3 gap-4 p-2">
              <TabsTrigger
                value="details"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2 py-2">
                  <FileText className="h-4 w-4" />
                  Details
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="operations"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2 py-2">
                  <Activity className="h-4 w-4" />
                  Operations
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex items-center gap-2 py-2">
                  <Share2 className="h-4 w-4" />
                  Workflow
                </div>
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <TabsContent value="details">
            <Card className="border-none bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-1 border-b bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Project Details</CardTitle>
                    <CardDescription>
                      View and edit project information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form
                  action={updateProject.bind(null, project.id)}
                  className="space-y-6"
                >
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Project Name
                      </Label>
                      <Input
                        name="name"
                        defaultValue={project.name}
                        className="w-full transition-all focus:ring-2 focus:ring-primary lg:w-2/3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Project Code
                      </Label>
                      <Input
                        name="code"
                        defaultValue={project.code || ""}
                        className="w-full transition-all focus:ring-2 focus:ring-primary lg:w-1/3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        name="description"
                        defaultValue={project.description || ""}
                        className="min-h-[120px] transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        name="status"
                        defaultChecked={project.status}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label className="font-medium">Project Status</Label>
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="bg-primary transition-colors hover:bg-primary/90"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <Card className="border-none bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader className="space-y-1 border-b bg-gray-50/50">
                <CardTitle className="text-2xl">Operations Overview</CardTitle>
                <CardDescription>
                  Track and manage project operations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ScrollArea className="h-[400px] rounded-md border">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white">
                      <TableRow className="hover:bg-gray-50/50">
                        <TableHead className="font-semibold">
                          Operation
                        </TableHead>
                        <TableHead className="font-semibold">
                          Description
                        </TableHead>
                        <TableHead className="text-right font-semibold">
                          Duration
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.projectOperations.map((po: any) => (
                        <TableRow
                          key={po.id}
                          className="cursor-pointer transition-colors hover:bg-gray-50/50"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-primary" />
                              {po.operation.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {po.description || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{po.time} min</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <Card className="border-none bg-white/80 shadow-xl backdrop-blur-sm">
              <CardHeader className="space-y-1 border-b bg-gray-50/50">
                <CardTitle className="text-2xl">Workflow Diagram</CardTitle>
                <CardDescription>
                  Visual representation of project dependencies
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        Workflow Nodes
                      </h3>
                    </div>

                    <ScrollArea className="h-[300px] rounded-md border">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white">
                          <TableRow>
                            <TableHead className="font-semibold">
                              Node
                            </TableHead>
                            <TableHead className="font-semibold">
                              Time
                            </TableHead>
                            <TableHead className="font-semibold">
                              Position
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {project.workFlow?.WorkflowNode.map((node: any) => (
                            <TableRow
                              key={node.id}
                              className="hover:bg-gray-50/50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Activity className="h-4 w-4 text-primary" />
                                  {node.operation.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {node.data.time} min
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <code className="rounded bg-gray-100 px-2 py-1">
                                  ({node.data.position.x},{" "}
                                  {node.data.position.y})
                                </code>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <Share2 className="h-5 w-5 text-primary" />
                        Node Connections
                      </h3>
                    </div>

                    <ScrollArea className="h-[200px] rounded-md border">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white">
                          <TableRow>
                            <TableHead className="font-semibold">
                              Source
                            </TableHead>
                            <TableHead className="font-semibold">
                              Target
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {project.workFlow?.WorkFlowEdge.map((edge: any) => (
                            <TableRow
                              key={edge.id}
                              className="hover:bg-gray-50/50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <code className="rounded bg-gray-100 px-2 py-1">
                                    {edge.sourceId}
                                  </code>
                                  <ArrowRight className="h-4 w-4 text-gray-400" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="rounded bg-gray-100 px-2 py-1">
                                  {edge.targetId}
                                </code>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
