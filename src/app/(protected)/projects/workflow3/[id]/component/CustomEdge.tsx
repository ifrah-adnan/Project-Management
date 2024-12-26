import React, { useState, useCallback } from "react";
import { EdgeProps, getBezierPath } from "reactflow";
import { Input } from "@/components/ui/input";

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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [count, setCount] = useState(data?.count || 1);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsEditing(true);
  }, []);

  const handleCountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newCount = parseInt(e.target.value, 10);
      if (!isNaN(newCount) && newCount > 0) {
        setCount(newCount);
        data.onChange(id, newCount);
      }
    },
    [id, data],
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: "url(#edge-gradient)",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {isEditing ? (
        <foreignObject
          width={40}
          height={40}
          x={(sourceX + targetX) / 2 - 20}
          y={(sourceY + targetY) / 2 - 20}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <Input
            type="number"
            min="1"
            value={count}
            onChange={handleCountChange}
            onBlur={handleBlur}
            className="nodrag h-full w-full text-center"
            autoFocus
          />
        </foreignObject>
      ) : (
        <text>
          <textPath
            href={`#${id}`}
            style={{ fontSize: 12, fill: "#888", cursor: "pointer" }}
            startOffset="50%"
            textAnchor="middle"
            onDoubleClick={handleDoubleClick}
          >
            {`${count} count`}
          </textPath>
        </text>
      )}
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </>
  );
};

export default CustomEdge;
