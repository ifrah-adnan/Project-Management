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
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import React from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import {
  TCreateInput,
  TExpertise,
  createInputSchema,
} from "../../_utils/schemas";
import { createPost, getExpertises, TDevice } from "../../_utils/actions";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { useSession } from "@/components/session-provider";
import { findMany } from "@/app/(protected)/devices/_utils/actions";

export interface AddPostButtonProps extends ButtonProps {}

export function AddPostButton(props: AddPostButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const { session } = useSession();
  const user = session?.user;

  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const [selectedExpertise, setSelectedExpertise] = React.useState<
    TExpertise[]
  >([]);
  const [selectedDevice, setSelectedDevice] = React.useState<TDevice | null>(
    null,
  );
  const router = useRouter();

  const { data, isLoading, error } = useSWR("addPostData", async () => {
    const [expertises, devices] = await Promise.all([
      getExpertises(),
      findMany(),
    ]);
    console.log("ddddwe33", data?.devices);
    return { expertises, devices };
  });

  console.log(data?.devices, "de33333333333");
  const handleClose = () => {
    setFieldErrors({});
    setSelectedExpertise([]);
    setSelectedDevice(null);
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;

    if (!selectedDevice) {
      toast.error("Please select a device");
      return;
    }

    const { result, error, fieldErrors } = await createPost({
      name,
      expertises: selectedExpertise.map((op) => op.id),
      deviceId: selectedDevice.id,
      userId: user?.id,
    });

    if (error) toast.error(error);

    if (fieldErrors) setFieldErrors(fieldErrors);

    if (result) {
      handleClose();
      toast.success("Post added successfully");
      router.refresh();
    }
  };

  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button {...props}>
          <PlusIcon size={18} className="mr-2" />
          Add Post
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <span>Add Post</span>
          </SheetTitle>
          <SheetDescription>
            Fill in the form below to add a new post
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

          <Label className="mt-4 inline-block">Expertises</Label>
          <MultiSelect
            options={data?.expertises || []}
            value={selectedExpertise}
            valueRenderer={(value) => value.name}
            optionRenderer={(option) => option.name}
            onValueChange={setSelectedExpertise}
          />

          <Label className="mt-4 inline-block">Device *</Label>
          <MultiSelect
            options={data?.devices.data.map((d) => d.deviceId) || []}
            value={selectedDevice?.deviceId ? [selectedDevice.deviceId] : []}
            valueRenderer={(value) => value}
            optionRenderer={(option) => option}
            onValueChange={(values) =>
              setSelectedDevice(
                data?.devices.data.find((d) => d.deviceId === values[0]) ||
                  null,
              )
            }
          />

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
