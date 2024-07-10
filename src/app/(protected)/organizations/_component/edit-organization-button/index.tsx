import { FieldErrors } from "@/actions/utils";
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
import { ButtonProps } from "@mui/material";
import React from "react";
import { TCreateInput } from "../../_utils/schema";
import { useSession } from "@/components/session-provider";
import FormInput from "@/components/form-input";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FormTextarea from "@/components/form-textarea";

export interface AddOperatorButtonProps extends ButtonProps {
  organization: {
    id: string;
    name: string;
    description: string;
    users: { id: string; name: string; email: string }[];
  };
}
export function EditOrganizationButton({
  organization,
  ...props
}: AddOperatorButtonProps) {
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const handleClose = () => {
    setFieldErrors({});
    closeRef.current?.click();
  };
  const { session } = useSession();
  const user = session?.user;
  const handleSubmit = () => {
    console.log("submit");
  };
  return (
    <Sheet onOpenChange={handleClose}>
      <SheetTrigger asChild>
        <Button {...props} />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Organization</SheetTitle>
          <SheetDescription>Edit the organization details</SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-1 flex-col gap-2 py-4 "
          action={handleSubmit}
        >
          <FormInput
            label="Name"
            name="name"
            defaultValue={organization.name}
            errors={fieldErrors.name}
          />

          <FormTextarea
            label="Description"
            name="description"
            defaultValue={organization.description}
            errors={fieldErrors.description}
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
        </form>{" "}
      </SheetContent>
    </Sheet>
  );
}
