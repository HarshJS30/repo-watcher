import { Queue } from "bullmq";

export const repoSyncQueue = new Queue("repo-sync", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: 6379,
  },
});