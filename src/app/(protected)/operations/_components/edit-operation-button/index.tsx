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
import { createInputSchema } from "../../_utils/schemas";
import { Label } from "@/components/ui/label";
import FormErrors from "@/components/form-errors";
import { useSession } from "@/components/session-provider";
import { updateOperation } from "../../_utils/actions";

interface TEditInput {
  operationId: string;
  user: string;
  icon: string;
  name: string;
  code: string;
  description: string;
  isFinal: boolean;
  // estimatedTime: number;
}

export interface EditOperationButtonProps extends ButtonProps {
  operation: {
    id: string;
    name: string;
    code: string;
    description: string;
    isFinal: boolean;
    // estimatedTime: number;
    icon?: string;
  };
}

export function EditOperationButton({
  operation,
  ...props
}: EditOperationButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors<TEditInput>>(
    {},
  );

  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;

  const handleClose = () => {
    setFieldErrors({});
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const isFinal = formData.get("isFinal") === "on";
    // const estimatedTime = parseInt(formData.get("estimatedTime") as string, 10);
    const icon = operation.icon || ""; // Utilisation du champ `icon`

    const data: TEditInput = {
      operationId: operation.id,
      user: user.id,
      icon,
      name,
      code,
      description,
      isFinal,
      // estimatedTime,
    };

    // const parsed = createInputSchema.safeParse(data);

    // if (!parsed.success) {
    //   toast.error("Invalid input");
    //   setFieldErrors(
    //     parsed.error.flatten().fieldErrors as FieldErrors<TEditInput>,
    //   );
    //   return;
    // }

    const { result, error, fieldErrors } = await updateOperation(data);

    if (error) toast.error(error);

    if (fieldErrors) setFieldErrors(fieldErrors);

    if (result) {
      handleClose();
      toast.success("Operation updated successfully");
      router.refresh();
    }
  };

  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent className="flex w-full max-w-md flex-col p-2 sm:p-4 md:p-6">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl md:text-2xl">
            Edit Operation
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            Edit details of the selected operation
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-2 py-2 sm:gap-4 sm:py-4"
          action={handleSubmit}
        >
          <FormInput
            name="name"
            label="Name *"
            className="mt-2 sm:mt-4"
            required
            defaultValue={operation.name}
            errors={fieldErrors.name}
          />
          <FormInput
            name="code"
            label="Code *"
            className="mt-2 sm:mt-4"
            required
            defaultValue={operation.code}
          />
          <FormInput
            name="description"
            label="Description"
            className="mt-2 sm:mt-4"
            defaultValue={operation.description}
          />
          <Label className="mt-2 inline-block text-sm sm:mt-4 sm:text-base">
            Is Final
          </Label>
          <input
            type="checkbox"
            name="isFinal"
            defaultChecked={operation.isFinal}
            className="mt-2"
          />
          {/* <FormInput
            name="estimatedTime"
            label="Estimated Time (minutes)"
            type="number"
            className="mt-2 sm:mt-4"
            defaultValue={operation.estimatedTime.toString()}
          /> */}
          <FormErrors className="text-sm" />
          <div className="mt-auto flex items-center justify-end gap-2 sm:gap-4">
            <SheetClose ref={closeRef}></SheetClose>
            <Button
              type="button"
              variant="outline"
              className="flex w-20 gap-1 text-xs sm:w-24 sm:gap-2 sm:text-sm"
              onClick={handleClose}
            >
              <ArrowLeftIcon size={16} className="sm:size-18" />
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              className="flex w-20 gap-1 text-xs sm:w-24 sm:gap-2 sm:text-sm"
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
