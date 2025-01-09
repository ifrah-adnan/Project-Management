import React, { useEffect, useState } from "react";
import { TData } from "../../_utils/schemas";
import Card from "@/components/card";
import { format } from "date-fns";
import {
  CalendarDays,
  Ellipsis,
  ListChecksIcon,
  PencilIcon,
  Trash2Icon,
  CheckCircle,
} from "lucide-react";
import { statusMap } from "@/app/(protected)/_components/status-map";
import { CircularProgress } from "@/components/circular-progress";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditProjectButton } from "../edit-project-button";
import { ConfirmButton } from "@/components/confirm-button";
import {
  handleDeleteCommandProject,
  getOperationHistorySum,
} from "../../_utils/actions";
import ConfigureSprintButton from "../configure-sprint-button";
import { getServerSession } from "@/lib/auth";

const getProgressStyle = (percentage: number) => {
  if (percentage >= 100) {
    return {
      background: "bg-gradient-to-br from-emerald-600 to-green-700",
      cardBorder: "border-emerald-400",
      stroke: "stroke-emerald-400",
      circleStart: "#34d399", // Emerald 400
      circleEnd: "#10b981", // Emerald 500
      barColor: "#34d399",
      text: "text-white",
      softText: "text-emerald-100",
      indicator: "bg-emerald-400",
      shadow: "shadow-xl shadow-emerald-900/20",
      hover: "hover:shadow-emerald-900/30 hover:scale-[1.02]",
      icon: "text-emerald-400",
      buttonHover: "hover:bg-emerald-500/10",
    };
  } else if (percentage >= 30) {
    return {
      background: "bg-gradient-to-br from-amber-600 to-orange-700",
      cardBorder: "border-amber-400",
      stroke: "stroke-amber-400",
      circleStart: "#fbbf24", // Amber 400
      circleEnd: "#f59e0b", // Amber 500
      barColor: "#fbbf24",
      text: "text-white",
      softText: "text-amber-100",
      indicator: "bg-amber-400",
      shadow: "shadow-xl shadow-amber-900/20",
      hover: "hover:shadow-amber-900/30 hover:scale-[1.02]",
      icon: "text-amber-400",
      buttonHover: "hover:bg-amber-500/10",
    };
  } else {
    return {
      background: "bg-gradient-to-br from-rose-600 to-red-700",
      cardBorder: "border-rose-400",
      stroke: "stroke-rose-400",
      circleStart: "#fb7185", // Rose 400
      circleEnd: "#f43f5e", // Rose 500
      barColor: "#fb7185",
      text: "text-white",
      softText: "text-rose-100",
      indicator: "bg-rose-400",
      shadow: "shadow-xl shadow-rose-900/20",
      hover: "hover:shadow-rose-900/30 hover:scale-[1.02]",
      icon: "text-rose-400",
      buttonHover: "hover:bg-rose-500/10",
    };
  }
};

const formatPercentage = (value: number): string => {
  if (!Number.isFinite(value)) return "--";
  return value.toFixed(1);
};

