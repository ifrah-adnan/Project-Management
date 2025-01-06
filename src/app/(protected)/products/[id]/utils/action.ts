"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Project, ProjectOperation } from "../page";

const updateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  code: z.string().min(1),
  status: z.boolean(),
});

export async function updateProject(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") === "on";

    const product = await db.project.update({
      where: { id },
      data: { name, code, description, status },
    });

    revalidatePath("/products");
    return { result: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Failed to update product" };
  }
}

export async function updateOperations(
  id: string,
  operations: ProjectOperation[],
): Promise<{ result?: Project; error?: string }> {
  try {
    const product = await db.project.update({
      where: { id },
      data: {
        projectOperations: {
          deleteMany: {},
          create: operations.map((op) => ({
            operation: { connect: { id: op.operation.id } },
            description: op.description,
            time: op.time,
          })),
        },
      },
      include: {
        projectOperations: {
          include: {
            operation: true,
          },
        },
      },
    });

    revalidatePath(`/products/${id}`);
    return { result: product as Project };
  } catch (error) {
    console.error("Error updating operations:", error);
    return { error: "Failed to update operations" };
  }
}

// const updateProjectOperationSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().optional(),
//   time: z.number().min(1),
// });

// export async function updateProjectOperation(id: string, formData: FormData) {
//   const validatedFields = updateProjectOperationSchema.safeParse({
//     name: formData.get("name"),
//     description: formData.get("description"),
//     time: Number(formData.get("time")),
//   });

//   if (!validatedFields.success) {
//     return { error: "Invalid fields" };
//   }

//   const { name, description, time } = validatedFields.data;
//   console.log(
//     `updateProjectOperation: id: ${id}, name: ${name}, description: ${description}, time: ${time}`,
//   );
//   try {
//     await db.projectOperation.update({
//       where: { id },
//       data: { description, time },
//     });

//     return { success: true };
//   } catch (error) {
//     return { error: "Failed to update project operation" };
//   }
// }

const updateProjectOperationSchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  time: z.number().min(1),
});

export async function updateProjectOperation(formData: FormData) {
  const rawData = {
    id: formData.get("id"),
    description: formData.get("description") || null,
    time: Number(formData.get("time")),
  };

  console.log("Raw form data received on server:", rawData);

  const validatedFields = updateProjectOperationSchema.safeParse(rawData);

  console.log("Validation result:", validatedFields);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten(),
    };
  }

  const { id, description, time } = validatedFields.data;
  console.log(
    `updateProjectOperation: id: ${id}, description: ${description}, time: ${time}`,
  );

  try {
    const updatedOperation = await db.projectOperation.update({
      where: { id },
      data: { description, time },
      include: { project: true },
    });

    revalidatePath(`/products/${updatedOperation.project.id}`);

    return { success: true, projectOperation: updatedOperation };
  } catch (error) {
    console.error("Failed to update project operation:", error);
    return { error: "Failed to update project operation" };
  }
}
