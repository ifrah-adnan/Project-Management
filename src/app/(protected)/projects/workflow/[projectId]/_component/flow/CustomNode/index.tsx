import Card from "@/components/card";
import React from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Clock1, EllipsisVertical, Pencil, Repeat, Trash2 } from "lucide-react";
import icons from "../../icons";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStore } from "../../../store";

function CustomNode({
  data,
  id,
  isConnectable,
}: {
  data: {
    name: string;
    icon: string;
    description: string;
    estimatedTime: string;
    isFinal: boolean;
    operationId: string;
  };
  id: string;
  isConnectable: boolean;
}) {
  const { nodes, edges, setEdges, setNodes, setNodeSelected, nodeSelected } =
    useStore();
  return (
    <Card
      variant="muted"
      className="relative min-w-[14rem] max-w-full px-3 py-2"
      style={{
        backgroundColor: "#2C3E50",
        color: "#ECF0F1",
        boxShadow:
          nodeSelected?.id === id
            ? "0px 4px 8px rgba(52, 152, 219, 0.5)"
            : "0px 2px 4px rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s ease",
        borderRadius: "8px",
      }}
    >
      <Handle
        type="target"
        id="source1"
        isConnectable={isConnectable}
        position={Position.Top}
        style={{
          background: "#3498DB",
          width: "12px",
          height: "12px",
          border: "2px solid #ECF0F1",
          top: "-6px",
        }}
      />

      <div className="flex h-full w-full items-center gap-3">
        <Button
          variant="outline"
          className="size-12 border-[#3498DB] bg-transparent hover:bg-[#34495E]"
        >
          {data.icon &&
            typeof data.icon === "string" &&
            React.createElement(
              icons?.[data.icon as keyof typeof icons] as React.ComponentType<{
                size: number;
                color: string;
              }>,
              { size: 24, color: "#3498DB" },
            )}
        </Button>
        <div className="flex flex-col gap-1 truncate text-sm">
          <span className="font-semibold">
            {data.name}{" "}
            {data.isFinal && (
              <span className="text-xs font-normal text-[#BDC3C7]">
                (Final)
              </span>
            )}
          </span>

          <div className="flex items-center gap-1 text-xs text-[#BDC3C7]">
            <Clock1 size={12} />
            <span>Est. time: {data.estimatedTime}</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            className="size-8 rounded-full p-0"
            variant="ghost"
            style={{ color: "#3498DB" }}
          >
            <Repeat size={16} />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="size-8 rounded-full p-0"
                variant="ghost"
                style={{ color: "#3498DB" }}
              >
                <EllipsisVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[8rem] border-[#3498DB] bg-[#34495E] p-1">
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => {
                    const node = nodes.find((node) => node.id === id);
                    if (!node) return;
                    setNodeSelected(node);
                  }}
                  variant="ghost"
                  className="flex items-center justify-start gap-2 px-2 py-1 text-sm text-[#ECF0F1] hover:bg-[#2C3E50]"
                >
                  <Pencil size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    const newEdges = edges.filter(
                      (edge) => edge.source !== id && edge.target !== id,
                    );
                    setEdges(newEdges);
                    const newNodes = nodes.filter((node) => node.id !== id);
                    setNodes(newNodes);
                  }}
                  variant="ghost"
                  className="flex items-center justify-start gap-2 px-2 py-1 text-sm text-[#E74C3C] hover:bg-[#2C3E50]"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {!data.isFinal && (
        <Image
          src={
            nodeSelected?.id === id
              ? "/head-node-selected.svg"
              : "/head-node.svg"
          }
          alt="head-node"
          width={40}
          height={40}
          className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-[98%]"
        />
      )}

      <Handle
        type="source"
        id="source1"
        isConnectable={isConnectable}
        position={Position.Bottom}
        style={{
          position: "absolute",
          width: "12px",
          height: "12px",
          borderRadius: "100%",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          border: "2px solid #ECF0F1",
          background: "#3498DB",
        }}
      />
    </Card>
  );
}

export default CustomNode;
