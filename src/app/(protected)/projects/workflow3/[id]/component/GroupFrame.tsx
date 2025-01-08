import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface GroupFrameProps extends NodeProps {
  data: {
    label: string;
    color: string;
  };
}

const GroupFrame: React.FC<GroupFrameProps> = ({ data }) => {
  return (
    <div
      style={{
        background: data.color,
        borderRadius: "8px",
        padding: "16px",
        minWidth: "200px",
        minHeight: "100px",
      }}
    >
      <div className="mb-2 text-lg font-bold">{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(GroupFrame);
