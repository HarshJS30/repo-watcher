import { Job, Worker } from "bullmq";
import { prisma } from "@/prisma";
import { fetchRepoStats } from "./lib/github";

const worker = new Worker(
  "repo-sync", 
  async (job: Job) => {
    const result = await prisma.trackedRepo.findUnique({ where: { id: job.data.repoId } });

    if (!result) {
        console.log(`Repo ${job.data.repoId} not found, skipping.`);
        return; 
    }

    const stats = await fetchRepoStats(result.owner, result.name)
    console.log(stats)
    await prisma.repoSnapshot.create({
        data: {
            repoId:result.id,
            stars:stats.stars,
            forks:stats.forks,
            openIssues:stats.openIssues
        // check your RepoSnapshot model's actual field names here
        },
    });
    },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: 6379,
      maxRetriesPerRequest: null 
    },
    concurrency: 5, 
  },
);


worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
