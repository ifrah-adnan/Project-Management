"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  getCommandProjects,
  getOperations,
  getOperators,
  createPlanning,
  updatePlanning,
} from "../../utils/actions";
import { User, Planning } from "@prisma/client";

interface PlanningItem {
  commandProjectId: string;
  operationIds: string[];
}

export interface Operation {
  id: string;
  name: string;
  code: string;
  // icon: string;
  organizationId: string;
  description: string | null;
  isFinal: boolean;
  // estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
  expertiseId: string | null;
}

type CommandProject = {
  id: string;
  project: {
    id: string;
    name: string;
    description: string | null;
    status: boolean;
    organizationId: string;
    workFlowId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  command: {
    id: string;
    reference: string;
  };
};

interface PlanningFormProps {
  postId: string;
  existingPlanning: Planning | null;
  allExistingPlannings?: Planning[];
}

export function PlanningForm({
  postId,
  existingPlanning,
  allExistingPlannings,
}: PlanningFormProps) {
  const [loading, setLoading] = useState(false);
  const [planningItems, setPlanningItems] = useState<PlanningItem[]>(
    allExistingPlannings && allExistingPlannings.length > 0
      ? allExistingPlannings.map((planning) => ({
          commandProjectId: planning.commandProjectId,
          operationIds: [planning.operationId],
        }))
      : [{ commandProjectId: "", operationIds: [] }],
  );
  const [commandProjects, setCommandProjects] = useState<CommandProject[]>([]);
  const [operations, setOperations] = useState<Record<string, Operation[]>>({});
  const [operators, setOperators] = useState<User[]>([]);
  const [selectedOperator, setSelectedOperator] = useState(
    existingPlanning?.operatorId || "",
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: existingPlanning?.startDate
      ? new Date(existingPlanning.startDate)
      : undefined,
    to: existingPlanning?.endDate
      ? new Date(existingPlanning.endDate)
      : undefined,
  });

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [commandProjectsRes, operatorsRes] = await Promise.all([
        getCommandProjects(),
        getOperators(),
      ]);

      if (commandProjectsRes.success && commandProjectsRes.data) {
        setCommandProjects(commandProjectsRes.data);
      }
      if (operatorsRes.success && operatorsRes.data) {
        setOperators(operatorsRes.data);
      }
    } catch (error) {
      toast.error("Failed to fetch initial data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
    if (existingPlanning && allExistingPlannings) {
      setPlanningItems(
        allExistingPlannings.map((planning) => ({
          commandProjectId: planning.commandProjectId,
          operationIds: [planning.operationId],
        })),
      );
      setSelectedOperator(existingPlanning.operatorId);
      setDateRange({
        from: new Date(existingPlanning.startDate),
        to: new Date(existingPlanning.endDate),
      });

      allExistingPlannings.forEach((planning) =>
        fetchOperations(planning.commandProjectId),
      );
    }
  }, [existingPlanning, allExistingPlannings]);
  const fetchOperations = async (commandProjectId: string) => {
    try {
      const result = await getOperations(commandProjectId);
      if (result.success && result.data) {
        setOperations((prev) => ({
          ...prev,
          [commandProjectId]: result.data,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch operations");
    }
  };

  const handleCommandProjectChange = async (value: string, index: number) => {
    const newPlanningItems = [...planningItems];
    newPlanningItems[index].commandProjectId = value;
    newPlanningItems[index].operationIds = [];
    setPlanningItems(newPlanningItems);
    await fetchOperations(value);
  };

  const handleOperationChange = (operationId: string, index: number) => {
    const newPlanningItems = [...planningItems];
    const currentOperations = newPlanningItems[index].operationIds;

    if (currentOperations.includes(operationId)) {
      newPlanningItems[index].operationIds = currentOperations.filter(
        (id) => id !== operationId,
      );
    } else {
      newPlanningItems[index].operationIds = [
        ...currentOperations,
        operationId,
      ];
    }

    setPlanningItems(newPlanningItems);
  };

  const addPlanningItem = () => {
    setPlanningItems([
      ...planningItems,
      { commandProjectId: "", operationIds: [] },
    ]);
  };

  const removePlanningItem = (index: number) => {
    const newPlanningItems = planningItems.filter((_, i) => i !== index);
    setPlanningItems(newPlanningItems);
  };

  const handleSubmit = async () => {
    if (!selectedOperator || !dateRange.from || !dateRange.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      for (const item of planningItems) {
        for (const operationId of item.operationIds) {
          if (existingPlanning) {
            await updatePlanning({
              id: existingPlanning.id,
              postId,
              operatorId: selectedOperator,
              operationId,
              commandProjectId: item.commandProjectId,
              startDate: dateRange.from,
              endDate: dateRange.to,
            });
          } else {
            await createPlanning({
              postId,
              operatorId: selectedOperator,
              operationId,
              commandProjectId: item.commandProjectId,
              startDate: dateRange.from,
              endDate: dateRange.to,
            });
          }
        }
      }
      toast.success(
        existingPlanning
          ? "Planning updated successfully"
          : "Planning created successfully",
      );
      // Redirect to the planning display page
      window.location.href = `/planning?postId=${postId}`;
    } catch (error) {
      toast.error(
        existingPlanning
          ? "Failed to update planning"
          : "Failed to create planning",
      );
    }
    setLoading(false);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {existingPlanning ? "Edit Planning" : "Create Planning"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {planningItems.map((item, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Command Project {index + 1}
              </h3>
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removePlanningItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Select
              value={item.commandProjectId}
              onValueChange={(value) =>
                handleCommandProjectChange(value, index)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Command Project" />
              </SelectTrigger>
              <SelectContent>
                {commandProjects.map((cp: CommandProject) => (
                  <SelectItem key={cp.id} value={cp.id}>
                    {cp.command.reference} - {cp.project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {operations[item.commandProjectId] && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Operations</label>
                <div className="grid grid-cols-2 gap-2">
                  {operations[item.commandProjectId].map(
                    (operation: Operation) => (
                      <Button
                        key={operation.id}
                        variant={
                          item.operationIds.includes(operation.id)
                            ? "default"
                            : "outline"
                        }
                        className="justify-start"
                        onClick={() =>
                          handleOperationChange(operation.id, index)
                        }
                      >
                        {operation.name}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <Button onClick={addPlanningItem} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Command Project
        </Button>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Operator</label>
            <Select
              value={selectedOperator}
              onValueChange={setSelectedOperator}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator: User) => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Date Range</label>
            <div className="mt-2 rounded-lg border p-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range: any) => setDateRange(range)}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {existingPlanning ? "Update Planning" : "Create Planning"}
        </Button>
      </CardContent>
    </Card>
  );
}
