"use client";

import { motion } from "framer-motion";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  User,
  Globe,
  ShieldCheck,
  Brain,
  Database,
  Bell,
  Smartphone,
  LayoutDashboard,
  UserCheck,
  Wrench,
  Camera,
  CheckCircle2,
  ArrowRight,
  Workflow,
} from "lucide-react";

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "output";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
  section?: string;
  pulse?: boolean;
}

interface WorkflowConnection {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

interface SectionLabel {
  text: string;
  position: { x: number; y: number };
  color: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;
const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 1050;

// ─── Color System ────────────────────────────────────────────────────────────

const colorClasses: Record<
  string,
  { border: string; bg: string; text: string; glow: string; iconBg: string }
> = {
  cyan: {
    border: "border-cyan-400/50",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    iconBg: "bg-cyan-500/20 border-cyan-400/40",
  },
  blue: {
    border: "border-blue-400/50",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    iconBg: "bg-blue-500/20 border-blue-400/40",
  },
  violet: {
    border: "border-violet-400/50",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
    iconBg: "bg-violet-500/20 border-violet-400/40",
  },
  amber: {
    border: "border-amber-400/50",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    iconBg: "bg-amber-500/20 border-amber-400/40",
  },
  emerald: {
    border: "border-emerald-400/50",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-500/20 border-emerald-400/40",
  },
  pink: {
    border: "border-pink-400/50",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    glow: "shadow-pink-500/20",
    iconBg: "bg-pink-500/20 border-pink-400/40",
  },
  purple: {
    border: "border-purple-400/50",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
    iconBg: "bg-purple-500/20 border-purple-400/40",
  },
  orange: {
    border: "border-orange-400/50",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    glow: "shadow-orange-500/20",
    iconBg: "bg-orange-500/20 border-orange-400/40",
  },
  teal: {
    border: "border-teal-400/50",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    glow: "shadow-teal-500/20",
    iconBg: "bg-teal-500/20 border-teal-400/40",
  },
  lime: {
    border: "border-lime-400/50",
    bg: "bg-lime-500/10",
    text: "text-lime-400",
    glow: "shadow-lime-500/20",
    iconBg: "bg-lime-500/20 border-lime-400/40",
  },
  sky: {
    border: "border-sky-400/50",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    glow: "shadow-sky-500/20",
    iconBg: "bg-sky-500/20 border-sky-400/40",
  },
  green: {
    border: "border-green-400/50",
    bg: "bg-green-500/10",
    text: "text-green-400",
    glow: "shadow-green-500/20",
    iconBg: "bg-green-500/20 border-green-400/40",
  },
};

// ─── Snap2Fix Workflow Nodes ─────────────────────────────────────────────────

const snap2fixNodes: WorkflowNode[] = [
  // Row 1: User Submission Flow
  {
    id: "end-user",
    type: "trigger",
    title: "End User",
    description: "Student / Staff / Guest submits complaint via Web Portal",
    icon: User,
    color: "cyan",
    position: { x: 60, y: 60 },
    section: "COMPLAINT SUBMISSION",
    pulse: true,
  },
  {
    id: "web-app",
    type: "action",
    title: "Next.js Web App",
    description: "Login • Guest Complaint • QR Scan • Upload Image • Track",
    icon: Globe,
    color: "blue",
    position: { x: 350, y: 60 },
  },
  {
    id: "api-validation",
    type: "action",
    title: "API Validation",
    description: "Zod validation • Image upload • Generate tracking token",
    icon: ShieldCheck,
    color: "violet",
    position: { x: 640, y: 60 },
  },
  {
    id: "ai-routing",
    type: "condition",
    title: "Gemini AI Routing",
    description: "Analyze description • Find department • Confidence score",
    icon: Brain,
    color: "amber",
    position: { x: 930, y: 60 },
    pulse: true,
  },

  // Row 2: Backend Processing
  {
    id: "supabase",
    type: "action",
    title: "Supabase Backend",
    description: "PostgreSQL • Auth • Storage • Realtime subscriptions",
    icon: Database,
    color: "emerald",
    position: { x: 350, y: 260 },
    section: "BACKEND PROCESSING",
    pulse: true,
  },
  {
    id: "realtime",
    type: "action",
    title: "Realtime Notification",
    description: "Push updates to Web & Mobile • Live status sync",
    icon: Bell,
    color: "pink",
    position: { x: 640, y: 260 },
  },
  {
    id: "mobile-app",
    type: "action",
    title: "React Native App",
    description: "Admin • Technician • Super Admin mobile dashboards",
    icon: Smartphone,
    color: "purple",
    position: { x: 930, y: 260 },
  },

  // Row 3: Admin & Resolution Flow
  {
    id: "admin-dashboard",
    type: "action",
    title: "Admin Dashboard",
    description: "View department complaints • Manage assignments",
    icon: LayoutDashboard,
    color: "orange",
    position: { x: 350, y: 460 },
    section: "ADMIN & ASSIGNMENT",
  },
  {
    id: "assign-tech",
    type: "action",
    title: "Assign Technician",
    description: "Route complaint to available technician • Status → In Progress",
    icon: UserCheck,
    color: "teal",
    position: { x: 640, y: 460 },
  },

  // Row 4: Technician Resolution
  {
    id: "tech-repairs",
    type: "action",
    title: "Technician Repairs",
    description: "Visit location • Diagnose & fix issue • On-site resolution",
    icon: Wrench,
    color: "lime",
    position: { x: 350, y: 660 },
    section: "RESOLUTION",
  },
  {
    id: "upload-proof",
    type: "action",
    title: "Upload Proof",
    description: "After photo • Completion notes • Before/After comparison",
    icon: Camera,
    color: "sky",
    position: { x: 640, y: 660 },
  },
  {
    id: "resolved",
    type: "output",
    title: "Complaint Resolved",
    description: "Status → Completed • User notified • Timeline updated",
    icon: CheckCircle2,
    color: "green",
    position: { x: 930, y: 660 },
    pulse: true,
  },
];

// ─── Connections ─────────────────────────────────────────────────────────────

const snap2fixConnections: WorkflowConnection[] = [
  // Row 1: Linear submission flow
  { from: "end-user", to: "web-app", animated: true },
  { from: "web-app", to: "api-validation", animated: true },
  { from: "api-validation", to: "ai-routing", label: "General?", animated: true },

  // AI routing down to Supabase
  { from: "ai-routing", to: "supabase", label: "Route Dept", animated: true },
  // Direct path (non-general) skips AI
  { from: "api-validation", to: "supabase", label: "Specific Dept", animated: false },

  // Row 2: Backend flow
  { from: "supabase", to: "realtime", animated: true },
  { from: "realtime", to: "mobile-app", animated: true },

  // Row 2 → Row 3: Admin flow
  { from: "mobile-app", to: "admin-dashboard", animated: true },
  { from: "admin-dashboard", to: "assign-tech", animated: true },

  // Row 3 → Row 4: Resolution flow
  { from: "assign-tech", to: "tech-repairs", animated: true },
  { from: "tech-repairs", to: "upload-proof", animated: true },
  { from: "upload-proof", to: "resolved", animated: true },

  // Feedback loop: resolved notifies back via realtime
  { from: "resolved", to: "realtime", label: "Sync", animated: false },
];

// ─── Section Labels ──────────────────────────────────────────────────────────

const sectionLabels: SectionLabel[] = [
  { text: "COMPLAINT SUBMISSION", position: { x: 60, y: 30 }, color: "text-cyan-500/60" },
  { text: "BACKEND PROCESSING", position: { x: 350, y: 230 }, color: "text-emerald-500/60" },
  { text: "ADMIN & ASSIGNMENT", position: { x: 350, y: 430 }, color: "text-orange-500/60" },
  { text: "RESOLUTION", position: { x: 350, y: 630 }, color: "text-lime-500/60" },
];

// ─── Connection Line Component ───────────────────────────────────────────────

function WorkflowConnectionLine({
  from,
  to,
  label,
  animated,
  nodes,
  index,
}: {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  nodes: WorkflowNode[];
  index: number;
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);

  if (!fromNode || !toNode) return null;

  const fromCenterX = fromNode.position.x + NODE_WIDTH / 2;
  const fromCenterY = fromNode.position.y + NODE_HEIGHT / 2;
  const toCenterX = toNode.position.x + NODE_WIDTH / 2;
  const toCenterY = toNode.position.y + NODE_HEIGHT / 2;

  let startX: number, startY: number, endX: number, endY: number;

  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;

  // Determine connection anchor points based on relative positions
  if (Math.abs(dx) > Math.abs(dy)) {
    // Mostly horizontal
    if (dx > 0) {
      startX = fromNode.position.x + NODE_WIDTH;
      startY = fromNode.position.y + NODE_HEIGHT / 2;
      endX = toNode.position.x;
      endY = toNode.position.y + NODE_HEIGHT / 2;
    } else {
      startX = fromNode.position.x;
      startY = fromNode.position.y + NODE_HEIGHT / 2;
      endX = toNode.position.x + NODE_WIDTH;
      endY = toNode.position.y + NODE_HEIGHT / 2;
    }
  } else {
    // Mostly vertical
    if (dy > 0) {
      startX = fromNode.position.x + NODE_WIDTH / 2;
      startY = fromNode.position.y + NODE_HEIGHT;
      endX = toNode.position.x + NODE_WIDTH / 2;
      endY = toNode.position.y;
    } else {
      startX = fromNode.position.x + NODE_WIDTH / 2;
      startY = fromNode.position.y;
      endX = toNode.position.x + NODE_WIDTH / 2;
      endY = toNode.position.y - 0;
    }
  }

  // Build cubic bezier path
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  let path: string;
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal curve
    path = `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`;
  } else {
    // Vertical curve
    path = `M${startX},${startY} C${startX},${midY} ${endX},${midY} ${endX},${endY}`;
  }

