"use client";

import React, { useState } from "react";
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
import { TUpdateInput, updateInputSchema } from "../../../_utils/schemas";
import { update } from "../../../_utils/actions";
import { FieldErrors } from "@/actions/utils";

interface EditProductFormProps {
  product: TUpdateInput;
  operations: Array<{ id: string; name: string }>;
}

export default function EditProductForm({
  product,
  operations,
}: EditProductFormProps) {
  console.log(product);
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TUpdateInput>>({});
  const [selectedOperations, setSelectedOperations] = useState<
    Array<{ id: string; description: string; time: number }>
  >(
    product.operations.map((op) => ({
      ...op,
      description: op.description || "",
    })),
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      id: product.id,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      operations: selectedOperations,
    };

    const parsed = updateInputSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Please check the form for errors");
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TUpdateInput>,
      );
      return;
    }
    console.log("Parsed data:", parsed.data);

    const { result, error } = await update(parsed.data);

    if (error) toast.error(error);
    if (result) {
      toast.success("Product updated successfully");
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code #</label>
              <Input name="code" disabled defaultValue={product.code} />
              <label className="text-sm font-medium">Name *</label>
              <Input
                name="name"
                required
                defaultValue={product.name}
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
                className="min-h-[100px]"
                defaultValue={product.description || ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Operations</CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                setSelectedOperations([
                  ...selectedOperations,
                  { id: "", description: "", time: 0 },
                ])
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Operation
            </Button>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              {selectedOperations.map((operation, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border"
                >
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-4">
                      <span>Operation {index + 1}</span>
                      {operation.id && (
                        <span className="text-sm text-muted-foreground">
                          {
                            operations.find((op) => op.id === operation.id)
                              ?.name
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
                            value={operation.id}
                            onValueChange={(value) => {
                              const updatedOperations = [...selectedOperations];
                              updatedOperations[index] = {
                                ...updatedOperations[index],
                                id: value,
                              };
                              setSelectedOperations(updatedOperations);
                            }}
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
                              onChange={(e) => {
                                const updatedOperations = [
                                  ...selectedOperations,
                                ];
                                updatedOperations[index] = {
                                  ...updatedOperations[index],
                                  time: parseInt(e.target.value),
                                };
                                setSelectedOperations(updatedOperations);
                              }}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedOperations(
                              selectedOperations.filter((_, i) => i !== index),
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Textarea
                          placeholder="Operation description"
                          value={operation.description}
                          onChange={(e) => {
                            const updatedOperations = [...selectedOperations];
                            updatedOperations[index] = {
                              ...updatedOperations[index],
                              description: e.target.value,
                            };
                            setSelectedOperations(updatedOperations);
                          }}
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
            <Button type="submit">Update Product</Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
