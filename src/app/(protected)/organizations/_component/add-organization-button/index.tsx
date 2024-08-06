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
import { ArrowLeftIcon, ImageIcon, PlusIcon } from "lucide-react";
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
import Image from "next/image";

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
      adress: formData.get("adress") as string,
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

      // Envoyer un e-mail
      const emailResponse = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.adminEmail,
          subject: "Welcome to the Organization",
          html: `<p>Hello ${data.adminName},</p><p>Your organization has been created. Please log in using this <a href="http://your-app-url/login">link</a>.</p>`,
        }),
      });

      if (emailResponse.ok) {
        toast.success("Email sent successfully");
      } else {
        toast.error("Failed to send email");
      }

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
          setImageUrl(result.url);
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
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-md md:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl sm:text-2xl">
            Add Organization
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            Add a new organization to the list
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSubmit(formData);
          }}
          className="flex flex-1 flex-col gap-4 py-6"
        >
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mb-4 text-sm text-red-500 sm:text-base">
              Please correct the errors below.
            </div>
          )}

          <FormInput
            name="name"
            label="Name *"
            required
            errors={fieldErrors.name}
          />

          <FormTextarea
            name="description"
            label="Description *"
            required
            errors={fieldErrors.description}
          />

          <FormInput
            name="adress"
            label="Address"
            type="text"
            errors={fieldErrors.name}
          />

          <FormInput
            name="adminName"
            label="Admin Name *"
            required
            errors={fieldErrors.adminName}
          />

          <FormInput
            name="adminEmail"
            label="Admin Email *"
            type="email"
            required
            errors={fieldErrors.adminEmail}
          />

          <FormInput
            name="adminPassword"
            label="Admin Password *"
            type="password"
            required
            errors={fieldErrors.adminPassword}
          />

          <div className="mt-6">
            <Label
              htmlFor="file"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Organization Logo
            </Label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-4 sm:px-6 sm:py-6">
              <div className="space-y-1 text-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    className="mx-auto h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32"
                    width={128}
                    height={128}
                  />
                ) : (
                  <ImageIcon className="mx-auto h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
                )}
                <div className="flex flex-col items-center justify-center text-sm text-gray-600 sm:flex-row">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="mt-1 pl-1 sm:mt-0">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col items-center justify-end gap-4 sm:flex-row">
            <SheetClose ref={closeRef}></SheetClose>
            <Button
              type="button"
              variant="outline"
              className="flex w-full justify-center gap-2 sm:w-auto"
              onClick={handleClose}
            >
              <ArrowLeftIcon size={18} />
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              className="flex w-full justify-center gap-2 sm:w-auto"
            >
              <PlusIcon size={18} />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
