"use server";

import { auth } from "@/auth";
import { repoSyncQueue } from "@/lib/queue";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export async function addRepo(formData: FormData) {
  const session = await auth();
  console.log("session:", session)

  if(!session?.user?.id){
    console.log("Not signed In")
    return;
  }

  const repoInput = formData.get("repoInput") as string;

  try {
    const url = new URL(repoInput);

    if (url.hostname !== "github.com") {
      console.log("Invalid GitHub URL");
      return;
    }

    
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length !== 2) {
      console.log("Repository URL should be in the format:");
      console.log("https://github.com/owner/repository");
      return;
    }

    const [ownerName, repoName] = parts;

    const created = await prisma.trackedRepo.create({
        data: {
            owner: ownerName,
            name: repoName,
            url: repoInput,
            userId: session.user.id,
        },
    });
    await repoSyncQueue.add(
    "sync-repo",
    { repoId: created.id },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    }
  );
  await repoSyncQueue.add("sync-repo", { repoId: created.id }, {
  repeat: { pattern: '0 0 * * *' },
});
    console.log("created", created)
    revalidatePath('/dashboard')
  }catch (err: unknown) {
    const error = err as { code?: string };

    if (error.code === "P2002") {
        console.log("You're already tracking this repo.");
        return;
    }
    }
}