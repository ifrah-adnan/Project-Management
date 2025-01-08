"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/table";
import { format } from "date-fns";
import { getOperatorHistory } from "../utils/action";
import { OperatorHistoryHeatmap } from "./component/OperatorHistoryHeatmap";

export default function OperatorHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [operatorHistory, setOperatorHistory] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getOperatorHistory(params.id);
      setOperatorHistory(history);
    };
    fetchHistory();
  }, [params.id]);

  if (!operatorHistory) {
    return <div>Loading...</div>;
  }

  const { countsByDate, planningDetails } = operatorHistory;

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const selectedDateHistory = selectedDate
    ? {
        count: countsByDate[selectedDate] || 0,
        planning: planningDetails[selectedDate],
      }
    : null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">Operator History</h1>
      <Card className="mb-8">
        <OperatorHistoryHeatmap
          countsByDate={countsByDate}
          planningDetails={planningDetails}
          onDateClick={handleDateClick}
        />
      </Card>
      {selectedDateHistory && (
        <Card className="p-4">
          <h2 className="mb-4 text-xl font-semibold">
            Selected Date: {selectedDate}
          </h2>
          <p>Total operations: {selectedDateHistory.count}</p>
          {selectedDateHistory.planning && (
            <p>
              Planning:{" "}
              {format(new Date(selectedDateHistory.planning.startDate), "PP")} -{" "}
              {format(new Date(selectedDateHistory.planning.endDate), "PP")}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
