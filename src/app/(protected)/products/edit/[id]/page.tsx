import React from "react";
import { getOperations } from "../../../expertise/_utils/actions";
import EditProductForm from "../component/edit-product-form";
import { getProductById } from "../../_utils/actions";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const operations = await getOperations();
  const product = await getProductById(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }
  console.log(product);
  console.log("operations", operations);
  console.log(operations);

  return (
    <main className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
      <EditProductForm product={product} operations={operations} />
    </main>
  );
}
