"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Clock, FileText, Trash2 } from "lucide-react";
import { createInputSchema, type TCreateInput } from "../../_utils/schemas";
import { create } from "../../_utils/actions";
import type { FieldErrors } from "@/actions/utils";

interface AddProductFormProps {
  operations: Array<{ id: string; name: string }>;
}

interface SelectedOperation {
  id: string;
  operationId: string;
  description: string;
  time: number;
  order: number;
}

export default function AddProductForm({ operations }: AddProductFormProps) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TCreateInput>>({});
  const [selectedOperations, setSelectedOperations] = useState<
    SelectedOperation[]
  >([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      version: formData.get("version") as string,
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || undefined,
      operations: selectedOperations.map(
        ({ operationId, description, time, order }) => ({
          id: operationId,
          description,
          time,
          order,
        }),
      ),
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
    const newOrder = selectedOperations.length;
    setSelectedOperations([
      ...selectedOperations,
      {
        id: Date.now().toString(),
        operationId: "",
        description: "",
        time: 0,
        order: newOrder,
      },
    ]);
  };

  const removeOperation = (index: number) => {
    const updatedOperations = selectedOperations.filter((_, i) => i !== index);
    // Reorder the remaining operations
    updatedOperations.forEach((op, i) => {
      op.order = i;
    });
    setSelectedOperations(updatedOperations);
  };

  const updateOperation = (
    index: number,
    updates: Partial<SelectedOperation>,
  ) => {
    const updatedOperations = [...selectedOperations];
    updatedOperations[index] = { ...updatedOperations[index], ...updates };
    setSelectedOperations(updatedOperations);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code *</label>
                <Input
                  name="code"
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
              <Textarea name="description" className="min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Operations</CardTitle>
            <Button type="button" size="sm" onClick={addOperation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Operation
            </Button>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              {selectedOperations.map((operation, index) => (
                <AccordionItem
                  key={operation.id}
                  value={`item-${operation.id}`}
                  className="rounded-lg border"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-4">
                      <span>Operation {index + 1}</span>
                      {operation.operationId && (
                        <span className="text-sm text-muted-foreground">
                          {
                            operations.find(
                              (op) => op.id === operation.operationId,
                            )?.name
                          }
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Select
                            value={operation.operationId}
                            onValueChange={(value) =>
                              updateOperation(index, { operationId: value })
                            }
                          >
                            <SelectTrigger>
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
                        </div>
                        <div className="w-32">
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="number"
                              placeholder="Time"
                              value={operation.time || ""}
                              onChange={(e) =>
                                updateOperation(index, {
                                  time: Number.parseInt(e.target.value),
                                })
                              }
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOperation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Textarea
                          placeholder="Operation description"
                          value={operation.description || ""}
                          onChange={(e) =>
                            updateOperation(index, {
                              description: e.target.value,
                            })
                          }
                          className="min-h-[100px] pl-9"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
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
      </div>
    </form>
  );
}
