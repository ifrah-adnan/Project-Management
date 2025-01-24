"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Clock, Trash2 } from "lucide-react";
import { createInputSchema, type TCreateInput } from "../../_utils/schemas";
import { create } from "../../_utils/actions";
import type { FieldErrors } from "@/actions/utils";
import TimeInput from "./time-input";

interface AddProductFormProps {
  operations: Array<{ id: string; name: string }>;
}

interface ProductOperation {
  operation: { id: string; name: string };
  description: string;
  time: number;
}

export default function AddProductForm({ operations }: AddProductFormProps) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TCreateInput>>({});
  const [basicInfo, setBasicInfo] = useState({
    code: "",
    version: "",
    name: "",
    description: "",
  });
  const [productOperations, setProductOperations] = useState<
    ProductOperation[]
  >([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      ...basicInfo,
      operations: productOperations.map((po) => ({
        id: po.operation.id,
        description: po.description,
        time: po.time,
        order: productOperations.indexOf(po),
      })),
    };

    const parsed = createInputSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Please check the form for errors");
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TCreateInput>,
      );
      return;
    }

    const {
      result,
      error,
      fieldErrors: backendFieldErrors,
    } = await create(parsed.data);

    if (error) toast.error(error);
    if (backendFieldErrors) setFieldErrors(backendFieldErrors);
    if (result) {
      toast.success("Product added successfully");
      router.push("/products");
    }
  };

  const addOperation = () => {
    setProductOperations([
      ...productOperations,
      {
        operation: { id: "", name: "" },
        description: "",
        time: 0,
      },
    ]);
  };

  const removeOperation = (index: number) => {
    const updatedOperations = productOperations.filter((_, i) => i !== index);
    setProductOperations(updatedOperations);
  };

  const updateOperation = (
    index: number,
    field: keyof ProductOperation | "operation",
    value: any,
  ) => {
    const updatedOperations = [...productOperations];

    if (field === "operation") {
      const selectedOp = operations.find((op) => op.id === value);
      updatedOperations[index] = {
        ...updatedOperations[index],
        operation: selectedOp || { id: "", name: "" },
      };
    } else {
      updatedOperations[index] = {
        ...updatedOperations[index],
        [field]: value,
      };
    }

    setProductOperations(updatedOperations);
  };

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code *</label>
                  <Input
                    name="code"
                    value={basicInfo.code}
                    onChange={handleBasicInfoChange}
                    required
                    className={fieldErrors.code ? "border-red-500" : ""}
                  />
                  {fieldErrors.code?.map((error) => (
                    <p key={error} className="text-xs text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Version *</label>
                  <Input
                    name="version"
                    value={basicInfo.version}
                    onChange={handleBasicInfoChange}
                    required
                    className={fieldErrors.version ? "border-red-500" : ""}
                  />
                  {fieldErrors.version?.map((error) => (
                    <p key={error} className="text-xs text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  name="name"
                  value={basicInfo.name}
                  onChange={handleBasicInfoChange}
                  required
                  className={fieldErrors.name ? "border-red-500" : ""}
                />
                {fieldErrors.name?.map((error) => (
                  <p key={error} className="text-xs text-red-500">
                    {error}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={basicInfo.description}
                  onChange={handleBasicInfoChange}
                  className="min-h-[100px]"
                />
              </div>
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
                          Duration (min)
                        </span>
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productOperations.map((po, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
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
                              {operations.map((op) => (
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
                            onChange={(minutes) =>
                              updateOperation(index, "time", minutes)
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
                <Button type="button" onClick={addOperation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Operation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4">
        <CardFooter className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/products")}
          >
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
