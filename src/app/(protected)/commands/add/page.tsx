"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FormInput from "@/components/form-input";
import FormErrors from "@/components/form-errors";
import { useSession } from "@/components/session-provider";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import useSWR from "swr";
import { FieldErrors } from "@/actions/utils";
import { createCommandd, getClients, getProjects } from "../_utils/actions";
import { TCreateInput } from "../_utils/schemas";

export default function AddCommandPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState("");
  const [clientId, setClientId] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TCreateInput>>({});
  const [commandProjects, setCommandProjects] = useState<
    TCreateInput["commandProjects"]
  >([]);
  const { session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const { data, isLoading, error } = useSWR("addCommandData", async () => {
    const [projects, clients] = await Promise.all([
      getProjects(),
      getClients(),
    ]);
    return { projects, clients };
  });

  const projects = data?.projects || [];
  const clients = data?.clients || [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const reference = formData.get("reference") as string;

    const { result, error, fieldErrors } = await createCommandd({
      reference,
      clientId,
      commandProjects,
      userId,
    });

    if (error) toast.error(error);

    if (fieldErrors) setFieldErrors(fieldErrors);

    if (result) {
      toast.success("Command added successfully");
      router.push("/commands");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Command</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          name="reference"
          label="Reference"
          required
          errors={fieldErrors.reference}
        />
        <div>
          <Label className="mb-2 inline-block">Client</Label>
          <Select onValueChange={setClientId} value={clientId}>
            <SelectTrigger>
              <SelectValue className="w-full" placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 border-2 border-[#E6B3BA]">
                      <AvatarImage src={item.image || ""} alt={item.name} />
                      <AvatarFallback className="font-bold">
                        {`${item.name.charAt(0).toUpperCase()}`}
                      </AvatarFallback>
                    </Avatar>
                    <span className="capitalize">{item.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            className="flex w-24 gap-2"
            onClick={() => router.back()}
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
    </div>
  );
}
