import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  value: number;
  onChange: (minutes: number) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const [hours, setHours] = useState(Math.floor(value / 60));
  const [minutes, setMinutes] = useState(value % 60);

  const handleTimeChange = (type: "hours" | "minutes", inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;

    if (type === "hours") {
      setHours(numValue);
      onChange(numValue * 60 + minutes);
    } else {
      setMinutes(numValue);
      onChange(hours * 60 + numValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col space-y-1">
        <Label>Hours</Label>
        <Input
          type="number"
          min="0"
          value={hours}
          onChange={(e) => handleTimeChange("hours", e.target.value)}
          className="w-20"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <Label>Minutes</Label>
        <Input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => handleTimeChange("minutes", e.target.value)}
          className="w-20"
        />
      </div>
    </div>
  );
}
