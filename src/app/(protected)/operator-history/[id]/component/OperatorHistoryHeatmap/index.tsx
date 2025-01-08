"use client";

import { useTheme } from "next-themes";
import {
  format,
  eachDayOfInterval,
  subYears,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OperatorHistoryHeatmapProps {
  countsByDate: Record<string, number>;
  planningDetails: Record<string, { startDate: Date; endDate: Date }>;
  onDateClick: (date: string) => void;
}

export function OperatorHistoryHeatmap({
  countsByDate,
  planningDetails,
  onDateClick,
}: OperatorHistoryHeatmapProps) {
  const { theme } = useTheme();
  const today = new Date();
  const startDate = subYears(today, 1);
  const adjustedStartDate = startOfWeek(startDate, { weekStartsOn: 1 });

  const dates = eachDayOfInterval({
    start: adjustedStartDate,
    end: today,
  });

  const getColor = (count: number) => {
    if (count === 0) return theme === "dark" ? "bg-gray-800" : "bg-gray-100";
    if (count <= 3) return "bg-blue-300";
    if (count <= 6) return "bg-blue-400";
    if (count <= 9) return "bg-blue-500";
    return "bg-blue-600";
  };

  // Group dates by week
  const weeks = dates.reduce(
    (acc, date) => {
      const weekNum = Math.floor(
        (date.getTime() - adjustedStartDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );
      if (!acc[weekNum]) acc[weekNum] = [];
      acc[weekNum].push(date);
      return acc;
    },
    {} as Record<number, Date[]>,
  );

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Calculate months and their positions
  const months = eachMonthOfInterval({ start: startDate, end: today });
  const monthPositions = months.map((month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const weekIndex = Math.floor(
      (start.getTime() - adjustedStartDate.getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    );
    const numWeeks = Math.ceil(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
    return {
      name: format(month, "MMM"),
      index: weekIndex,
      width: numWeeks,
    };
  });

  return (
    <TooltipProvider>
      <div className="w-full p-4">
        <div className="flex flex-col gap-2 rounded-md">
          <div className="mb-4 text-xl font-semibold">
            <span>Operation history over the last year</span>
          </div>
          <div className="flex">
            <div className="mr-2 flex flex-col gap-2 text-sm">
              {weekdays.map((day) => (
                <div key={day} className="h-[10px] text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="mb-2 flex justify-between text-sm text-muted-foreground">
                {monthPositions.map((month, i) => (
                  <div
                    key={i}
                    className="flex-none text-center"
                    style={{ width: `${month.width * 11}px` }}
                  >
                    {month.name}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                {Object.values(weeks).map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-1 flex-col gap-1">
                    {week.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const count = countsByDate[dateStr] || 0;
                      const planning = planningDetails[dateStr];
                      return (
                        <Tooltip key={dateStr}>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => onDateClick(dateStr)}
                              className={`h-[10px] w-[10px] rounded-sm ${getColor(
                                count,
                              )} cursor-pointer hover:ring-2 hover:ring-ring hover:ring-offset-2 hover:ring-offset-background`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <div>
                                {count} operation{count !== 1 ? "s" : ""} on{" "}
                                {format(date, "d MMM yyyy")}
                              </div>
                              {planning && (
                                <div>
                                  Planning:{" "}
                                  {format(planning.startDate, "d MMM")} -{" "}
                                  {format(planning.endDate, "d MMM")}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Less</span>
            {[0, 1, 4, 7, 10].map((level) => (
              <div
                key={level}
                className={`h-[10px] w-[10px] rounded-sm ${getColor(level)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
