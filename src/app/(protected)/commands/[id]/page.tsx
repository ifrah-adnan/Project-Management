import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { getCommandProjects } from "../_utils/actions";
import { Table } from "@/components/table";

export default async function CommandDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const command = await getCommandProjects(params.id);

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Command Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Reference:</strong> {command.reference}
          </p>
          <p>
            <strong>Client:</strong>{" "}
            {command.client ? command.client.name : "No client assigned"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Command Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <thead>
              <tr>
                <th>Project</th>
                <th>User</th>
                <th>Target</th>
                <th>Done</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {command.commandProjects.map((cp) => (
                <tr key={cp.id}>
                  <td>{cp.project.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={cp.user.image || ""}
                          alt={cp.user.name}
                        />
                        <AvatarFallback>
                          {cp.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{cp.user.name}</span>
                    </div>
                  </td>
                  <td>{cp.target}</td>
                  <td>{cp.done}</td>
                  <td>
                    {cp.startDate
                      ? format(new Date(cp.startDate), "PP")
                      : "Not set"}
                  </td>
                  <td>{format(new Date(cp.endDate), "PP")}</td>
                  <td>{cp.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
