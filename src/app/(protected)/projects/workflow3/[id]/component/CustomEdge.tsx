import React, { useState, useCallback } from "react";
import { EdgeProps, getBezierPath, useReactFlow } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [localCount, setLocalCount] = useState(data?.count || 0);

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCount = parseInt(e.target.value, 10);
      if (!isNaN(newCount) && newCount >= 0) {
        setLocalCount(newCount);
      }
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              count: localCount,
            },
          };
        }
        return edge;
      }),
    );
    setIsEditing(false);
  }, [id, localCount, setEdges]);

  const handleCancel = useCallback(() => {
    setLocalCount(data?.count || 0);
    setIsEditing(false);
  }, [data?.count]);

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
      if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSubmit, handleCancel],
  );

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={160}
        height={40}
        x={labelX - 80}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          className="flex h-full items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <div
              className="flex items-center gap-2 rounded-md bg-white p-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                type="number"
                min="0"
                value={localCount}
                onChange={handleCountChange}
                onKeyDown={handleKeyPress}
                className="h-8 w-20 text-center text-sm"
                autoFocus
              />
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleSubmit}
                  className="h-8 w-8 p-1"
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 p-1"
                >
                  ✕
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-md bg-white p-2 shadow-md hover:bg-gray-50"
              role="button"
              onClick={startEditing}
            >
              <span className="min-w-[2rem] text-center text-sm font-medium">
                {data?.count || 0}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={startEditing}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
