import Card from "@/components/card";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Pencil, PencilIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ButtonAddOperation from "../../../buttonAddOperation";
import { useStore } from "../../../../store";
import { v4 as uuidv4 } from "uuid";
import { getOperations } from "@/app/(protected)/projects/workflow/_utils";
import { getOperations2 } from "@/app/(protected)/posts/_utils/actions";
import icons from "../../../icons";

interface Operation {
  id: string;
  name: string;
  code: string;
  icon: string;
  organizationId: string;
}

function AddOperation() {
  const { nodes, setSelectedDragElement } = useStore();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOperations = async () => {
      setIsLoading(true);
      try {
        const fetchedOperations = await getOperations(searchTerm);
        setOperations(fetchedOperations);
        console.log("this is operation ", fetchedOperations);
      } catch (error) {
        console.error("Failed to fetch operations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperations();
  }, [searchTerm]);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    name: string,
  ) => {
    event.dataTransfer.setData("application/reactflow", "nodeAndOr");
    event.dataTransfer.effectAllowed = "move";
    setSelectedDragElement({
      id: uuidv4(),
      name: name,
      type: "nodeAndOr",
    });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = icons[iconName as keyof typeof icons];
    if (IconComponent) {
      return <Pencil size={16} />;
    }
    return <PencilIcon size={16} />;
  };

  return (
    <Card className="z-99 absolute inset-y-4 left-4 flex w-full max-w-80 !cursor-pointer flex-col gap-2 overflow-y-auto">
      <h3>Add Operation</h3>
      <Card
        role="button"
        variant="muted"
        className="flex items-center gap-4 p-2"
      >
        <ButtonAddOperation />
        <span>add new operation</span>
      </Card>
      <div className="flex flex-wrap gap-4 [&>*]:flex-1">
        <Card
          role="button"
          draggable
          variant="muted"
          className="flex items-center justify-between px-4 py-2"
          onDragStart={(e: any) => onDragStart(e, "AND")}
        >
          <span>AND</span>
          <Button variant="ghost" size="icon" className="size-6">
            <ChevronsUpDown size={16} />
          </Button>
        </Card>
        <Card
          draggable
          role="button"
          variant="muted"
          className="flex items-center justify-between px-4 py-2"
          onDragStart={(e: any) => onDragStart(e, "OR")}
        >
          <span>OR</span>
          <Button variant="ghost" size="icon" className="size-6">
            <ChevronsUpDown size={16} />
          </Button>
        </Card>
      </div>
      <div className="mx-auto h-[2px] w-[90%] bg-muted"></div>
      <h3 className="text-gray-400">Operations added</h3>
      <div className="debug flex flex-1 flex-col items-center gap-2 overflow-y-auto">
        {operations.map((operation: Operation) => (
          <Button
            draggable
            key={operation.id}
            onDragStart={(e: any) => onDragStart(e, operation.name)}
            className="flex items-center justify-between px-4 py-2"
          >
            {renderIcon(operation.icon)}
            <span>{operation.name}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default AddOperation;
