"use client";

import { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { z } from "zod";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import { Label } from "@/components/ui/label";
import useSWR from "swr";
import { MultiSelect } from "@/components/multi-select";
import FormErrors from "@/components/form-errors";
import { useSession } from "@/components/session-provider";
import {
  createExpertise,
  getOperations,
} from "@/app/(protected)/expertise/_utils/actions";
import { TCreateInput, createInputSchema } from "../../_utils/schema";
import { createOrganizationWithAdmin } from "../../_utils/action";
import FormTextarea from "@/components/form-textarea";

export interface AddOperatorButtonProps extends ButtonProps {}

export function AddOrganizationButton(props: AddOperatorButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null); // Ref for file input
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const [operations, setOperations] = React.useState<
    { name: string; id: string }[]
  >([]);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null); // State to store the uploaded image URL
  const router = useRouter();

  const { data, isLoading, error } = useSWR("addUserData", async () => {
    const [expertise] = await Promise.all([getOperations()]);
    return { expertise };
  });

  const handleClose = () => {
    setFieldErrors({});
    setOperations([]);
    setImageUrl(null); // Reset image URL
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      adminName: formData.get("adminName") as string,
      adminEmail: formData.get("adminEmail") as string,
      adminPassword: formData.get("adminPassword") as string,
    };

    const parsed = createInputSchema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors = parsed.error.format();
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TCreateInput>,
      );
      return;
    }
    const imagePath = imageUrl; // Get the uploaded image URL

    try {
      await createOrganizationWithAdmin(data, imagePath);
      toast.success("Organization and admin created successfully");
      handleClose();
    } catch (error) {
      console.error("Error creating organization and admin:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setImageUrl(result.url); // Update state with the URL of the uploaded image
          toast.success("File uploaded successfully");
        } else {
          toast.error("File upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("An unexpected error occurred during file upload");
      }
    }
  };

  const { session } = useSession();
  const user = session?.user;

  console.log(user);

  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-y-auto ">
        <SheetHeader>
          <SheetTitle>Add Organization</SheetTitle>
          <SheetDescription>
            Add a new organization to the list
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSubmit(formData);
          }}
          className="flex flex-1 flex-col gap-2 py-4 "
        >
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mb-4 text-red-500">
              Please correct the errors below.
            </div>
          )}

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
            required
            errors={fieldErrors.description}
          />
          <FormInput
            name="adminName"
            label="Admin Name *"
            className="mt-4"
            required
            errors={fieldErrors.adminName}
          />
          <FormInput
            name="adminEmail"
            label="Admin Email *"
            type="email"
            className="mt-4"
            required
            errors={fieldErrors.adminEmail}
          />
          <FormInput
            name="adminPassword"
            label="Admin Password *"
            type="password"
            className="mt-4"
            required
            errors={fieldErrors.adminPassword}
          />

          {/* File upload input */}
          <Label htmlFor="file" className="mt-4">
            Upload Image
          </Label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
            ref={fileInputRef} // Add ref to file input
          />

          {imageUrl && (
            <div className="mb-4">
              <img src={imageUrl} alt="Uploaded image" className="max-w-full" />
            </div>
          )}

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
              <PlusIcon size={18} />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
