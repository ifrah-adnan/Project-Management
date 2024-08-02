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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import React from "react";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormInput from "@/components/form-input";
import {
  TCreateInput,
  TProjectNotInCommand,
  createInputSchema,
} from "../../_utils/schemas";
import {
  createCommandProject,
  getProjectsNotInCommand,
} from "@/app/(protected)/projects/_utils/actions";
import FormTextarea from "@/components/form-textarea";
import useSWR, { mutate } from "swr";
import {
  getClients,
  getProjects,
  getCommands,
} from "@/app/(protected)/commands/_utils/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CreateNewProjectButton from "@/app/(protected)/commands/_components/add-project-button";
import CreateNewCommandButton from "../add-command-button";
import { useSession } from "@/components/session-provider";

export interface AddOperatorButtonProps extends ButtonProps {}

export function AddProjectButton(props: AddOperatorButtonProps) {
  const closePopoverRef = React.useRef<HTMLButtonElement>(null);

  const closeRef = React.useRef<HTMLButtonElement>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateInput>
  >({});
  const [projectId, setProjectId] = React.useState("");
  const [commandId, setCommandId] = React.useState("");
  const [newProject, setNewProject] = React.useState("existing project");
  const [newCommand, setNewCommand] = React.useState("existing command");

  const router = useRouter();
  const { session } = useSession();
  const user = session?.user;
  console.log(user, "sssssssss");
  const { data, isLoading, error } = useSWR("addCommandData", async () => {
    const commands = await getCommands();
    return { commands };
  });
  const [projects2, setProjects2] = React.useState<TProjectNotInCommand>([]);
  // const commands = React.useMemo(() => data?.commands || [], [data]);
  const commands = data?.commands || [];
  React.useEffect(() => {
    setProjectId("");
    const fetchProjects = async () => {
      try {
        const projectsNotInCommand = await getProjectsNotInCommand(commandId);
        setProjects2(projectsNotInCommand);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [commandId, newProject]);
  const handleClose = () => {
    setFieldErrors({});
    setProjectId("");
    setCommandId("");
    closeRef.current?.click();
  };

  const handleSubmit = async (formData: FormData) => {
    const target = formData.get("target") as string;
    const endDate = formData.get("endDate") as string;

    const data = {
      command_id: commandId,
      project_id: projectId,
      target: +target,
      endDate: new Date(endDate),
    };

    const parsed = createInputSchema.safeParse(data);

    if (!parsed.success) {
      toast.error("Invalid input");
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TCreateInput>,
      );
      return;
    }
    const { result, error, fieldErrors } = await createCommandProject(
      parsed.data,
      user.id,
    );

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
      <SheetContent className="flex w-full flex-col overflow-auto p-2 sm:p-4 md:p-6">
        <SheetHeader>
          <SheetTitle className="text-lg sm:text-xl md:text-2xl">
            <span>Add Project</span>
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base">
            Fill in the form below to add a new project
          </SheetDescription>
        </SheetHeader>
        <form
          action={handleSubmit}
          className="flex flex-1 flex-col gap-2 py-2 sm:gap-4 sm:py-4"
        >
          <div className="border p-1 sm:p-2">
            <div className="grid grid-cols-2">
              <Button
                variant="ghost"
                className={`rounded-none border-b-2 text-xs hover:text-[#fa993a] sm:text-sm ${newCommand === "existing command" && "border-b-[#FA993A]"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setNewCommand("existing command");
                }}
              >
                Existing Command
              </Button>{" "}
              <Button
                variant="ghost"
                className={`rounded-none border-b-2 text-xs hover:text-[#fa993a] sm:text-sm ${newCommand === "new command" && "border-b-[#FA993A]"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setNewCommand("new command");
                }}
              >
                New Command
              </Button>
            </div>

            {newCommand === "existing command" ? (
              <>
                <Label className="mt-2 inline-block text-sm sm:mt-4 sm:text-base">
                  Command
                </Label>
                <Select required onValueChange={setCommandId} value={commandId}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue
                      className="w-full"
                      placeholder="Select a Command"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {commands.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="text-sm sm:text-base"
                      >
                        {item.reference}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="m-1 sm:m-2">
                <CreateNewCommandButton
                  setNewCommand={setNewCommand}
                  closePopoverRef={closePopoverRef}
                />
              </div>
            )}
          </div>
          <div className="border p-1 sm:p-2">
            <div className="grid grid-cols-2">
              <Button
                variant="ghost"
                className={`rounded-none border-b-2 text-xs hover:text-[#fa993a] sm:text-sm ${newCommand === "existing command" && "border-b-[#FA993A]"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setNewProject("existing project");
                }}
              >
                Existing Project
              </Button>{" "}
              <Button
                variant="ghost"
                className={`rounded-none border-b-2 text-xs hover:text-[#fa993a] sm:text-sm ${newCommand === "new command" && "border-b-[#FA993A]"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setNewProject("new project");
                }}
              >
                New Project
              </Button>
            </div>

            {newProject === "existing project" ? (
              <>
                <Label className="mt-2 inline-block text-sm sm:mt-4 sm:text-base">
                  Project
                </Label>
                <Select required onValueChange={setProjectId} value={projectId}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue
                      className="w-full"
                      placeholder="Select a project"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {projects2.length === 0 && (
                      <SelectItem
                        disabled
                        value="0"
                        className="px-2 text-center text-xs"
                      >
                        This command includes all existing projects.
                      </SelectItem>
                    )}
                    {projects2.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className="text-sm sm:text-base"
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="m-1 sm:m-2">
                <CreateNewProjectButton
                  setNewProject={setNewProject}
                  closePopoverRef={closePopoverRef}
                />
              </div>
            )}
          </div>{" "}
          <Label className="text-sm sm:text-base">Target</Label>
          <Input
            type="number"
            name="target"
            className="w-full text-sm sm:text-base"
            required
          />
          <Label className="text-sm sm:text-base">Deadline</Label>
          <Input
            type="date"
            name="endDate"
            className="w-full text-sm sm:text-base"
            required
          />
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
              <PlusIcon size={16} className="sm:size-18" />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
