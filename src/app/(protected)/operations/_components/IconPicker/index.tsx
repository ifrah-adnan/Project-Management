import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as Icons from "lucide-react";
import {
  TypeIcon as type,
  type LucideIcon,
  LightbulbIcon as LucideProps,
} from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const IconComponent = value
    ? (Icons[value as keyof typeof Icons] as LucideIcon)
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {IconComponent ? <IconComponent size={20} /> : "Select Icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(Icons).map(([iconName, Icon]) => {
            if (typeof Icon !== "function") return null;
            return (
              <Button
                key={iconName}
                variant="ghost"
                className="h-10 w-10 p-0"
                onClick={() => onChange(iconName)}
              >
                {React.createElement(
                  Icon as React.ComponentType<typeof LucideProps>,
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
