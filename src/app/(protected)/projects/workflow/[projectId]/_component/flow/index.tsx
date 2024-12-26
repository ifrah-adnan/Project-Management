"use client";
import React, { useCallback, useEffect, useRef } from "react";
import { useStore } from "../../store";
import "reactflow/dist/style.css";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  updateEdge,
} from "reactflow";
import AddOperation from "./operation/add";
import CustomNode from "./CustomNode";
import { NodeTypes } from "@/utils/types";
import CustomEdge from "./customEdge";
import { v4 as uuidv4 } from "uuid";
import EditOperation from "./operation/edit";
import CustomAndOr from "./NodeAndOr";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { getProjectOperations, getWorkFlow } from "../../../_utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const onDragOver = (event: any) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
};

const NodeType = {
  customNode: CustomNode,
  nodeAndOr: CustomAndOr,
};
const EdgeType = {
  customEdge: CustomEdge,
};

function Flow() {
  const { projectId } = useParams();
  const { nodes, edges, setNodes, setEdges, nodeSelected } = useStore();
  const reactFlowWrapper = useRef(null);
  const edgeUpdateSuccessful = useRef(true);

  const { data: projectOperations, error: projectOperationsError } = useSWR(
    `project-operations/${projectId}`,
    () => getProjectOperations(projectId as string),
  );
  console.log("ttttttttt", projectOperations);

  const { data: workflowData, error: workflowError } = useSWR(
    `workflow/data/${projectId}`,
    () => getWorkFlow(projectId as string),
  );

  useEffect(() => {
    if (projectOperations && workflowData) {
      const operationNodes = projectOperations.map(
        (operation: any, index: number) => ({
          id: operation.id,
          type: "customNode",
          position: { x: index * 200, y: 100 },
          data: {
            name: operation.name,
            icon: operation.icon,
            description: operation.description,
            // estimatedTime: operation.time.toString(),
            isFinal: operation.isFinal,
            operationId: operation.id,
          },
        }),
      );

      setNodes(operationNodes);

      if (workflowData.workFlow && workflowData.workFlow.WorkFlowEdge) {
        const workflowEdges = workflowData.workFlow.WorkFlowEdge.map(
          (edge: any) => ({
            id: edge.id,
            source: edge.sourceId,
            target: edge.targetId,
            type: "customEdge",
            label: edge.data.label,
          }),
        );
        setEdges(workflowEdges);
      } else {
        setEdges([]);
      }
    }
  }, [projectOperations, workflowData, setNodes, setEdges]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes(applyNodeChanges(changes, nodes) as NodeTypes[]),
    [nodes, setNodes],
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges(applyEdgeChanges(changes, edges)),
    [edges, setEdges],
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: any, newConnection: any) =>
      setEdges(updateEdge(oldEdge, newConnection, edges)),
    [edges, setEdges],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  // const onConnect = useCallback(
  //   (params: any) => {
  //     const newEdge = {
  //       id: uuidv4(),
  //       source: params.source,
  //       target: params.target,
  //       type: "customEdge",
  //       label: "",
  //     };
  //     setEdges((eds) => [...eds, newEdge]);
  //   },
  //   [setEdges],
  // );

  // const onEdgeUpdateEnd = useCallback(
  //   (_: any, edge: Edge) => {
  //     if (!edgeUpdateSuccessful.current) {
  //       setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  //     }
  //     edgeUpdateSuccessful.current = true;
  //   },
  //   [setEdges],
  // );

  if (projectOperationsError || workflowError) {
    return <div>Error loading workflow data</div>;
  }

  const isLoading = !projectOperations || !workflowData;

  return (
    <main className="relative h-[calc(100%-3.5rem)] w-full">
      {isLoading && (
        <div className="absolute left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-black/20">
          <Loader2 size={40} className="animate-spin" />
        </div>
      )}
      <ReactFlow
        ref={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        className="h-full w-full"
        nodeTypes={NodeType}
        edgeTypes={EdgeType}
        minZoom={0.5}
        maxZoom={1.5}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        // onConnect={onConnect}
        onDragOver={onDragOver as any}
        // onEdgeUpdateEnd={onEdgeUpdateEnd}
        onEdgeUpdateStart={onEdgeUpdateStart}
      >
        <Background color="#7a7676" gap={10} variant={BackgroundVariant.Dots} />
      </ReactFlow>
      <AddOperation />
      {nodeSelected && <EditOperation />}
    </main>
  );
}

export default Flow;
