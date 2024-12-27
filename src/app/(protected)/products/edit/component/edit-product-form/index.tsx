"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import FormInput from "@/components/form-input";
import FormTextarea from "@/components/form-textarea";
import { FieldErrors } from "@/actions/utils";
import { TUpdateInput, updateInputSchema } from "../../../_utils/schemas";
import { update } from "../../../_utils/actions";

interface EditProductFormProps {
  product: TUpdateInput;
  operations: Array<{ id: string; name: string }>;
}

export default function EditProductForm({
  product,
  operations,
}: EditProductFormProps) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TUpdateInput>>({});
  const [selectedOperations, setSelectedOperations] = useState<
    Array<{ id: string; time: number }>
  >(product.operations || []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const data = {
      id: product.id,
      name,
      description: description || undefined,
      operations: selectedOperations,
    };

    const parsed = updateInputSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Invalid input");
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TUpdateInput>,
      );
      return;
    }

    const {
      result,
      error,
      //   fieldErrors: backendFieldErrors,
    } = await update(parsed.data);

    if (error) toast.error(error);

    // if (backendFieldErrors) setFieldErrors(backendFieldErrors);

    if (result) {
      toast.success("Product updated successfully");
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        name="name"
        label="Name *"
        required
        defaultValue={product.name}
        errors={fieldErrors.name}
      />
      <FormTextarea
        name="description"
        label="Description"
        defaultValue={product.description || ""}
        errors={fieldErrors.description}
      />

      <div>
        <h3 className="mb-2 text-lg font-semibold">Operations</h3>
        {selectedOperations.map((operation, index) => (
          <div key={index} className="mb-2 flex items-center gap-2">
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
              <SelectTrigger className="w-[200px]">
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
            <Input
              type="number"
              placeholder="Time (minutes)"
              value={operation.time || ""}
              onChange={(e) => {
                const updatedOperations = [...selectedOperations];
                updatedOperations[index] = {
                  ...updatedOperations[index],
                  time: parseInt(e.target.value),
                };
                setSelectedOperations(updatedOperations);
              }}
              className="w-32"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSelectedOperations(
                  selectedOperations.filter((_, i) => i !== index),
                );
              }}
            >
              <XIcon size={18} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            setSelectedOperations([...selectedOperations, { id: "", time: 0 }])
          }
        >
          Add Operation
        </Button>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          Cancel
        </Button>
        <Button type="submit">Update Product</Button>
      </div>
    </form>
  );
}
