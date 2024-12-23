"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { hash, compare } from "bcrypt";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .optional(),
});

export async function updateUser(userId: string, formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get("name"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, currentPassword, newPassword } = validatedFields.data;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "User not found" };
  }

  const passwordMatch = await compare(currentPassword, user.password);
  if (!passwordMatch) {
    return { error: "Current password is incorrect" };
  }

  const updateData: { name: string; password?: string } = { name };

  if (newPassword) {
    updateData.password = await hash(newPassword, 10);
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update user" };
  }
}

export async function updateOrganization(orgId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const logo = formData.get("logo") as File;

  if (!name) {
    return { error: "Organization name is required" };
  }

  try {
    const updateData: { name: string; imagePath?: string } = { name };

    if (logo && logo.size > 0) {
      // Here you would typically upload the logo to a file storage service
      // and get back a URL to store in the database
      // For this example, we'll just pretend we have a URL
      updateData.imagePath = `/uploads/${logo.name}`;
    }

    await db.organization.update({
      where: { id: orgId },
      data: updateData,
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update organization" };
  }
}
