"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Clock, FileText, Share2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Project } from "../page";
import { getOperations } from "@/app/(protected)/expertise/_utils/actions";
import { updateOperations, updateProject } from "../utils/action";
import TimeInput from "../../add/component/time-input";

interface Operation {
  id: string;
  name: string;
}

interface ProjectOperation {
  id: string;
  description: string | null;
  time: number;
  operation: {
    id: string;
    name: string;
  };
}

type OperationUpdateField = {
  operation: { id: string; name: string };
  description: string;
  time: number;
};

export default function ProductDetails({
  project: initialProject,
}: {
  project: Project;
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(initialProject);
  const [operations, setOperations] = useState<ProjectOperation[]>(
    initialProject.projectOperations,
  );
  const [availableOperations, setAvailableOperations] = useState<Operation[]>(
    [],
  );
  useEffect(() => {
    const fetchOperations = async () => {
      const ops = await getOperations();
      setAvailableOperations(ops);
    };
    fetchOperations();
  }, []);

  const handleUpdateProject = async (formData: FormData) => {
    const result = await updateProject(project.id, formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.result) {
      toast.success("Project updated successfully");
      setProject((prevProject) => ({
        ...prevProject,
        ...result.result,
        projectOperations: prevProject.projectOperations,
      }));
      router.refresh();
    }
  };

  const handleUpdateOperations = async () => {
    const result = await updateOperations(project.id, operations);
    if (result.error) {
      toast.error(result.error);
    } else if (result.result) {
      toast.success("Operations updated successfully");
      setProject((prevProject) => ({
        ...prevProject,
        projectOperations:
          result.result?.projectOperations || prevProject.projectOperations,
      }));
      router.refresh();
    }
  };

  const addOperation = () => {
    const newOperation: ProjectOperation = {
      id: `temp-${Date.now()}`,
      description: "",
      time: 0,
      operation: { id: "", name: "" },
    };
    setOperations((prev) => [...prev, newOperation]);
  };

  const removeOperation = (index: number) => {
    setOperations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOperation = (
    index: number,
    field: keyof Omit<ProjectOperation, "id">,
    value: any,
  ) => {
    setOperations((prev) => {
      return prev.map((op, i) => {
        if (i !== index) return op;

        if (field === "operation") {
          const selectedOperation = availableOperations.find(
            (availOp) => availOp.id === value,
          );
          if (selectedOperation) {
            return {
              ...op,
              operation: {
                id: selectedOperation.id,
                name: selectedOperation.name,
              },
            };
          }
        }

        return {
          ...op,
          [field]: value,
        };
      });
    });
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="mt-2 text-gray-500">Product Code: {project.code}</p>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
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
              <CardTitle className="text-2xl">Product Details</CardTitle>
              <CardDescription>
                Update your product information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleUpdateProject} className="space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Product Name
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
                      Product Code
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      defaultValue={project.code || ""}
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
                Manage and track all operations associated with this product
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
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operations.map((po, index) => (
                      <TableRow key={po.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <Select
                            value={po.operation.id}
                            onValueChange={(value) =>
                              updateOperation(index, "operation", value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableOperations.map((op) => (
                                <SelectItem key={op.id} value={op.id}>
                                  {op.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={po.description || ""}
                            onChange={(e) =>
                              updateOperation(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <TimeInput
                            value={po.time}
                            onChange={(value) =>
                              updateOperation(index, "time", value)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOperation(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-between">
                <Button onClick={addOperation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Operation
                </Button>
                <Button onClick={handleUpdateOperations}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="border-none shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Workflow</CardTitle>
              <CardDescription>
                Workflow information will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Add workflow content here */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
