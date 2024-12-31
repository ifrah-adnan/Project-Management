import React from "react";
import { Badge } from "@/components/ui/badge";
import { TUpdateInput } from "../../_utils/schemas";

interface ProductCodeProps {
  product: TUpdateInput;
}

export default function ProductCode({ product }: ProductCodeProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Product Code:</span>
        <Badge variant="secondary">{product.code}</Badge>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Associated Operations:</h3>
        <ul className="list-inside list-disc space-y-2">
          {product.operations.map((op) => (
            <li key={op.id}>
              {op.description || "Unnamed Operation"} - {op.time} minutes
            </li>
          ))}
        </ul>
      </div>
      {/* Add more code-related information here if needed */}
    </div>
  );
}
