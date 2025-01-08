import React, { useState, useEffect } from "react";
import { NodeResizer } from "reactflow";
import { X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GroupNodeData {
  color: string;
  note: string;
  nodeIds: string[];
  onChange: (data: any) => void;
}

export const GroupNode = ({
  data,
  selected,
}: {
  data: GroupNodeData;
  selected: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(data.note || "");

  // Ensure changes are propagated while preserving nodeIds
  const handleNoteChange = (newNote: string) => {
    const updatedData = {
      ...data,
      note: newNote,
      nodeIds: data.nodeIds || [], // Preserve nodeIds
    };
    data.onChange(updatedData);
  };

  // Update local note state when data changes
  useEffect(() => {
    setNote(data.note || "");
  }, [data.note]);

  return (
    <div className="group-node">
      <NodeResizer isVisible={selected} minWidth={200} minHeight={200} />
      <div
        className="group-background"
        style={{
          backgroundColor: `${data.color}10`,
          borderColor: data.color,
          width: "100%",
          height: "100%",
          borderWidth: "2px",
          borderStyle: "dashed",
          borderRadius: "0.5rem",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      <div
        className="group-content"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <div
          className="absolute -top-8 left-0 flex items-center gap-2"
          style={{
            pointerEvents: "all",
            zIndex: 10,
          }}
        >
          {isEditing ? (
            <div className="flex items-center gap-2 rounded-md bg-white shadow-sm">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-8 w-48"
                placeholder="Add note..."
                onBlur={() => {
                  handleNoteChange(note);
                  setIsEditing(false);
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex cursor-pointer items-center gap-2 rounded bg-white px-2 py-1 text-sm shadow-sm"
              onClick={() => setIsEditing(true)}
            >
              {note || "Add note..."}
              <Edit2 className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
