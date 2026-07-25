import { prisma } from "@/prisma";
import { auth } from "@/auth";
import RepoChart from "../../components/repoChart";

export default async function RepoDetailPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const session = await auth();
  const { repoId } = await params;

  if (!session?.user?.id) {
    return <div>Please login.</div>;
  }

  const repo = await prisma.trackedRepo.findUnique({
    where: { id: repoId },
    include: {
      snapshots: {
        orderBy: { snapshotDate: "asc" },
      },
    },
  });

  if (!repo || repo.userId !== session.user.id) {
    return <div>Repo not found.</div>;
  }

  const chartData = repo.snapshots.map((snap) => ({
    date: new Date(snap.snapshotDate).toLocaleDateString(),
    stars: snap.stars,
    forks: snap.forks,
    openIssues: snap.openIssues,
  }));

  return (
    <div>
      <h1>{repo.owner}/{repo.name}</h1>
      <RepoChart data={chartData} />
    </div>
  );
}