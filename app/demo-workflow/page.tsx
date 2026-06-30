"use client";

import { N8nWorkflowBlock } from "@/components/ui/n8n-workflow-block-shadcnui";

export default function DemoWorkflow() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                System Architecture
              </h1>
              <p className="text-xs text-foreground/50 uppercase tracking-[0.2em]">
                Snap2Fix — End-to-End Complaint Workflow
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <N8nWorkflowBlock />
      </div>
    </div>
  );
}
