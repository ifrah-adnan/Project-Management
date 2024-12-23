"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useSession } from "@/components/session-provider";
import { updateOrganization, updateUser } from "../../action/utils";

const userSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  logo: z.instanceof(File).optional(),
});

export default function SettingsForm() {
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: session?.user?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const orgForm = useForm({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: session?.user?.organization?.name || "",
      logo: undefined,
    },
  });

  const onUserSubmit = async (data: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("currentPassword", data.currentPassword);
    if (data.newPassword) {
      formData.append("newPassword", data.newPassword);
    }

    const result = await updateUser(session.user.id, formData);

    // if (result.error) {
    //   toast({
    //     title: "Error",
    //     description: result.error,
    //     variant: "destructive",
    //   });
    // } else {
    //   toast({
    //     title: "Settings updated",
    //     description: "Your user settings have been updated successfully.",
    //   });
    // }
    setIsSubmitting(false);
  };

  const onOrgSubmit = async (data: z.infer<typeof organizationSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const orgId = session.user?.organization?.id;
    if (!orgId) {
      //   toast({
      //     title: "Error",
      //     description: "Organization ID not found. Please contact support.",
      //     variant: "destructive",
      //   });
      setIsSubmitting(false);
      return;
    }
    const result = await updateOrganization(orgId, formData);

    if (result.error) {
      //   toast({
      //     title: "Error",
      //     description: result.error,
      //     variant: "destructive",
      //   });
    } else {
      //   toast({
      //     title: "Organization updated",
      //     description:
      //       "Your organization settings have been updated successfully.",
      //   });
    }
    setIsSubmitting(false);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //   orgForm.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tabs defaultValue="user" className="w-full">
      <TabsList>
        <TabsTrigger value="user">User Settings</TabsTrigger>
        {session?.user?.role === "ADMIN" && (
          <TabsTrigger value="organization">Organization Settings</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="user">
        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>
              Update your personal information and password
            </CardDescription>
          </CardHeader>
          <form onSubmit={userForm.handleSubmit(onUserSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...userForm.register("name")} />
                {userForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...userForm.register("currentPassword")}
                />
                {userForm.formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...userForm.register("newPassword")}
                />
                {userForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...userForm.register("confirmPassword")}
                />
                {userForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {userForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update User Settings"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      {session?.user?.role === "ADMIN" && (
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Update your organization&apos;s information and logo
              </CardDescription>
            </CardHeader>
            <form onSubmit={orgForm.handleSubmit(onOrgSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" {...orgForm.register("name")} />
                  {orgForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {orgForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Organization Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  {logoPreview && (
                    <div className="mt-2">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-32 w-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Organization"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
