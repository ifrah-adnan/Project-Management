"use client";
import { TCreateInput, TData, TExpertise } from "../../_utils/schemas";
import { Table } from "@/components/table";
import { Card } from "@/components/ui/card";
import { ConfirmButton } from "@/components/confirm-button";
import { deleteById, handleDelete } from "../../_utils/actions";
import { CalendarIcon, Ellipsis, PencilIcon, Trash2Icon } from "lucide-react";
import { revalidatePath } from "next/cache";
import ParamsPagination from "@/components/params-pagination";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EditPostButton } from "../edit-post-button";
import UpdatePojectCount from "../update-project-count";
import { useSession } from "@/components/session-provider";
import { useEffect, useState } from "react";
import { getServerSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function List({
  data,
  total,
  searchTerm,
}: {
  data: TData;
  total: number;
  searchTerm: string;
}) {
  const { session } = useSession();
  const user = session?.user;
  const [filteredData, setFilteredData] = useState<TData>([]);
  const [organizationId, setOrganizationId] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrganizationImage = async () => {
      const serverSession = await getServerSession();
      const orgId =
        serverSession?.user.organizationId ||
        serverSession?.user.organization?.id;
      setOrganizationId(orgId);
    };

    fetchOrganizationImage();
  }, []);

  useEffect(() => {
    if (organizationId && data.length > 0) {
      let filtered = data.filter(
        (item) => item.organizationId === organizationId,
      );
      if (searchTerm) {
        filtered = filtered.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      setFilteredData(filtered);
    }
  }, [organizationId, data, searchTerm]);

  const handlePlanningClick = (postId: string) => {
    router.push(`/planning?postId=${postId}`);
  };

  return (
    <main className="p-2 sm:p-4 md:p-6">
      <Card className="mx-auto flex h-full w-full max-w-screen-2xl flex-1 flex-col overflow-auto p-2 sm:p-4">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[1000px] text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="p-2 sm:p-3">Name</th>
                <th className="p-2 sm:p-3">Expertises</th>
                <th className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span>Planning</span>
                    <span className="text-xs font-medium text-gray-500">
                      {"(Operator / Project / Operation / Date)"}
                    </span>
                  </div>
                </th>
                <th className="p-2 sm:p-3">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const post = {
                  id: item.id,
                  name: item.name,
                  expertises: item.expertises,
                };

                return (
                  <tr key={item.id}>
                    <td className="p-2 sm:p-3">{item.name}</td>
                    <td className="p-2 sm:p-3">
                      {item.expertises.length > 0 ? (
                        <div className="max-w-[8rem] truncate sm:max-w-[15rem]">
                          {item.expertises.map((e) => e.name).join(", ")}
                        </div>
                      ) : (
                        <span className="text-gray-500">No expertises</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {(user.role === "ADMIN" ||
                          user.role === "SYS_ADMIN") && (
                          <Button
                            onClick={() => handlePlanningClick(item.id)}
                            className="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-md transition-colors duration-300 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            <span className="text-sm font-medium">
                              See Planning
                            </span>
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <span className="text-xs sm:text-sm">
                          {format(new Date(item.createdAt), "PP")}
                        </span>
                        {(user.role === "ADMIN" ||
                          user.role === "SYS_ADMIN") && (
                          <Popover>
                            <PopoverTrigger>
                              <Ellipsis size={16} />
                            </PopoverTrigger>
                            <PopoverContent
                              align="end"
                              className="flex w-fit flex-col gap-1 sm:gap-2"
                            >
                              <EditPostButton
                                post={post}
                                variant="ghost"
                                className="justify-start gap-1 px-3 text-xs hover:text-sky-500 sm:gap-2 sm:px-6 sm:text-sm"
                              >
                                <PencilIcon size={16} />
                                <span>Edit</span>
                              </EditPostButton>

                              <ConfirmButton
                                variant="ghost"
                                size="icon"
                                className="flex w-full justify-start gap-1 rounded-md px-3 text-xs hover:text-red-500 sm:gap-2 sm:px-6 sm:text-sm"
                                action={async () => {
                                  await handleDelete(item.id, session.user.id);
                                }}
                              >
                                <Trash2Icon size={16} />
                                <span>Delete</span>
                              </ConfirmButton>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        {data.length === 0 && (
          <div className="grid flex-1 place-content-center">
            <span className="text-center text-xl font-semibold opacity-50 sm:text-2xl md:text-3xl">
              No Data
            </span>
          </div>
        )}
        <div className="mt-auto flex justify-end px-2 pb-2 pt-1 sm:px-4 sm:pb-4">
          <ParamsPagination total={total} />
        </div>
      </Card>
    </main>
  );
}
