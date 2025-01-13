import React from "react";
import { Handle, Position } from "reactflow";
import {
  Power,
  History,
  Activity,
  BarChart2,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";

interface NodeData {
  label: string;
  time: number;
  code: string;
}

const CustomNode1 = ({ data }: { data: NodeData }) => {
  return (
    <div className="w-[280px] rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{data.label}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-300">{data.time} min</span>
            <span className="rounded-full bg-purple-900 px-2 py-0.5 text-xs font-medium text-purple-200">
              {data.code}
            </span>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-gray-700 p-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-200">{data.time} min</span>
          </div>
        </div>
        <div className="rounded-lg bg-gray-700 p-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-200">Active</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button className="rounded-lg bg-gray-700 p-2 hover:bg-gray-600">
          <Power className="mx-auto h-5 w-5 text-purple-400" />
        </button>
        <button className="rounded-lg bg-gray-700 p-2 hover:bg-gray-600">
          <History className="mx-auto h-5 w-5 text-purple-400" />
        </button>
        <button className="rounded-lg bg-gray-700 p-2 hover:bg-gray-600">
          <Activity className="mx-auto h-5 w-5 text-purple-400" />
        </button>
        <button className="rounded-lg bg-gray-700 p-2 hover:bg-gray-600">
          <BarChart2 className="mx-auto h-5 w-5 text-purple-400" />
        </button>
      </div>

      {/* Status Footer */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-700 p-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-gray-200">Running</span>
        </div>
        <div className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="-top-1 h-3 w-3 rounded-full border-2 border-gray-800 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="-bottom-1 h-3 w-3 rounded-full border-2 border-gray-800 bg-purple-500"
      />
    </div>
  );
};

export default CustomNode1;
