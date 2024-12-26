"use client";

import React, { useState, useCallback, useEffect } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveWorkflow } from "@/app/(protected)/products/_utils/actions";
import { v4 as uuidv4 } from "uuid";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus, Save } from "lucide-react";
import { motion } from "framer-motion";

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
  data: any;
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
  project: Project;
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({ project }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null,
  );
  const [targetCount, setTargetCount] = useState<number>(1);

  useEffect(() => {
    if (project.workFlow) {
      const initialNodes: Node[] = project.workFlow.WorkflowNode.map(
        (node) => ({
          id: node.id,
          type: "custom",
          data: {
            label: node.operation.name,
            operationId: node.operationId,
            time:
              project.projectOperations.find(
                (po) => po.operation.id === node.operationId,
              )?.time || 0,
          },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
        }),
      );

      const initialEdges: Edge[] = project.workFlow.WorkFlowEdge.map(
        (edge) => ({
          id: edge.id,
          source: edge.sourceId,
          target: edge.targetId,
          data: { label: `${edge.count} fois` },
          type: "custom",
        }),
      );

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [project.workFlow, project.projectOperations, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        id: uuidv4(),
        data: { label: `${targetCount} fois` },
        type: "custom",
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, targetCount],
  );

  const addOperationToFlow = useCallback(() => {
    if (selectedOperation) {
      const operation = project.projectOperations.find(
        (po) => po.operation.id === selectedOperation,
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
          position: { x: Math.random() * 500, y: Math.random() * 500 },
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
    }));

    const workflowEdges = edges.map((edge) => ({
      id: edge.id,
      sourceId: edge.source,
      targetId: edge.target,
      count: parseInt(edge.data?.label?.split(" ")[0] || "1", 10),
    }));

    try {
      await saveWorkflow(project.id, workflowNodes, workflowEdges);
      alert("Workflow enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du workflow:", error);
      alert("Échec de l'enregistrement du workflow. Veuillez réessayer.");
    }
  }, [nodes, edges, project.id]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Workflow Diagram
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-grow">
              <Select
                value={selectedOperation || ""}
                onValueChange={(value) => setSelectedOperation(value)}
              >
                <SelectTrigger className="w-full border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500">
                  <SelectValue placeholder="Sélectionner une opération" />
                </SelectTrigger>
                <SelectContent>
                  {project.projectOperations.map((po) => (
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
                Ajouter l opération
              </Button>
            </motion.div>
            <Input
              type="number"
              min="1"
              value={targetCount}
              onChange={(e) => setTargetCount(parseInt(e.target.value, 10))}
              placeholder="Nombre cible"
              className="w-32 border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={saveCurrentWorkflow}
                className="bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-[600px] overflow-hidden shadow-xl">
        <CardContent className="h-full p-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={{ custom: CustomNode }}
            edgeTypes={{ custom: CustomEdge }}
            fitView
          >
            <Background color="#f0f0f0" />
            <Controls />
            <MiniMap style={{ height: 120 }} zoomable pannable />
          </ReactFlow>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDiagram;
