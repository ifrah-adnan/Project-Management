"use client";
import React, { useEffect, useState, useTransition } from "react";
import { TData } from "../../_utils/schemas";
import Card from "@/components/card";
import { Table } from "@/components/table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Ellipsis,
  FileClockIcon,
  Filter,
  GitBranchPlusIcon,
  Info,
  ListIcon,
  PencilIcon,
  Plus,
  RefreshCw,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { statusMap } from "@/app/(protected)/_components/status-map";
import ConfigureSprintButton from "../configure-sprint-button";
import { ConfirmButton } from "@/components/confirm-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getOperationProgress2,
  getOperationsForCommandProject,
  handleDeleteCommandProject,
  Operation,
  updateDoneValue,
} from "../../_utils/actions";
import { EditProjectButton } from "../edit-project-button";
import { useSession } from "@/components/session-provider";
import { getServerSession } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getOperationProgress } from "@/actions/operation-progress";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (data: any, projectName: string) => {
  const pdf = new jsPDF();
  const primaryColor = "#2B2D42";
  const secondaryColor = "#8D99AE";
  const accentColor = "#FF6B00";

  pdf.setFontSize(24);
  pdf.setTextColor(primaryColor);
  pdf.text(`Project Operations :${projectName}`, 20, 20);

  pdf.setFontSize(14);
  pdf.setTextColor(secondaryColor);
  pdf.text(`Total Operations: ${data.length}`, 20, 30);

  pdf.setDrawColor(accentColor);
  pdf.setLineWidth(0.5);
  pdf.line(20, 35, 190, 35);

  const tableData = data.map((operation: any) => [
    operation.name,
    operation.progress,
    operation.target,
    operation.completedCount,
    operation.lastMonthCount,
    operation.lastWeekCount,
    operation.todayCount,
  ]);

  autoTable(pdf, {
    startY: 45,
    head: [
      [
        "Operation Name",
        "Progress",
        "Target",
        "Completed",
        "Last Month",
        "Last Week",
        "Today",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: primaryColor, textColor: "#FFFFFF" },
    bodyStyles: { textColor: primaryColor },
    alternateRowStyles: { fillColor: "#EDF2F4" },
    margin: { top: 40 },
  });

  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);
    pdf.text(
      `Page ${i} of ${pageCount}`,
      pdf.internal.pageSize.width - 30,
      pdf.internal.pageSize.height - 10,
    );
  }

  return pdf;
};

