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
import React, { useEffect, useMemo, useState } from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import { TCreateInput, createInputSchema } from "../../_utils/schemas";
import useSWR from "swr";
import { Label } from "@/components/ui/label";
import { createDevice, getPosts } from "../../_utils/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AddEditPlanningButton } from "@/app/(protected)/posts/_components/add-planning-button";
import { FormSelect } from "@/components/form-select";
import { format } from "date-fns";
import { useSession } from "@/components/session-provider";
import { db } from "@/lib/db";
import QRCodeScanner from "../scanner/QrReaderScanner";

export interface AddDeviceButtonProps extends ButtonProps {}
type TPost = {
  expertises: {
    operations: {
      name: string;
      id: string;
    }[];
    name: string;
    id: string;
  }[];
  plannings: {
    startDate: Date;
    endDate: Date;
    operation: {
      id: string;
      name: string;
    };
    id: string;
  }[];
  name: string;
  id: string;
};
export function AddDeviceButton(props: AddDeviceButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const { data } = useSWR(`posts`, getPosts);
  const posts = useMemo(() => data || [], [data]);

  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const [post, setPost] = React.useState<TPost | undefined>();
  const [isScannerMode, setIsScannerMode] = useState(false); // State to handle the input mode
  const [scannedDeviceId, setScannedDeviceId] = useState<string | null>(null); // State to store the scanned device ID

  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;

  const handleClose = () => {
    setFieldErrors({});
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const deviceId = scannedDeviceId || (formData.get("deviceId") as string); // Use scannedDeviceId if available
    const count = formData.get("count") as string;
    const planningId = formData.get("planningId") as string;

    const { result, error, fieldErrors } = await createDevice({
      deviceId,
      postId: post?.id || "",
      count: +count,
      planningId: planningId,
      userId: user?.id,
    });

    if (error) toast.error(error);

    if (fieldErrors) setFieldErrors(fieldErrors);

    if (result) {
      handleClose();
      toast.success("Device added successfully");
      router.refresh();
    }
  };

  const handleScan = (result: string | null) => {
    if (result) {
      setScannedDeviceId(result);
      setIsScannerMode(false); // Switch back to manual mode after scanning
    }
  };

  const handleError = (error: Error) => {
    toast.error("Error scanning QR code: " + error.message);
  };

  function handlePostChange(id: string) {
    const p = posts?.filter((item) => item.id === id)[0];
    setPost(p);
  }

  function handleNewPlanning() {
    setPost((post) => {
      if (post)
        return {
          ...post,
          id: "",
        };
    });
  }

  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button
          className="h-8 px-2 py-1 text-xs md:h-10 md:px-4 md:py-2 md:text-base"
          {...props}
        />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col overflow-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-base md:text-xl">
            <span>Add Device</span>
          </SheetTitle>
          <SheetDescription className="text-xs md:text-base">
            Fill in the form below to add a new device
          </SheetDescription>
        </SheetHeader>
        <form
          action={handleSubmit}
          className="flex flex-1 flex-col gap-1 py-2 md:gap-2 md:py-4"
        >
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant={isScannerMode ? "default" : "outline"}
              onClick={() => setIsScannerMode(!isScannerMode)}
              className="text-xs md:text-base"
            >
              {isScannerMode ? "Manual Input" : "Scan QR"}
            </Button>
          </div>
          {isScannerMode ? (
            <QRCodeScanner onScan={handleScan} onError={handleError} />
          ) : (
            <FormInput
              name="deviceId"
              label="Device ID *"
              className="mt-2 md:mt-4"
              required
              value={scannedDeviceId || ""}
              onChange={(e) => setScannedDeviceId(e.target.value)}
              errors={fieldErrors.deviceId}
            />
          )}
          <Label className="mt-2 inline-block text-sm md:mt-4 md:text-base">
            Post
          </Label>
          <Select onValueChange={(id) => handlePostChange(id)} value={post?.id}>
            <SelectTrigger className="text-xs md:text-base">
              <SelectValue className="w-full" placeholder="Select a post" />
            </SelectTrigger>
            <SelectContent>
              {posts.map((post) => (
                <SelectItem
                  key={post.id}
                  value={post.id}
                  className="text-xs md:text-base"
                >
                  {post.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {post?.id && (
            <>
              <FormSelect
                name="planningId"
                placeholder="Select planning"
                label="Planning"
                className="mt-2 md:mt-4"
              >
                {post.plannings.map((op) => (
                  <SelectItem
                    key={op.id}
                    value={op.id}
                    className="text-xs md:text-sm"
                  >
                    {op.operation.name} from{" "}
                    {format(new Date(op.startDate), "PP")} to{" "}
                    {format(new Date(op.endDate), "PP")}
                  </SelectItem>
                ))}
              </FormSelect>
              <AddEditPlanningButton
                postId={post?.id || ""}
                className="mt-2 flex w-full gap-1 rounded-sm p-0 text-xs font-medium md:mt-4 md:gap-2 md:text-sm"
                variant={"outline"}
                size={"icon"}
                expertises={post?.expertises || []}
                onClose={handleNewPlanning}
              >
                <PlusIcon size={14} className="md:size-18" />
                <span>Add new planning</span>
              </AddEditPlanningButton>
            </>
          )}
          <Label className="mt-2 inline-block text-sm md:mt-4 md:text-base">
            Value
          </Label>
          <Input
            type="number"
            name="count"
            className="w-full text-xs md:text-base"
          />
          <div className="mt-auto flex items-center justify-end gap-2 md:gap-4">
            <SheetClose ref={closeRef}></SheetClose>
            <Button
              type="button"
              variant="outline"
              className="flex w-16 gap-1 text-xs md:w-24 md:gap-2 md:text-base"
              onClick={handleClose}
            >
              <ArrowLeftIcon size={12} className="md:size-18" />
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              className="flex w-16 gap-1 text-xs md:w-24 md:gap-2 md:text-base"
            >
              <PlusIcon size={12} className="md:size-18" />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
