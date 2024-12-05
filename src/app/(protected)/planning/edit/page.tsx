import { PlanningForm } from "../components/planning-form";
import { getPostPlanning } from "../utils/actions";

interface PageProps {
  searchParams: {
    postId: string;
  };
}

export default async function EditPlanningPage({ searchParams }: PageProps) {
  const { postId } = searchParams;

  if (!postId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No post ID provided</p>
      </div>
    );
  }

  const {
    success,
    data: existingPlanning,
    error,
  } = await getPostPlanning(postId);

  if (!success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Error: {error}</p>
      </div>
    );
  }

  if (!existingPlanning || existingPlanning.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          No existing planning found for this post
        </p>
      </div>
    );
  }

  // Passer le premier planning existant au formulaire
  return (
    <div className="container py-10">
      <PlanningForm
        postId={postId}
        existingPlanning={existingPlanning[0]}
        allExistingPlannings={existingPlanning}
      />
    </div>
  );
}
