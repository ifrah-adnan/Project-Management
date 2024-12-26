import React from "react";
import { Handle, Position } from "reactflow";
import { Clock } from "lucide-react";

const CustomNode = ({ data }: { data: { label: string; time: number } }) => {
  return (
    <div className="rounded-md border-2 border-gray-200 bg-white px-4 py-2 shadow-md">
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <Clock className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800">{data.label}</div>
          <div className="text-sm text-gray-500">{data.time} min</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="h-4 w-4 rounded-full bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-4 w-4 rounded-full bg-indigo-500"
      />
    </div>
  );
};

export default CustomNode;
