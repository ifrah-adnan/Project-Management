"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  getHourlyOperations,
  getWeeklyOperations,
  HourlyOperation,
  WeeklyOperation,
} from "@/actions/weekly-operations";
import {
  CommandProject,
  getCommandProject,
  getOperationProgress2,
  handleDeleteCommandProject,
} from "../../projects/_utils/actions";
import {
  getOperationProgress,
  OperationProgressSummary,
} from "@/actions/operation-progress";
import {
  CalendarDays,
  Ellipsis,
  ListChecksIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import ConfigureSprintButton from "../../projects/_components/configure-sprint-button";
import { format } from "date-fns";
import { CircularProgress } from "@/components/circular-progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditProjectButton } from "../../projects/_components/edit-project-button";
import { ConfirmButton } from "@/components/confirm-button";

export default function ProjectOverviewPage() {
  const searchParams = useSearchParams();
  const commandProjectId = searchParams.get("commandProjectId");

  const [commandProject, setCommandProject] = useState<CommandProject | null>(
    null,
  );
  const [weeklyOperations, setWeeklyOperations] = useState<WeeklyOperation[]>(
    [],
  );
  const [hourlyOperations, setHourlyOperations] = useState<HourlyOperation[]>(
    [],
  );
  const [operationDetails, setOperationDetails] = useState<
    OperationProgressSummary["operationDetails"]
  >([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<
    OperationProgressSummary["weeklyProgress"]
  >({
    weeklyTarget: null,
    weeklyCompleted: 0,
    hasSprint: false,
    hasFinalOperation: false,
  });
  const [totalEstimatedHours, setTotalEstimatedHours] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!commandProjectId) return;

      try {
        const projectData = await getCommandProject(commandProjectId);
        setCommandProject(projectData);

        const weeklyOps = await getWeeklyOperations(commandProjectId);
        setWeeklyOperations(weeklyOps);

        const hourlyOps = await getHourlyOperations(commandProjectId);
        setHourlyOperations(hourlyOps);

        const progressData = await getOperationProgress2(commandProjectId);
        setOperationDetails(progressData.operationDetails);
        setTotalCompleted(progressData.totalCompleted);
        setTotalTarget(progressData.totalTarget);
        setWeeklyProgress(progressData.weeklyProgress);
        setTotalEstimatedHours(progressData.totalEstimatedHours);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
    setMounted(true);
  }, [commandProjectId]);

  if (!mounted) return null;

  const totalProgress =
    totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  const transformedHourlyOperations = hourlyOperations.map((operation) => ({
    name: `${operation.hour}:00`,
    Total: operation.Total,
  }));

  const weeklyProgressPercentage =
    weeklyProgress.weeklyTarget && weeklyProgress.weeklyTarget > 0
      ? (weeklyProgress.weeklyCompleted / weeklyProgress.weeklyTarget) * 100
      : null;

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="mb-6 text-3xl font-bold">Project Overview</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Project Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCompleted}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Target
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTarget}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalProgress.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Estimated Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalEstimatedHours.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Operations Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Operations</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyOperations}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="Total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Operations</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={transformedHourlyOperations}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="Total"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weeklyProgressPercentage !== null && (
                    <Progress value={weeklyProgressPercentage} />
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>{weeklyProgress.weeklyCompleted} completed</div>
                    <div>{weeklyProgress.weeklyTarget || "N/A"} target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-4 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {operationDetails.map((op) => {
              const value = (op.completedCount / (op.target || 1)) * 100;
              return (
                <Card
                  key={op.id}
                  className="flex flex-col gap-4 p-3 sm:gap-6 sm:p-4"
                >
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <div className="mr-auto flex flex-col gap-1">
                      <span className="font-medium">{op.name}</span>
                      <span className="text-xs capitalize">
                        {commandProject?.command?.client?.name || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <CircularProgress
                      value={value}
                      className="mx-auto w-1/2 stroke-sky-900 shadow-black/0 sm:w-2/3"
                      gradient={{
                        startColor: "#2196F3",
                        endColor: "#0c4a6e",
                      }}
                    />
                    <span className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-xl font-medium sm:text-2xl">
                      {value.toFixed(2).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex justify-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-1">
                        <span className="size-5 rounded bg-gradient-to-r from-[#2196F3] to-[#0c4a6e]"></span>
                        <span className="font-medium text-gray-500">Done:</span>
                        <span className="font-medium">{op.completedCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="size-5 rounded bg-muted"></span>
                        <span className="font-medium text-gray-500">
                          Target:
                        </span>
                        <span className="font-medium">
                          {op.target || "N/A"}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={value}
                      className="h-1.5 text-red-500 sm:h-2"
                      color={
                        (value < 25 && "#ef4444") ||
                        (value < 75 && "#eab308") ||
                        "#22c55e"
                      }
                    />
                    <div className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
                      <span className="text-gray-500">Today:</span>
                      <span>{op.todayCount}</span>
                      <CalendarDays size={16} className="ml-auto" />
                      <span className="text-gray-500">
                        {format(new Date(), "PP")}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="rounded-md bg-card p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Project Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Total Completed:</p>
                <p>{totalCompleted}</p>
              </div>
              <div>
                <p className="font-semibold">Total Target:</p>
                <p>{totalTarget}</p>
              </div>
              <div>
                <p className="font-semibold">Total Progress:</p>
                <p>{totalProgress.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