export const GridView: React.FC<{ data: TData }> = ({ data }) => {
  const [filteredData, setFilteredData] = useState<TData>([]);
  const [organizationId, setOrganizationId] = useState<any>(null);
  const [operationHistorySums, setOperationHistorySums] = useState<
    Record<string, { percentage: number; completedCount: number }>
  >({});

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

      const fetchOperationHistorySums = async () => {
        const sums: Record<
          string,
          { percentage: number; completedCount: number }
        > = {};
        for (const item of filtered) {
          const result = await getOperationHistorySum(item.id);
          sums[item.id] = result;
        }
        setOperationHistorySums(sums);
      };

      fetchOperationHistorySums();
    }
  }, [data, organizationId]);

  return (
    <main className="bg-gray-50/50 p-6">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 text-sm sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredData.map((item) => {
          const client = item.command.client;
          const { percentage = 0, completedCount = 0 } =
            operationHistorySums[item.id] || {};
          const styles = getProgressStyle(percentage);
          const isComplete = percentage >= 100;

          let totalSprints: number | undefined = undefined;
          let completedSprints: number | undefined = undefined;
          let sprints: undefined | string = undefined;

          if (item.sprint && item.sprint.target > 0) {
            totalSprints = Math.ceil(item.target / item.sprint.target);
            completedSprints = Math.floor(completedCount / item.sprint.target);
            sprints = `${completedSprints}/${totalSprints}`;
          }

          const displayPercentage = formatPercentage(percentage);

          return (
            <Card
              key={item.id}
              className={`group relative flex flex-col gap-4 border-2 p-5 transition-all 
                       duration-300 ease-in-out sm:gap-6
                       ${styles.background} ${styles.cardBorder} ${styles.shadow} ${styles.hover}`}
            >
              {isComplete && (
                <div className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 backdrop-blur-sm">
                  <CheckCircle className={`h-5 w-5 ${styles.icon}`} />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <span
                    className={`text-lg font-semibold tracking-tight ${styles.text}`}
                  >
                    {item.project.name}
                  </span>
                  <span className={`text-sm font-medium ${styles.softText}`}>
                    {client?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {statusMap[item.status] && (
                    <span
                      className={`rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize backdrop-blur-sm ${styles.text}`}
                    >
                      {statusMap[item.status]}
                    </span>
                  )}
                  <Popover>
                    <PopoverTrigger>
                      <div
                        className={`rounded-full p-1.5 transition-colors ${styles.buttonHover}`}
                      >
                        <Ellipsis size={16} className={styles.text} />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="flex w-fit flex-col gap-2 border-2 p-2"
                    >
                      <EditProjectButton
                        project={item}
                        variant="ghost"
                        className="justify-start gap-2 px-6 hover:text-sky-500"
                      >
                        <PencilIcon size={16} />
                        <span>Edit</span>
                      </EditProjectButton>
                      <ConfirmButton
                        variant="ghost"
                        size="icon"
                        className="flex w-full justify-start gap-2 rounded-md px-6 hover:text-red-500"
                        action={async () => {
                          await handleDeleteCommandProject(item.id);
                        }}
                      >
                        <Trash2Icon size={16} />
                        <span>Delete</span>
                      </ConfirmButton>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="relative py-4">
                <CircularProgress
                  value={percentage}
                  className={`mx-auto w-1/2 transition-all duration-300 sm:w-2/3 ${styles.stroke}`}
                  gradient={{
                    startColor: styles.circleStart,
                    endColor: styles.circleEnd,
                  }}
                />
                <span
                  className={`absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-3xl font-bold sm:text-4xl ${styles.text}`}
                >
                  {displayPercentage}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-3 rounded-full ${styles.indicator}`}
                    />
                    <span className={styles.softText}>
                      Done:{" "}
                      <span className={`font-semibold ${styles.text}`}>
                        {completedCount}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-white/30" />
                    <span className={styles.softText}>
                      Target:{" "}
                      <span className={`font-semibold ${styles.text}`}>
                        {item.target}
                      </span>
                    </span>
                  </div>
                </div>

                <Progress
                  value={percentage}
                  className="h-2 rounded-full bg-black/10"
                  color={styles.barColor}
                />

                <div className="flex items-center justify-between pt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={styles.softText}>Sprints</span>
                    <ConfigureSprintButton
                      commandProjectId={item.id}
                      sprint={item.sprint}
                      maxTarget={item.target}
                      size="icon"
                      variant="ghost"
                      className={`size-6 ${styles.buttonHover}`}
                    >
                      <ListChecksIcon size={14} className={styles.text} />
                    </ConfigureSprintButton>
                    <span className={`font-semibold ${styles.text}`}>
                      {sprints || "--"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className={styles.text} />
                    <span className={styles.softText}>
                      {format(new Date(item.endDate), "PP")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
};