export const ListView: React.FC<{ data: TData }> = ({ data }) => {
  const { session } = useSession();
  const user = session?.user;
  const [filteredData, setFilteredData] = useState<TData>([]);
  const [organizationId, setOrganizationId] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      const serverSession = await getServerSession();
      setOrganizationId(
        serverSession?.user.organization?.id ||
          serverSession?.user.organizationId,
      );
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (organizationId) {
      const filtered = data.filter(
        (item) => item.organizationId === organizationId,
      );
      setFilteredData(filtered);
    }
  }, [data, organizationId]);

  const [doneValues, setDoneValues] = useState<{ [key: string]: number }>({});
  const [isPending, startTransition] = useTransition();
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>(
    {},
  );

  const handleUpdateDoneValue = async (id: string, newValue: number) => {
    startTransition(async () => {
      const result = await updateDoneValue(id, newValue);
      if (result.success) {
        setDoneValues((prev) => ({ ...prev, [id]: newValue }));
        setOpenDialogs((prev) => ({ ...prev, [id]: false }));
      } else {
        console.error(result.error);
      }
    });
  };

  const [operations, setOperations] = useState<any[]>([]);
  const [operationCount, setOperationCount] = useState<any>(0);
  const [isLoadingOperations, setIsLoadingOperations] = useState(false);

  const handleOpenDialog = async (
    commandProjectId: string,
    projectName: string,
  ) => {
    setIsLoadingOperations(true);
    setCurrentProjectName(projectName);

    try {
      const result = await getOperationProgress2(commandProjectId);
      console.log(result);

      if (result.operationDetails) {
        setOperations(result.operationDetails);
        setOperationCount(result.operationCount);
      } else {
        console.error("Error: No operation details found");
      }
    } catch (error) {
      console.error("An error occurred while fetching operations:", error);
    } finally {
      setIsLoadingOperations(false);
    }
  };

  const handleDownload = () => {
    const pdf = generatePDF(operations, currentProjectName);
    pdf.save("project_info.pdf");
  };

  return (
    <Card className="mx-auto h-full w-full max-w-screen-2xl overflow-auto p-4">
      <Table className="w-full">
        <thead>
          <tr>
            <th>project</th>
            <th>client</th>
            <th>done</th>
            <th>target</th>
            <th>sprints</th>
            <th>status</th>
            <th>deadline</th>
            <th>operations</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => {
            let totalSprints: number | undefined = undefined;
            let completedSprints: number | undefined = undefined;
            let done = 0;
            let sprints: undefined | string = undefined;
            if (item.sprint) {
              totalSprints = Math.ceil(item.target / item.sprint.target);
              completedSprints = Math.floor(done / item.sprint.target);
              sprints = `${completedSprints}/${totalSprints}`;
            }
            const client = item.command.client;
            return (
              <tr key={item.id}>
                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2 p-2 font-medium text-blue-600 hover:bg-blue-100"
                        onClick={() =>
                          handleOpenDialog(item.id, item.project.name)
                        }
                      >
                        <span>{item.project.name}</span>
                        <ListIcon className="text-blue-600" size={20} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] w-full sm:max-w-[90vw]">
                      <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-2xl font-bold">
                          Operations: {item.project.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Filter className="mr-2 h-4 w-4" />
                              Filter
                            </Button>
                            <Button size="sm" variant="outline">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Refresh
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleDownload}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </Button>
                            {/* <Button size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Operation
                            </Button> */}
                          </div>
                        </div>
                        <div className="rounded-md border">
                          <div className="overflow-x-auto">
                            {isLoadingOperations ? (
                              <div className="p-8 text-center">
                                Loading operations...
                              </div>
                            ) : operations.length > 0 ? (
                              <Table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted/30">
                                    <th className="w-1/4 p-3 text-left font-semibold">
                                      Name
                                    </th>
                                    <th className="w-24 p-3 text-center font-semibold">
                                      Completed
                                    </th>
                                    <th className="w-24 p-3 text-center font-semibold">
                                      Today
                                    </th>
                                    <th className="w-24 p-3 text-center font-semibold">
                                      Last Week
                                    </th>
                                    <th className="w-24 p-3 text-center font-semibold">
                                      Last Month
                                    </th>
                                    <th className="w-24 p-3 text-center font-semibold">
                                      Target
                                    </th>
                                    <th className="w-40 p-3 text-left font-semibold">
                                      Progress
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {operations.map((op, index) => (
                                    <tr
                                      key={op.id}
                                      className={
                                        index % 2 === 0 ? "bg-muted/10" : ""
                                      }
                                    >
                                      <td className="w-1/4 p-3 text-left">
                                        {op.name}
                                      </td>
                                      <td className="w-24 p-3 text-center">
                                        {op.completedCount}
                                      </td>
                                      <td className="w-24 p-3 text-center">
                                        {op.todayCount}
                                      </td>
                                      <td className="w-24 p-3 text-center">
                                        {op.lastWeekCount}
                                      </td>
                                      <td className="w-24 p-3 text-center">
                                        {op.lastMonthCount}
                                      </td>
                                      <td className="w-24 p-3 text-center">
                                        {op.target}
                                      </td>
                                      <td className="w-40 p-3">
                                        <div className="flex items-center">
                                          <div className="mr-2 h-2 w-full rounded-full bg-muted">
                                            <div
                                              className="h-2 rounded-full bg-primary"
                                              style={{
                                                width: `${op.progress}%`,
                                              }}
                                            ></div>
                                          </div>
                                          <span className="ml-1 w-9 text-right text-xs font-medium">
                                            {op.progress.toFixed(2)}%
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            ) : (
                              <div className="p-8 text-center">
                                No operations found for this project.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
                <td>
                  {client ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7 border-2 border-[#E6B3BA]">
                        <AvatarImage
                          src={client.image || ""}
                          alt={client.name}
                        />
                        <AvatarFallback className="font-bold">
                          {`${client.name.charAt(0).toUpperCase()}`}
                        </AvatarFallback>
                      </Avatar>
                      <span className="capitalize">
                        {item.command.client?.name}
                      </span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <Dialog
                    open={openDialogs[item.id]}
                    onOpenChange={(open) =>
                      setOpenDialogs((prev) => ({ ...prev, [item.id]: open }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="text-gray-700">
                          {doneValues[item.id] ?? item.done}
                        </span>
                        <PencilIcon
                          size={14}
                          className="text-gray-400 transition-colors duration-200 hover:text-blue-500"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Done Value</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newValue = Number(
                            (e.target as HTMLFormElement).doneValue.value,
                          );
                          handleUpdateDoneValue(item.id, newValue);
                        }}
                      >
                        <Input
                          name="doneValue"
                          type="number"
                          defaultValue={doneValues[item.id] ?? item.done}
                        />
                        <Button
                          type="submit"
                          disabled={isPending}
                          className="mt-4 flex w-full items-center justify-center gap-2"
                        >
                          {isPending ? (
                            <>
                              <RefreshCw className="animate-spin" size={16} />
                              Updating...
                            </>
                          ) : (
                            <>
                              <RefreshCw size={16} />
                              Update
                            </>
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </td>
                <td>{item.target}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn({
                        "text-gray-500": !sprints,
                      })}
                    ></span>
                    {sprints || "N/A"}
                    <ConfigureSprintButton
                      commandProjectId={item.id}
                      sprint={item.sprint}
                      maxTarget={item.target}
                      size="icon"
                      variant="ghost"
                      className="size-7"
                    >
                      <Settings2Icon size={16} />
                    </ConfigureSprintButton>
                  </div>
                </td>
                <td>{statusMap[item.status] || "N/A"}</td>
                <td>{format(new Date(item.endDate), "PP")}</td>
                <td className=" w-[12rem] shrink-0">
                  <Link href={`/projects/workflow/${item.project.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-fit gap-2 bg-card py-1 font-normal"
                    >
                      <GitBranchPlusIcon size={16} />
                      <span>View operations</span>
                    </Button>
                  </Link>
                </td>
                <td>
                  {(user.role === "ADMIN" || user.role === "SYS_ADMIN") && (
                    <Popover>
                      <PopoverTrigger>
                        <Ellipsis size={16} />
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className=" flex w-fit flex-col gap-2"
                      >
                        <EditProjectButton
                          project={item}
                          variant="ghost"
                          className=" justify-start gap-2   px-6  hover:text-sky-500 "
                        >
                          <PencilIcon size={16} />
                          <span>Edit</span>
                        </EditProjectButton>

                        <ConfirmButton
                          variant="ghost"
                          size="icon"
                          className=" flex w-full justify-start gap-2 rounded-md px-6 hover:text-red-500"
                          action={async () => {
                            await handleDeleteCommandProject(item.id);
                          }}
                        >
                          <Trash2Icon size={16} />
                          <span>Delete</span>
                        </ConfirmButton>
                      </PopoverContent>
                    </Popover>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};
