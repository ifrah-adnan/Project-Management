import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Briefcase,
  FileText,
  PenToolIcon as Tool,
} from "lucide-react";

interface PlanningCardProps {
  planning: any;
}

export default function PlanningCard({ planning }: PlanningCardProps) {
  if (!planning) return null;

  const startDate = new Date(planning.startDate);
  const endDate = new Date(planning.endDate);

  return (
    <Link href={`/commitement/${planning.id}`} passHref>
      <Card className="cursor-pointer transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center justify-between">
            <span>{planning.post?.name || "Unspecified Post"}</span>
            <span className="text-sm font-normal">
              {planning.commandProject?.project?.name || "Unspecified Project"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {startDate.toLocaleTimeString()} -{" "}
                {endDate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              <span>
                {planning.commandProject?.command?.reference ||
                  "Unspecified Command"}
              </span>
            </div>
            <div className="flex items-center">
              <Tool className="mr-2 h-4 w-4" />
              <span>{planning.operation?.name || "No operation assigned"}</span>
            </div>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>
                Project:{" "}
                {planning.commandProject?.project?.name ||
                  "Unspecified Project"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
