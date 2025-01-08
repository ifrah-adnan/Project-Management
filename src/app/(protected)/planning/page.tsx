import { PlanningForm } from "./components/planning-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlanningDisplay } from "./components/planning-list";
import { deletePlanning, getPostPlanning } from "./utils/actions";

interface PageProps {
  searchParams: {
    postId: string;
  };
}

export default async function PlanningPage({ searchParams }: PageProps) {
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
  console.log(success, existingPlanning, error);

  if (!success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      {existingPlanning && existingPlanning.length > 0 ? (
        <>
          <PlanningDisplay planning={existingPlanning} />
          <div className="mt-4 flex justify-end">
            <Link href={`/planning/edit?postId=${postId}`}>
              <Button>Edit Planning</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-center text-lg">
            No planning exists for this post.
          </p>
          <div className="flex justify-center">
            <Link href={`/planning/create?postId=${postId}`}>
              <Button>Create Planning</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
