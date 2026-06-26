"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HrmsSignOutButton({ versionId }: { versionId: string }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleSignOut() {
    setIsPending(true)

    try {
      await fetch("/api/hrms/auth/session", {
        method: "DELETE",
      })
    } finally {
      router.replace(`/${versionId}/login`)
      router.refresh()
      setIsPending(false)
    }
  }

  return (
    <Button
      className="w-full justify-start rounded-2xl"
      variant="outline"
      onClick={handleSignOut}
      disabled={isPending}
    >
      <LogOut className="size-4" />
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  )
}
