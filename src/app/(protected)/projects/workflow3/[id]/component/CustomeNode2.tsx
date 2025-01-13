import React from "react";
import { Handle, Position } from "reactflow";
import {
  Power,
  History,
  Activity,
  BarChart2,
  Clock,
  AlertCircle,
  Box,
  Hexagon,
} from "lucide-react";

interface NodeData {
  label: string;
  time: number;
  code: string;
}

const CustomNode2 = ({ data }: { data: NodeData }) => {
  return (
    <div className="relative w-[320px] transform-gpu">
      {/* Main Card with Strong 3D Effect */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-[3px] shadow-[0_0_30px_rgba(37,99,235,0.3)]">
        <div className="relative rounded-xl bg-gradient-to-br from-white to-gray-100 p-5">
          {/* Visible 3D Border Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-70"></div>

          {/* Content Container with Enhanced Depth */}
          <div className="relative">
            {/* Header with Strong 3D Typography */}
            <div className="mb-6 flex items-center justify-between">
              <div className="transform-gpu">
                <h3 className="bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-2xl font-black text-transparent [text-shadow:2px_2px_4px_rgba(0,0,0,0.1)]">
                  {data.label}
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5">
                    <Clock className="h-4 w-4 text-blue-700" />
                    <span className="font-bold text-blue-700">
                      {data.time} min
                    </span>
                  </div>
                  <div className="relative">
                    <span className="relative z-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
                      {data.code}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-lg"></div>
                <div className="relative h-14 w-14 transform-gpu rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-[0_8px_16px_rgba(37,99,235,0.3)] transition-transform hover:-translate-y-1">
                  <Hexagon className="h-full w-full text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                </div>
              </div>
            </div>

            {/* 3D Stats Panels with Strong Depth */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="transform-gpu rounded-xl bg-gradient-to-br from-white to-blue-50 p-4 shadow-[0_8px_16px_rgba(37,99,235,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(37,99,235,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500 p-2.5 shadow-[0_4px_8px_rgba(37,99,235,0.3)]">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Duration</p>
                    <p className="text-lg font-bold text-blue-600">
                      {data.time} min
                    </p>
                  </div>
                </div>
              </div>
              <div className="transform-gpu rounded-xl bg-gradient-to-br from-white to-purple-50 p-4 shadow-[0_8px_16px_rgba(147,51,234,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(147,51,234,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500 p-2.5 shadow-[0_4px_8px_rgba(147,51,234,0.3)]">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Status</p>
                    <p className="text-lg font-bold text-purple-600">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons with Enhanced 3D Effect */}
            <div className="mb-6 grid grid-cols-4 gap-3">
              {[
                { icon: Power, color: "blue" },
                { icon: History, color: "purple" },
                { icon: Activity, color: "blue" },
                { icon: BarChart2, color: "purple" },
              ].map(({ icon: Icon, color }, index) => (
                <button
                  key={index}
                  className={`group relative transform-gpu overflow-hidden rounded-xl bg-gradient-to-b from-white to-gray-50 p-4 shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)] active:translate-y-0 ${
                    color === "blue" ? "hover:bg-blue-50" : "hover:bg-purple-50"
                  }`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${
                      color === "blue" ? "bg-blue-100/50" : "bg-purple-100/50"
                    }`}
                  ></div>
                  <Icon
                    className={`h-6 w-6 transition-colors ${
                      color === "blue" ? "text-blue-600" : "text-purple-600"
                    } group-hover:text-opacity-80`}
                  />
                </button>
              ))}
            </div>

            {/* Status Bar with Enhanced 3D Effect */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500 p-2 shadow-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    System Active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-green-600">ONLINE</span>
                  <div className="relative h-4 w-4">
                    <div className="absolute h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></div>
                    <div className="relative h-full w-full rounded-full bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced 3D Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="-top-2 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="-bottom-2 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
      />
    </div>
  );
};

export default CustomNode2;
