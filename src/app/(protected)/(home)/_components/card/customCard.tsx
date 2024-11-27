import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FiActivity, FiTarget, FiCalendar, FiLayers } from "react-icons/fi";
import { CommandProject } from "../../page";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Props = {
  project: CommandProject;
};

function CustomCard({ project }: Props) {
  const { id: commandProjectId } = project;
  const value = (project.done / project.target) * 100;

  let totalSprints: number | undefined = undefined;
  let completedSprints: number | undefined = undefined;
  let sprints: undefined | string = undefined;
  if (project.sprint) {
    totalSprints = Math.ceil(project.target / project.sprint.target);
    completedSprints = Math.floor(project.done / project.sprint.target);
    sprints = `${completedSprints}/${totalSprints}`;
  }

  return (
    <Link
      href={`/project-overview?commandProjectId=${commandProjectId}`}
      passHref
      legacyBehavior
    >
      <a>
        <Card className="mt-4 w-[300px] rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">
              {project.command.reference}
            </span>
            <span className="text-sm text-gray-500">...</span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status
            </span>
            <span
              className={`text-sm font-medium ${getStatusColor(project.status)}`}
            >
              {project.status}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Project
            </span>
            <span className="text-sm font-medium">{project.project.name}</span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <FiActivity className="mr-1 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Done:
              </span>
            </div>
            <span className="text-sm font-medium">{project.done}</span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <FiTarget className="mr-1 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Target:
              </span>
            </div>
            <span className="text-sm font-medium">{project.target}</span>
          </div>

          <div className="my-4">
            <Progress
              value={value}
              className={cn(
                "h-2",
                value < 25 && "bg-red-500",
                value >= 25 && value < 75 && "bg-yellow-500",
                value >= 75 && "bg-green-500",
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiLayers className="mr-1 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Sprints:
              </span>
            </div>
            <span className="text-sm font-medium">{sprints || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCalendar className="mr-1 text-gray-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Date:
              </span>
            </div>
            <span className="text-sm font-medium">
              {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        </Card>
      </a>
    </Link>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "text-blue-500";
    case "ON_HOLD":
      return "text-yellow-500";
    case "COMPLETED":
      return "text-green-500";
    case "CANCELLED":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export default CustomCard;
