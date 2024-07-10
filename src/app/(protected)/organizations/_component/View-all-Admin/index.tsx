import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface ViewAllAdminsDialogProps {
  admins: Admin[];
  organizationName: string;
}

export function ViewAllAdminsDialog({
  admins,
  organizationName,
}: ViewAllAdminsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-blue-500">
          View All ({admins.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Administrators of {organizationName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] rounded-md border p-4">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="mb-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{admin.name}</p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
              {/* Vous pouvez ajouter des actions ici si nécessaire */}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