  const gradientId = `gradient-${from}-${to}`;
  const animId = `flow-${from}-${to}`;

  // Label position
  const labelX = midX;
  const labelY = midY - 10;

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(148,163,184,0.6)" />
          <stop offset="100%" stopColor="rgba(148,163,184,0.25)" />
        </linearGradient>
      </defs>

      {/* Base path (glow) */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.3}
      />

      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke="rgba(148,163,184,0.5)"
        strokeWidth={1.5}
        strokeDasharray={animated ? "6,4" : "none"}
        strokeLinecap="round"
        opacity={0.7}
      >
        {animated && (
          <animate
            attributeName="stroke-dashoffset"
            values="0;-20"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* Arrow at end */}
      <circle cx={endX} cy={endY} r={3} fill="rgba(148,163,184,0.6)" />

      {/* Label */}
      {label && (
        <>
          <rect
            x={labelX - 35}
            y={labelY - 9}
            width={70}
            height={18}
            rx={9}
            fill="rgba(15,23,42,0.85)"
            stroke="rgba(148,163,184,0.2)"
            strokeWidth={1}
          />
          <text
            x={labelX}
            y={labelY + 4}
            textAnchor="middle"
            fill="rgba(148,163,184,0.7)"
            fontSize={9}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={500}
            letterSpacing="0.05em"
          >
            {label}
          </text>
        </>
      )}
    </g>
  );
}

// ─── Dot Grid Pattern ────────────────────────────────────────────────────────

function DotGrid() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dotGrid"
          x={0}
          y={0}
          width={24}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={1} cy={1} r={0.8} fill="rgba(148,163,184,0.12)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function N8nWorkflowBlock() {
  const nodes = snap2fixNodes;
  const connections = snap2fixConnections;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background/60 backdrop-blur">
      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/30 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-400/30">
            <Workflow className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Snap2Fix Ecosystem
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
              Complete Complaint Lifecycle Workflow
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-400"
          >
            <span className="relative mr-1.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-border/40 bg-background/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/50"
          >
            {nodes.length} Nodes
          </Badge>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full overflow-auto"
        style={{ minHeight: "500px" }}
        role="region"
        aria-label="Snap2Fix workflow visualization"
        tabIndex={0}
      >
        <div className="relative" style={{ minWidth: CANVAS_WIDTH, minHeight: CANVAS_HEIGHT }}>
          {/* Dot grid background */}
          <DotGrid />

