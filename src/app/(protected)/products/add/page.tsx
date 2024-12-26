import React from "react";
import { getOperations } from "../../expertise/_utils/actions";
import AddProductForm from "./component/add-product-form";

export default async function AddProductPage() {
  const operations = await getOperations();

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>
      <AddProductForm operations={operations} />
    </main>
  );
}
