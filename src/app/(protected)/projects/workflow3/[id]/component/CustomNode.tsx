import React from "react";
import { Handle, Position } from "reactflow";
import {
  Power,
  History,
  Activity,
  BarChart2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface NodeData {
  label: string;
  time: number;
  code: string;
}

const CustomNode = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-[280px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{data.label}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-600">{data.time} min</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600">
              {data.code}
            </span>
          </div>
        </div>
        <div className="h-6 w-6 rounded-full bg-emerald-400"></div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200"></div>

      {/* Bottom Icons */}
      <div className="grid grid-cols-4 divide-x divide-gray-200 py-4">
        <button className="group flex flex-col items-center py-2">
          <Power className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
          <span className="mt-1 text-xs text-gray-500">{data.time}m</span>
        </button>
        <button className="group flex flex-col items-center py-2">
          <History className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
          <span className="mt-1 text-xs text-gray-500">{data.time}m</span>
        </button>
        <button className="group flex flex-col items-center py-2">
          <Activity className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
          <span className="mt-1 text-xs text-gray-500">{data.time}m</span>
        </button>
        <button className="group flex flex-col items-center py-2">
          <BarChart2 className="h-5 w-5 text-gray-400 group-hover:text-emerald-500" />
          <span className="mt-1 text-xs text-gray-500">{data.time}m</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200"></div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{data.time} min</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Status</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-emerald-600">Active</span>
          <div className="h-4 w-4 rounded-full bg-emerald-400"></div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="-top-1 h-2 w-2 rounded-full border-2 border-white bg-emerald-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="-bottom-1 h-2 w-2 rounded-full border-2 border-white bg-emerald-400"
      />
    </div>
  );
};

export default CustomNode;
