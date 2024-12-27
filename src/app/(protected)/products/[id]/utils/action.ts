"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  code: z.string().min(1),
  status: z.boolean(),
});

export async function updateProject(id: string, formData: FormData) {
  const validatedFields = updateProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    code: formData.get("code"),
    status: formData.get("status") === "on",
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, description, code, status } = validatedFields.data;

  try {
    await db.project.update({
      where: { id },
      data: { name, description, code, status },
    });

    revalidatePath(`/products/${id}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update project" };
  }
}
