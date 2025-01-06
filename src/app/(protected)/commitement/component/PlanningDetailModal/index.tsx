"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateOperationHistory } from "../../utils/action";

interface PlanningDetailModalProps {
  planning: any;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanningDetailModal({
  planning,
  isOpen,
  onClose,
}: PlanningDetailModalProps) {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (planning && Array.isArray(planning.operationHistory)) {
      setHistory(planning.operationHistory);
    } else {
      setHistory([]);
    }
  }, [planning]);

  const handleUpdateCount = async () => {
    try {
      const newHistory = await updateOperationHistory(planning.id, count);
      setHistory((prevHistory) => [...prevHistory, newHistory]);
      toast.success("Operation history updated successfully");
    } catch (error) {
      toast.error("Failed to update operation history");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Planning Details</DialogTitle>
          <DialogDescription>
            View and update planning details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Post:</strong> {planning?.post?.name}
          </div>
          <div>
            <strong>Project:</strong> {planning?.commandProject?.project?.name}
          </div>
          <div>
            <strong>Command:</strong>{" "}
            {planning?.commandProject?.command?.reference}
          </div>
          <div>
            <strong>Target:</strong> {planning?.commandProject?.target}
          </div>
          <div>
            <strong>Operation:</strong> {planning?.operation?.name}
          </div>
          <div>
            <strong>Start Date:</strong>{" "}
            {planning?.startDate &&
              new Date(planning.startDate).toLocaleString()}
          </div>
          <div>
            <strong>End Date:</strong>{" "}
            {planning?.endDate && new Date(planning.endDate).toLocaleString()}
          </div>
          <div>
            <strong>New Target Count:</strong>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleUpdateCount}>Add New Target Count</Button>

          <div>
            <strong>Target Count History:</strong>
            {history.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {history.map((item, index) => (
                  <li key={index}>
                    Count: {item.count}, Date:{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">No history available</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
