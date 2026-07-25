"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { addRepo } from "@/app/actions/repos";

export default function TestPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addRepo(formData);

      setTimeout(() => {
        router.refresh();
      }, 2000);
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="repoInput" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}