          {/* Section Labels */}
          {sectionLabels.map((label) => (
            <motion.div
              key={label.text}
              className="absolute pointer-events-none"
              style={{ left: label.position.x, top: label.position.y }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.3em] ${label.color}`}
              >
                {label.text}
              </span>
            </motion.div>
          ))}

          {/* SVG Connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {connections.map((c, i) => (
              <WorkflowConnectionLine
                key={`${c.from}-${c.to}`}
                from={c.from}
                to={c.to}
                label={c.label}
                animated={c.animated}
                nodes={nodes}
                index={i}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const colors = colorClasses[node.color];

            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: NODE_WIDTH,
                }}
                initial={{ scale: 0.7, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Card
                  className={`group/node relative w-full overflow-hidden rounded-xl border ${colors.border} ${colors.bg} bg-background/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:${colors.glow} hover:scale-[1.03]`}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/node:opacity-100" />

                  {/* Pulse ring for key nodes */}
                  {node.pulse && (
                    <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover/node:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 rounded-xl border ${colors.border} animate-pulse`} />
                    </div>
                  )}

                  <div className="relative p-3.5 space-y-2.5">
                    {/* Top: Icon + Type Badge */}
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${colors.iconBg} backdrop-blur`}
                        aria-hidden="true"
                      >
                        <Icon className={`h-4.5 w-4.5 ${colors.text}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className={`mb-1 rounded-full border-border/30 bg-background/60 px-1.5 py-0 text-[8px] uppercase tracking-[0.2em] ${colors.text}`}
                        >
                          {node.type}
                        </Badge>
                        <h3 className="truncate text-xs font-bold tracking-tight text-foreground">
                          {node.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="line-clamp-2 text-[10px] leading-relaxed text-foreground/60">
                      {node.description}
                    </p>

                    {/* Bottom: Connection indicator */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <div className={`h-1 w-1 rounded-full ${colors.text} bg-current opacity-60`} />
                      <ArrowRight className={`h-2.5 w-2.5 ${colors.text} opacity-40`} aria-hidden="true" />
                      <span className={`text-[9px] uppercase tracking-[0.15em] ${colors.text} opacity-50`}>
                        Connected
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/30 px-4 py-2.5 sm:px-6"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-4 text-[10px] text-foreground/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="uppercase tracking-[0.2em] font-medium">
              {nodes.length} Nodes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400/60" aria-hidden="true" />
            <span className="uppercase tracking-[0.2em] font-medium">
              {connections.length} Connections
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400/60" aria-hidden="true" />
            <span className="uppercase tracking-[0.2em] font-medium">
              4 Sections
            </span>
          </div>
        </div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 font-medium">
          Snap2Fix • Automated Complaint Lifecycle
        </p>
      </div>
    </div>
  );
}
