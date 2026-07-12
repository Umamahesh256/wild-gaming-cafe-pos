"use client";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 p-8 text-center">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-bold">Something went wrong loading orders</h2>
      <p className="text-muted-foreground text-sm max-w-md">
        {error.message || "An unexpected error occurred while parsing your sales data. This usually happens if the database returned malformed data."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
