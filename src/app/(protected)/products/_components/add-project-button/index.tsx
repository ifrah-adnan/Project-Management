"use client";

import { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftIcon, PlusIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import FormTextarea from "@/components/form-textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createInputSchema, TCreateInput } from "../../_utils/schemas";
import { create } from "../../_utils/actions";

export interface AddProjectButtonProps extends ButtonProps {
  operations: Array<{ id: string; name: string }>;
}

export function AddProjectButton({
  operations,
  ...props
}: AddProjectButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const router = useRouter();
  const [selectedOperations, setSelectedOperations] = useState<
    Array<{ id: string; time: number }>
  >([]);

  const handleClose = () => {
    setFieldErrors({});
    setSelectedOperations([]);
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const data = {
      name,
      description: description || undefined,
      operations: selectedOperations,
    };

    const parsed = createInputSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Invalid input");
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TCreateInput>,
      );
      return;
    }
    const { result, error, fieldErrors } = await create(parsed.data);

    if (error) toast.error(error);

    if (fieldErrors) setFieldErrors(fieldErrors);

    if (result) {
      handleClose();
      toast.success("Project added successfully");
      router.refresh();
    }
  };

  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <span>Add Project</span>
          </SheetTitle>
          <SheetDescription>
            Fill in the form below to add a new project
          </SheetDescription>
        </SheetHeader>
        <form
          action={handleSubmit}
          className="flex flex-1 flex-col gap-2 py-4 "
        >
          <FormInput
            name="name"
            label="Name *"
            className="mt-4"
            required
            errors={fieldErrors.name}
          />
          <FormTextarea
            name="description"
            label="Description *"
            className="mt-4"
            errors={fieldErrors.description}
          />

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Operations</h3>
            {selectedOperations.map((operation, index) => (
              <div key={index} className="mt-2 flex items-center gap-2">
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
                setSelectedOperations([
                  ...selectedOperations,
                  { id: "", time: 0 },
                ])
              }
              className="mt-2"
            >
              Add Operation
            </Button>
          </div>

          <div className="mt-auto flex items-center justify-end gap-4">
            <SheetClose ref={closeRef}></SheetClose>
            <Button
              type="button"
              variant="outline"
              className="flex w-24 gap-2"
              onClick={handleClose}
            >
              <ArrowLeftIcon size={18} />
              <span>Cancel</span>
            </Button>
            <Button type="submit" className="flex w-24 gap-2">
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
