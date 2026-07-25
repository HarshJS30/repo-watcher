import { auth } from "@/auth";
import { prisma } from "@/prisma";
import Link from "next/link";
import TestPage from "../components/Form";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Please login.</div>;
  }

  const repos = await prisma.trackedRepo.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      snapshots: {
        orderBy: { snapshotDate: "desc" },
        take: 1,
      },
    },
  });

  return (
    <>
      <TestPage />

      <h1>Your tracked repos</h1>

      <ul>
        {repos.map((repo) => {
          const latest = repo.snapshots[0];

          return (
            <li key={repo.id} style={{ marginBottom: "12px" }}>
              <Link href={`/dashboard/${repo.id}`}>
                <strong>
                  {repo.owner}/{repo.name}
                </strong>
              </Link>
              <br />
              {latest ? (
                <>
                  Stars: {latest.stars} <br />
                  Forks: {latest.forks} <br />
                  Open Issues: {latest.openIssues} <br />
                </>
              ) : (
                <>No data yet — sync pending.</>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}