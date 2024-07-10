"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./_components/header";
import CustomCard from "./_components/card/customCard";
import { findMany } from "@/app/(protected)/projects/_utils/actions";
import { useStore } from "./_components/store";
import { useSession } from "@/components/session-provider";

export interface CommandProject {
  id: string;
  createdAt: Date;
  status: Status;
  project: {
    id: string;
    name: string;
    status: boolean;
  };
  command: {
    id: string;
    client: {
      name: string;
      image: string | null;
    } | null;
    reference: string;
  };
  sprint: {
    id: string;
    target: number;
    days: number;
    status: "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
    commandProjectId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  target: number;
  done: number;
  endDate: Date;
}

enum Status {
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export default function Home() {
  const [commandProjects, setCommandProjects] = useState<CommandProject[]>([]);
  const { filters } = useStore();
  const { session } = useSession();
  const user = session?.user;

  useEffect(() => {
    async function fetchCommandProjects() {
      const { data } = await findMany();
      if (user) {
        const filtered = data.filter((item: any) => item.user?.id === user.id);
        setCommandProjects(filtered as CommandProject[]);
      }
    }

    fetchCommandProjects();
  }, [user]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const backgroundElement = document.getElementById("interactive-bg");
      if (backgroundElement) {
        backgroundElement.style.setProperty("--mouse-x", `${clientX}px`);
        backgroundElement.style.setProperty("--mouse-y", `${clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const filteredProjects = commandProjects.filter((project) => {
    const nameMatch = project.project.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const statusMatch =
      filters.status === "ALL" || project.status === filters.status;
    return nameMatch && statusMatch;
  });

  return (
    <main className="relative flex min-h-screen flex-col">
      <div id="interactive-bg" className="absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <DashboardHeader />
        <div className="m-8">
          <div className="justify-left flex flex-row flex-wrap gap-4">
            {filteredProjects.map((project) => (
              <CustomCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
