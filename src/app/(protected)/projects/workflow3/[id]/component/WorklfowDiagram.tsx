"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { JsonValue } from "@prisma/client/runtime/library";

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

interface Project {
  id: string;
  name: string;
  projectOperations: ProjectOperation[];
  workFlow: {
    WorkflowNode: WorkflowNode[];
    WorkFlowEdge: WorkflowEdge[];
  } | null;
}

interface WorkflowDiagramProps {
  project: any;
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ project }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null,
  );
  const [targetCount, setTargetCount] = useState<number>(1);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const handleEdgeChange = useCallback(
    (edgeId: string, newCount: number) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...edge.data, count: newCount } }
            : edge,
        ),
      );
    },
    [setEdges],
  );

  useEffect(() => {
    if (project.workFlow) {
      const initialNodes: Node[] = project.workFlow.WorkflowNode.map(
        (node: any) => ({
          id: node.id,
          type: "custom",
          data: {
            label: node.data.label,
            operationId: node.operationId,
            time: node.data.time,
          },
          position: node.data.position,
        }),
      );

      const initialEdges: Edge[] = project.workFlow.WorkFlowEdge.map(
        (edge: any) => ({
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
        id: uuidv4(),
        data: {
          count: targetCount,
          onChange: handleEdgeChange,
        },
        type: "custom",
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, targetCount, handleEdgeChange],
  );

  const onInit = (rfi: any) => setReactFlowInstance(rfi);

  const addOperationToFlow = useCallback(() => {
    if (selectedOperation) {
      const operation = project.projectOperations.find(
        (po: any) => po.operation.id === selectedOperation,
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
    const workflowNodes = nodes.map((node) => ({
      id: node.id,
      operationId: node.data.operationId,
      data: {
        label: node.data.label,
        time: node.data.time,
      },
      position: node.position,
    }));

    const workflowEdges = edges.map((edge) => ({
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      count: edge.data.count,
    }));

    try {
      await saveWorkflow(project.id, workflowNodes, workflowEdges);
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
                  {project.projectOperations.map((po: any) => (
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
            <Input
              type="number"
              min="1"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value, 10))}
              placeholder="Target count"
              className="w-32 border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500"
            />
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
                onInit={onInit}
                nodeTypes={{ custom: CustomNode }}
                edgeTypes={{ custom: CustomEdge }}
                fitView
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

export default WorkflowDiagram;
