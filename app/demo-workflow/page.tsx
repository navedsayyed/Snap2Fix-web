"use client";

import { N8nWorkflowBlock } from "@/components/ui/n8n-workflow-block-shadcnui";

export default function DemoWorkflow() {
  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      <N8nWorkflowBlock />
    </div>
  );
}
