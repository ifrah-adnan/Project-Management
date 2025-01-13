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

const CustomNode3 = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-[280px] overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{data.label}</h3>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            {data.code}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">{data.time} minutes</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Status</span>
          </div>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="space-y-1 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">History</span>
          </div>
          <p className="text-sm text-gray-500">Updated</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-orange-500">
            <Power className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-orange-500">
            <BarChart2 className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Running</span>
          <div className="h-2.5 w-2.5 rounded-full bg-orange-400"></div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="-top-1 h-3 w-3 rounded-full border-2 border-white bg-orange-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="-bottom-1 h-3 w-3 rounded-full border-2 border-white bg-orange-400"
      />
    </div>
  );
};

export default CustomNode3;
