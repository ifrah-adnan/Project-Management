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
import { useRouter } from "next/navigation";

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

export const ListView: React.FC<{ data: TData; searchTerm: string }> = ({
  data,
  searchTerm,
}) => {
  const { session } = useSession();
  const user = session?.user;
  const [filteredData, setFilteredData] = useState<TData>([]);
  const [organizationId, setOrganizationId] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>("");
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);

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
    if (organizationId && data.length > 0) {
      let filtered = data.filter(
        (item) => item.organizationId === organizationId,
      );

      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.command.client?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.project.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredData(filtered);
    }
  }, [organizationId, data, searchTerm]);

  const [doneValues, setDoneValues] = useState<{ [key: string]: number }>({});
  const [isPending, startTransition] = useTransition();
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [operations, setOperations] = useState<any[]>([]);
  const [operationCount, setOperationCount] = useState<any>(0);
  const [isLoadingOperations, setIsLoadingOperations] = useState(false);
  const [targets, setTargets] = useState<{ [key: string]: number }>({});
  const router = useRouter();

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

  const handleOpenDialog = async (
    commandProjectId: string,
    projectName: string,
  ) => {
    setIsLoadingOperations(true);
    setCurrentProjectName(projectName);
    console.log("voila xxxle serach tearm", searchTerm);

    try {
      const result = await getOperationProgress2(commandProjectId);
      if (result.operationDetails) {
        setOperations(result.operationDetails);
        setOperationCount(result.operationCount);
        setTargets(result.targets);
      } else {
        console.error("Error: No operation details found");
      }
    } catch (error) {
      console.error("An error occurred while fetching operations:", error);
    } finally {
      setIsLoadingOperations(false);
    }
  };
  const handleRowClick = (id: string) => {
    router.push(`/project-overview?commandProjectId=${id}`);
  };
  const handleDownload = () => {
    const pdf = generatePDF(operations, currentProjectName);
    pdf.save("project_info.pdf");
  };
  console.log(operations, "tssssss333");
  console.log("this is information for all project", filteredData);

  return (
    <Card className="mx-auto h-full w-full max-w-screen-2xl overflow-auto p-4">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left">Project</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">
                Reference Command
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Client</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Done</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Target</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Sprints</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Status</th>
              <th className="whitespace-nowrap px-4 py-2 text-left">
                Deadline
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left">
                Operations
              </th>
              <th className="whitespace-nowrap px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              let totalSprints = item.sprint
                ? Math.ceil(item.target / item.sprint.target)
                : undefined;
              let completedSprints = item.sprint
                ? Math.floor(item.done / item.sprint.target)
                : undefined;
              let sprints = totalSprints
                ? `${completedSprints}/${totalSprints}`
                : undefined;
              const client = item.command.client;

              return (
                <tr
                  key={item.id}
                  className="cursor-pointer border-b transition-colors hover:bg-gray-50"
                  onClick={() => handleRowClick(item.id)}
                >
                  <td className="px-4 py-2">
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
                      <DialogContent className="max-h-[90vh] w-full overflow-x-auto sm:max-w-[90vw]">
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
                            </div>
                          </div>
                          <div className="rounded-md border">
                            <div className="grid grid-cols-4 gap-4 p-4">
                              {isLoadingOperations ? (
                                <div className="col-span-4 p-8 text-center">
                                  Loading operations...
                                </div>
                              ) : operations.length > 0 ? (
                                operations.map((op) => (
                                  <div
                                    key={op.id}
                                    className="flex flex-col items-center justify-center space-y-2 rounded-md bg-card p-4 shadow-md"
                                  >
                                    <div className="relative h-20 w-20">
                                      <svg
                                        className="h-full w-full"
                                        viewBox="0 0 100 100"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <circle
                                          cx="50"
                                          cy="50"
                                          r="40"
                                          fill="transparent"
                                          stroke="#E6B3BA"
                                          strokeWidth="4"
                                        />
                                        <circle
                                          cx="50"
                                          cy="50"
                                          r="40"
                                          fill="transparent"
                                          stroke="#8D99AE"
                                          strokeWidth="4"
                                          strokeDasharray="251.2"
                                          strokeDashoffset={
                                            251.2 - (251.2 * op.progress) / 100
                                          }
                                          transform="rotate(-90 50 50)"
                                        />
                                        <text
                                          x="50"
                                          y="50"
                                          textAnchor="middle"
                                          dominantBaseline="middle"
                                          className="text-sm font-medium text-primary"
                                        >
                                          {op.progress.toFixed(2)}%
                                        </text>
                                      </svg>
                                    </div>
                                    <div className="text-center text-sm font-medium text-[#2B2D42]">
                                      {op.name}
                                    </div>
                                    <div className="flex w-full items-center justify-between text-xs text-[#8D99AE]">
                                      <div>Completed: {op.completedCount}</div>
                                      <div>
                                        Target: {targets[op.id] || "N/A"}
                                      </div>
                                      <div>Today: {op.todayCount}</div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-4 p-8 text-center">
                                  No operations found for this project.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-4 py-2">{item.command.reference}</td>
                  <td className="px-4 py-2">
                    {client ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 border-2 border-[#E6B3BA]">
                          <AvatarImage
                            src={client.image || ""}
                            alt={client.name}
                          />
                          <AvatarFallback className="font-bold">
                            {client.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="capitalize">{client.name}</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">{item.done}</td>
                  <td className="px-4 py-2">{item.target}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className={cn({ "text-gray-500": !sprints })}>
                        {sprints || "N/A"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle sprint configuration
                        }}
                      >
                        <Settings2Icon size={16} />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {statusMap[item.status] || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(item.endDate), "PP")}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-fit gap-2 bg-card py-1 font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/workflow/${item.project.id}`);
                      }}
                    >
                      <GitBranchPlusIcon size={16} />
                      <span>View operations</span>
                    </Button>
                  </td>
                  <td className="px-4 py-2">
                    {(user.role === "ADMIN" || user.role === "SYS_ADMIN") && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()} // Empêche la redirection
                          >
                            <Ellipsis size={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="flex w-fit flex-col gap-2"
                        >
                          <Button
                            variant="ghost"
                            className="flex w-full justify-start gap-2 rounded-md px-6 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCommandProject(item.id);
                            }}
                          >
                            <Trash2Icon size={16} />
                            <span>Delete</span>
                          </Button>
                        </PopoverContent>
                      </Popover>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
