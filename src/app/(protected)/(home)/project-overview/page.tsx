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
} from "../../projects/_utils/actions";
import {
  getOperationProgress,
  OperationProgressSummary,
} from "@/actions/operation-progress";

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {operationDetails.length > 0 ? (
              operationDetails.map((op) => (
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
                        strokeDashoffset={251.2 - (251.2 * op.progress) / 100}
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-primary text-sm font-medium"
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
                    <div>Target: {op.target || "N/A"}</div>
                    <div>Today: {op.todayCount}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center">
                No operations found for this project.
              </div>
            )}
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
