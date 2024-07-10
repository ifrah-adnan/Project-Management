import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Building } from "lucide-react";
import Link from "next/link";

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
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((org) => (
        <Card
          key={org.id}
          className="w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          <CardContent className="p-6">
            <div className="mb-2 flex items-center space-x-2">
              <Building size={24} />
              <h3 className="text-xl font-bold">{org.name}</h3>
            </div>
            <p className="mb-4 text-sm">{org.description}</p>
            <div className="mb-2 flex items-center space-x-2 text-sm">
              <Users size={18} />
              <span>{org.users.length} Admins</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar size={18} />
              <span>
                Created on {new Date(org.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-black bg-opacity-20 p-6">
            <Link
              href={`/projects?organizationId?=${org.id}`}
              className="rounded bg-white px-4 py-2 text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
            >
              View Details
            </Link>
            <Button className="rounded bg-white px-4 py-2 text-purple-600 transition-colors hover:bg-purple-600 hover:text-white">
              Manage
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
