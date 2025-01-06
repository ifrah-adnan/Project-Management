"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlanningDetailView from "../PlanningDetailView";

interface PlanningSelectProps {
  plannings: any[];
}

export default function PlanningSelect({ plannings }: PlanningSelectProps) {
  const [selectedPlanning, setSelectedPlanning] = useState<any | null>(null);

  const handlePlanningSelect = (planningId: string) => {
    const planning = plannings.find((p) => p.id === planningId);
    setSelectedPlanning(planning || null);
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-md">
        <Select onValueChange={handlePlanningSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a planning" />
          </SelectTrigger>
          <SelectContent>
            {plannings.map((planning) => (
              <SelectItem key={planning.id} value={planning.id}>
                {planning.post?.name || "Unspecified Post"} -{" "}
                {planning.commandProject?.project?.name ||
                  "Unspecified Project"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedPlanning && (
        <div className="w-full">
          <PlanningDetailView planning={selectedPlanning} />
        </div>
      )}
    </div>
  );
}
