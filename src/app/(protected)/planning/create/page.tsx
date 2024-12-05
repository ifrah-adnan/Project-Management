import { PlanningForm } from "../components/planning-form";

interface PageProps {
  searchParams: {
    postId: string;
  };
}

export default function CreatePlanningPage({ searchParams }: PageProps) {
  const { postId } = searchParams;

  if (!postId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No post ID provided</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <PlanningForm postId={postId} existingPlanning={null} />
    </div>
  );
}
