"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  Building,
  Trash2Icon,
  PencilIcon,
  Search,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { EditOrganizationButton } from "@/app/(protected)/organizations/_component/edit-organization-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AddAdminToOrganization,
  deleteOrganization,
} from "@/app/(protected)/organizations/_utils/action";
import { deleteById } from "../../_utils/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormInput from "@/components/form-input";
import {
  TCreateAdmin,
  createAdminOrganization,
} from "@/app/(protected)/organizations/_utils/schema";
import { FieldErrors } from "@/actions/utils";
import { toast } from "sonner";
import { ViewAllAdminsDialog } from "@/app/(protected)/organizations/_component/View-all-Admin";

type TDataO = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  users: { id: string; name: string; email: string }[];
};

export function AdminComponent({
  data,
  total,
}: {
  data: TDataO[];
  total: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<
    FieldErrors<TCreateAdmin>
  >({});
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const openDialog = (orgId: string) => {
    setOpenDialogs((prev) => ({ ...prev, [orgId]: true }));
  };

  const closeDialog = (orgId: string) => {
    setOpenDialogs((prev) => ({ ...prev, [orgId]: false }));
  };

  const handleAddAdmin = async (formData: FormData, orgId: string) => {
    const data = {
      adminName: formData.get("adminName") as string,
      adminEmail: formData.get("adminEmail") as string,
      adminPassword: formData.get("adminPassword") as string,
      organizationId: orgId,
    };
    const parsed = createAdminOrganization.safeParse(data);

    if (!parsed.success) {
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors<TCreateAdmin>,
      );
      return;
    }
    try {
      await AddAdminToOrganization(data);
      toast.success("Organization and admin created successfully");
      closeDialog(orgId);
    } catch (error) {
      console.error("Error creating organization and admin:", error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredData = data.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search organizations..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          size={20}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((org) => (
          <Card
            key={org.id}
            className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <CardContent className="flex-grow p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="space-x- flex items-center">
                  <Building size={24} className="text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {org.name}
                  </h3>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-500">
                  <Users size={14} className="mr-1 inline" />
                  {org.users.length}
                </span>
                {org.users.length >= 1 && (
                  <ViewAllAdminsDialog
                    admins={org.users}
                    organizationName={org.name}
                  />
                )}{" "}
                <Dialog
                  open={openDialogs[org.id] || false}
                  onOpenChange={(open) =>
                    open ? openDialog(org.id) : closeDialog(org.id)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <PlusCircle className="h-5 w-5 text-blue-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        Add new Admin for this organization {org.name}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the email of the user you want to add as an admin.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        await handleAddAdmin(formData, org.id);
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <input
                          type="hidden"
                          name="organizationId"
                          value={org.id}
                        />

                        <div className="flex flex-1 flex-col gap-2 py-4 ">
                          <FormInput
                            name="adminName"
                            label="Admin Name *"
                            className="mt-4"
                            required
                          />
                          <FormInput
                            name="adminEmail"
                            label="Admin Email *"
                            type="email"
                            className="mt-4"
                            required
                          />
                          <FormInput
                            name="adminPassword"
                            label="Admin Password *"
                            type="password"
                            className="mt-4"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Admin</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="mb-4 text-sm text-gray-600">{org.description}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar size={18} />
                <span>
                  Created on {new Date(org.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 bg-gray-50 p-4">
              <Link
                href={`/projects?organizationId=${org.id}`}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                View Details
              </Link>
              <Popover>
                <PopoverTrigger>
                  <Button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300">
                    Manage
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48">
                  <div className="flex flex-col space-y-2">
                    <EditOrganizationButton
                      organization={org}
                      variant="ghost"
                      className="justify-start text-left text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <PencilIcon size={16} className="mr-2" />
                      <span>Edit</span>
                    </EditOrganizationButton>
                    <ConfirmButton
                      variant="ghost"
                      className="justify-start text-left text-gray-700 hover:bg-gray-100 hover:text-red-600"
                      action={async () => {
                        await deleteOrganization(org.id);
                        await deleteById(org.users[0].id);
                      }}
                    >
                      <Trash2Icon size={16} className="mr-2" />
                      <span>Delete</span>
                    </ConfirmButton>
                  </div>
                </PopoverContent>
              </Popover>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
