"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export function CopyLinkButton({ url }: { url: string }) {
  return (
    <Button
      onClick={() => navigator.clipboard.writeText(url)}
      className="w-full"
      variant="outline"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Copy Share Link
    </Button>
  );
}
