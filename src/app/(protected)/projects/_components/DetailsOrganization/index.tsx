import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getOrganizationDetails } from "../../_utils/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  FileText,
  Briefcase,
  Terminal,
  Cpu,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrganizationDetails {
  id: string;
  name: string;
  description: string | null;
  imagePath: string | null;
  address: string | null;
  createdAt: Date;
  userCount: number;
  postCount: number;
  expertiseCount: number;
  projectCount: number;
  commandCount: number;
  deviceCount: number;
}

interface DetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
}

const StatCard = ({ title, value, icon }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const DetailsDialog = ({ isOpen, onClose, orgId }: DetailsDialogProps) => {
  const [orgDetails, setOrgDetails] = useState<OrganizationDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orgId) {
      setIsLoading(true);
      getOrganizationDetails(orgId)
        .then((details) => {
          setOrgDetails(details);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch organization details:", err);
          setError("Failed to load organization details");
          setIsLoading(false);
        });
    }
  }, [isOpen, orgId]);

  if (!isOpen) return null;

  const chartData = orgDetails
    ? [
        { name: "Users", value: orgDetails.userCount },
        { name: "Posts", value: orgDetails.postCount },
        { name: "Expertises", value: orgDetails.expertiseCount },
        { name: "Projects", value: orgDetails.projectCount },
        { name: "Commands", value: orgDetails.commandCount },
        { name: "Devices", value: orgDetails.deviceCount },
      ]
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={orgDetails?.imagePath || ""}
                alt={orgDetails?.name}
              />
              <AvatarFallback>{orgDetails?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-center sm:text-left">
              {orgDetails?.name || "Organization"} Details
            </span>
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orgDetails ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm">
                Statistics
              </TabsTrigger>
              <TabsTrigger value="chart" className="text-xs sm:text-sm">
                Chart
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="mt-4 space-y-4 text-sm sm:text-base">
                <p>
                  <strong>Description:</strong>{" "}
                  {orgDetails.description || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {orgDetails.address || "N/A"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(orgDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="stats">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Users"
                  value={orgDetails.userCount}
                  icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Posts"
                  value={orgDetails.postCount}
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Expertises"
                  value={orgDetails.expertiseCount}
                  icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Projects"
                  value={orgDetails.projectCount}
                  icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Commands"
                  value={orgDetails.commandCount}
                  icon={<Terminal className="h-4 w-4 text-muted-foreground" />}
                />
                <StatCard
                  title="Devices"
                  value={orgDetails.deviceCount}
                  icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
            </TabsContent>
            <TabsContent value="chart">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
