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
import React, { useState } from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import { TCreateInput } from "../../_utils/schemas";
import { createDevice } from "../../_utils/actions";
import { useSession } from "@/components/session-provider";
import QRCodeScanner from "../scanner/QrReaderScanner";

export interface AddDeviceButtonProps extends ButtonProps {}

export function AddDeviceButton(props: AddDeviceButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const [isScannerMode, setIsScannerMode] = useState(false);
  const [scannedDeviceId, setScannedDeviceId] = useState<string | null>(null);

  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;

  const handleClose = () => {
    setFieldErrors({});
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const deviceId = scannedDeviceId || (formData.get("deviceId") as string);

    const { result, error, fieldErrors } = await createDevice({
      deviceId,
      userId: user?.id || "",
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
      setIsScannerMode(false);
    }
  };

  const handleError = (error: Error) => {
    toast.error("Error scanning QR code: " + error.message);
  };

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
            Enter a device ID or scan a QR code to add a new device
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
