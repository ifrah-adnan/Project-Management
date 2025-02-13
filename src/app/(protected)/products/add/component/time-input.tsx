"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  value: number;
  onChange: (seconds: number) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const [minutes, setMinutes] = useState(Math.floor(value / 60));
  const [seconds, setSeconds] = useState(value % 60);

  useEffect(() => {
    setMinutes(Math.floor(value / 60));
    setSeconds(value % 60);
  }, [value]);

  const handleTimeChange = (
    type: "minutes" | "seconds",
    inputValue: string,
  ) => {
    const numValue = Number.parseInt(inputValue) || 0;

    if (type === "minutes") {
      setMinutes(numValue);
      onChange(numValue * 60 + seconds);
    } else {
      const newSeconds = Math.min(59, Math.max(0, numValue));
      setSeconds(newSeconds);
      onChange(minutes * 60 + newSeconds);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col space-y-1">
        <Label>Minutes</Label>
        <Input
          type="number"
          min="0"
          value={minutes}
          onChange={(e) => handleTimeChange("minutes", e.target.value)}
          className="w-20"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <Label>Seconds</Label>
        <Input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => handleTimeChange("seconds", e.target.value)}
          className="w-20"
        />
      </div>
    </div>
  );
}
