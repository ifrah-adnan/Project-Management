// import { getProjectOverview } from "../actions/getProjectOverview";

import { getProjectOverview } from "../_utils/actions";
import { ProjectOverviewDashboard } from "./ProjectOverviewDashboard";

export default async function ProjectOverviewPage({
  searchParams,
}: {
  searchParams: { commandProjectId: string };
}) {
  const { commandProjectId } = searchParams;
  const projectData = await getProjectOverview(commandProjectId);

  if (!projectData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Project Overview</h1>
        <p>
          Error: Unable to fetch project data. Please check the command project
          ID and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Project Overview</h1>
      <ProjectOverviewDashboard projectData={projectData} />
    </div>
  );
}
