"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  SelectionMode,
  NodeResizer,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { saveWorkflow } from "@/app/(protected)/products/_utils/actions";
import { v4 as uuidv4 } from "uuid";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus, Save, Camera } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { GroupNode } from "./GroupNode";

interface Operation {
  id: string;
  name: string;
}

interface ProjectOperation {
  operation: Operation;
  time: number;
}

interface WorkflowNode {
  id: string;
  operationId: string;
  data: {
    label: string;
    time: number;
    position: { x: number; y: number };
  };
  operation: Operation;
}

interface WorkflowEdge {
  id: string;
  sourceId: string;
  targetId: string;
  count: number;
}

interface WorkflowGroup {
  id: string;
  nodeIds: string[];
  color: string;
  note: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
}

interface Project {
  id: string;
  name: string;
  projectOperations: ProjectOperation[];
  workFlow: {
    WorkflowNode: WorkflowNode[];
    WorkFlowEdge: WorkflowEdge[];
    WorkflowGroup?: WorkflowGroup[];
  } | null;
}

interface WorkflowDiagramProps {
  project: any;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  project,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null,
  );
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [groupColor, setGroupColor] = useState("#6366F1");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const colors = [
    { value: "#6366F1", label: "Indigo" },
    { value: "#10B981", label: "Emerald" },
    { value: "#EC4899", label: "Pink" },
    { value: "#F59E0B", label: "Amber" },
    { value: "#6B7280", label: "Gray" },
  ];

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
      group: GroupNode,
    }),
    [],
  );

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [],
  );

  const handleEdgeChange = useCallback(
    (edgeId: string, newCount: number, newTarget: string) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? {
                ...edge,
                target: newTarget,
                data: { ...edge.data, count: newCount },
              }
            : edge,
        ),
      );
    },
    [setEdges],
  );
  useEffect(() => {
    if (project.workFlow) {
      // Initialize nodes
      const initialNodes: Node[] = [
        ...project.workFlow.WorkflowNode.map((node: WorkflowNode) => ({
          id: node.id,
          type: "custom",
          data: {
            label: node.data.label,
            operationId: node.operationId,
            time: node.data.time,
          },
          position: node.data.position,
        })),
        ...(project.workFlow.WorkflowGroup || []).map(
          (group: WorkflowGroup) => ({
            id: group.id,
            type: "group",
            position: group.position,
            style: {
              width: group.dimensions.width,
              height: group.dimensions.height,
            },
            data: {
              color: group.color,
              note: group.note,
              nodeIds: group.nodeIds,
              onChange: (newData: any) => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === group.id ? { ...node, data: newData } : node,
                  ),
                );
              },
            },
          }),
        ),
      ];
      const initialEdges: Edge[] = project.workFlow.WorkFlowEdge.map(
        (edge: WorkflowEdge) => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          data: {
            count: edge.count,
            onChange: handleEdgeChange,
          },
          type: "custom",
        }),
      );

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [project.workFlow, setNodes, setEdges, handleEdgeChange]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        type: "custom",
        data: {
          count: 0,
          onChange: handleEdgeChange,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, handleEdgeChange],
  );

  // const createGroup = useCallback(() => {
  //   if (selectedNodes.length < 2) return;

  //   const nodePositions = selectedNodes.map((id) => {
  //     const node = nodes.find((n) => n.id === id);
  //     return node?.position;
  //   });

  //   const minX = Math.min(...nodePositions.map((pos) => pos?.x || 0));
  //   const minY = Math.min(...nodePositions.map((pos) => pos?.y || 0));
  //   const maxX = Math.max(...nodePositions.map((pos) => (pos?.x || 0) + 200));
  //   const maxY = Math.max(...nodePositions.map((pos) => (pos?.y || 0) + 100));

  //   const groupNode = {
  //     id: `group-${uuidv4()}`,
  //     type: "group",
  //     position: { x: minX - 20, y: minY - 40 },
  //     style: { width: maxX - minX + 40, height: maxY - minY + 80 },
  //     data: {
  //       color: groupColor,
  //       note: "",
  //       nodeIds: selectedNodes,
  //       onChange: (newData: any) => {
  //         setNodes((nds) =>
  //           nds.map((node) =>
  //             node.id === groupNode.id ? { ...node, data: newData } : node,
  //           ),
  //         );
  //       },
  //     },
  //   };

  //   setNodes((nds) => [...nds, groupNode]);
  // }, [selectedNodes, nodes, groupColor, setNodes]);
  const createGroup = useCallback(() => {
    if (selectedNodes.length < 2) return;

    const nodePositions = selectedNodes.map((id) => {
      const node = nodes.find((n) => n.id === id);
      return node?.position;
    });

    const minX = Math.min(...nodePositions.map((pos) => pos?.x || 0));
    const minY = Math.min(...nodePositions.map((pos) => pos?.y || 0));
    const maxX = Math.max(...nodePositions.map((pos) => (pos?.x || 0) + 200));
    const maxY = Math.max(...nodePositions.map((pos) => (pos?.y || 0) + 100));

    const groupNode = {
      id: `group-${uuidv4()}`,
      type: "group",
      position: { x: minX - 20, y: minY - 40 },
      style: {
        width: maxX - minX + 40,
        height: maxY - minY + 80,
      },
      data: {
        color: groupColor,
        note: "",
        nodeIds: selectedNodes, // Important: Initialize nodeIds with selected nodes
        onChange: (newData: any) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === groupNode.id
                ? {
                    ...node,
                    data: {
                      ...newData,
                      nodeIds: selectedNodes, // Preserve nodeIds during updates
                    },
                  }
                : node,
            ),
          );
        },
      },
    };

    console.log("Creating new group with nodeIds:", selectedNodes);
    setNodes((nds) => [...nds, groupNode]);
  }, [selectedNodes, nodes, groupColor, setNodes]);
  const onSelectionChange = useCallback((params: any) => {
    setSelectedNodes(params.nodes.map((node: any) => node.id));
  }, []);

  const addOperationToFlow = useCallback(() => {
    if (selectedOperation) {
      const operation = project.projectOperations.find(
        (po: ProjectOperation) => po.operation.id === selectedOperation,
      );
      if (operation) {
        const newNode: Node = {
          id: uuidv4(),
          type: "custom",
          data: {
            label: operation.operation.name,
            operationId: operation.operation.id,
            time: operation.time,
          },
          position: { x: Math.random() * 300, y: Math.random() * 300 },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    }
  }, [selectedOperation, project.projectOperations, setNodes]);

  const saveCurrentWorkflow = useCallback(async () => {
    // Extract standard nodes (excluding groups)
    const workflowNodes = nodes
      .filter((node) => node.type === "custom")
      .map((node) => ({
        id: node.id,
        operationId: node.data.operationId,
        data: {
          label: node.data.label,
          time: node.data.time,
          position: node.position,
        },
      }));

    // Extract groups with all required information
    const workflowGroups = nodes
      .filter((node) => node.type === "group")
      .map((node) => {
        console.log("Processing group node:", node); // Debug log
        return {
          id: node.id,
          nodeIds: node.data.nodeIds || [], // Ensure nodeIds is extracted
          color: node.data.color || "#6366F1", // Default color if not set
          note: node.data.note || "",
          position: {
            x: node.position.x,
            y: node.position.y,
          },
          dimensions: {
            width: node.style?.width || 200, // Default width if not set
            height: node.style?.height || 100, // Default height if not set
          },
        };
      });

    // Debug logs
    console.log("Groups to save:", workflowGroups);

    // Extract edges
    const workflowEdges = edges.map((edge) => ({
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      count: edge.data?.count || 0,
    }));

    try {
      const result = await saveWorkflow(
        project.id,
        workflowNodes,
        workflowEdges,
        workflowGroups, // Make sure this is passed
      );
      console.log("Workflow saved with groups:", result); // Debug log
      toast.success("Workflow saved successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error saving workflow:", error);
      toast.error("Failed to save workflow. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  }, [nodes, edges, project.id]);
  const takeScreenshot = useCallback(() => {
    if (reactFlowWrapper.current) {
      html2canvas(reactFlowWrapper.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${project.name}-workflow.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  }, [project.name]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        setNodes((nodes) => nodes.filter((node) => !node.selected));
        setEdges((edges) => edges.filter((edge) => !edge.selected));
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [setNodes, setEdges]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-grow">
              <Select
                value={selectedOperation || ""}
                onValueChange={(value) => setSelectedOperation(value)}
              >
                <SelectTrigger className="w-full border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Select an operation" />
                </SelectTrigger>
                <SelectContent>
                  {project.projectOperations.map((po: ProjectOperation) => (
                    <SelectItem key={po.operation.id} value={po.operation.id}>
                      <div className="flex w-full items-center justify-between">
                        <span className="font-medium">{po.operation.name}</span>
                        <span className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4" />
                          {po.time} min
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={addOperationToFlow}
                disabled={!selectedOperation}
                className="bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Operation
              </Button>
            </motion.div>

            {selectedNodes.length >= 2 && (
              <div className="flex items-center gap-2">
                <Select value={groupColor} onValueChange={setGroupColor}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={createGroup}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Group Selected
                </Button>
              </div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={saveCurrentWorkflow}
                className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={takeScreenshot}
                className="bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
              >
                <Camera className="mr-2 h-4 w-4" />
                Screenshot
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto h-[600px] w-full max-w-[1400px] overflow-hidden shadow-xl">
        <CardContent className="h-full p-0">
          <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                selectionMode={SelectionMode.Full}
                panOnDrag={[1, 2]}
                selectionOnDrag={true}
                connectionMode={ConnectionMode.Loose}
                deleteKeyCode={"Delete"}
                selectionKeyCode={"Shift"}
              >
                <Background color="#f0f0f0" />
                <Controls />
                <MiniMap style={{ height: 100 }} zoomable pannable />
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </CardContent>
      </Card>
    </div>
  );
};
