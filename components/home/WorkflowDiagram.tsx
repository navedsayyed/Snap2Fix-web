'use client';

import { Fragment } from 'react';
import {
  QrCode,
  FileText,
  Camera,
  Send,
  BrainCircuit,
  Mail,
  UserCheck,
  Wrench,
  ImagePlus,
  Activity,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Globe,
  Server,
  Smartphone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type FlowBox = {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
};

type FlowLane = {
  id: string;
  title: string;
  subtitle: string;
  laneIcon: LucideIcon;
  accent: string;
  border: string;
  iconBg: string;
  boxes: FlowBox[];
};

const lanes: FlowLane[] = [
  {
    id: 'citizen',
    title: 'Citizen',
    subtitle: 'Web Portal',
    laneIcon: Globe,
    accent: 'from-[#00BFFF]/15 to-[#00BFFF]/5',
    border: 'border-[#00BFFF]/30',
    iconBg: 'bg-[#00BFFF]/20 text-[#00BFFF]',
    boxes: [
      { id: 'scan', label: 'Scan QR Code', sublabel: 'Auto-fill location', icon: QrCode },
      { id: 'form', label: 'Fill Details', sublabel: 'Type & priority', icon: FileText },
      { id: 'photo', label: 'Upload Photo', sublabel: 'Before image', icon: Camera },
      { id: 'submit', label: 'Submit', sublabel: 'Get tracking ID', icon: Send },
    ],
  },
  {
    id: 'system',
    title: 'Snap2Fix System',
    subtitle: 'Backend + AI',
    laneIcon: Server,
    accent: 'from-[#A855F7]/15 to-[#A855F7]/5',
    border: 'border-[#A855F7]/30',
    iconBg: 'bg-[#A855F7]/20 text-[#A855F7]',
    boxes: [
      { id: 'route', label: 'AI Routing', sublabel: 'Gemini → department', icon: BrainCircuit },
      { id: 'store', label: 'Save Complaint', sublabel: 'Supabase DB', icon: Server },
      { id: 'notify', label: 'Send Email', sublabel: 'Confirmation sent', icon: Mail },
    ],
  },
  {
    id: 'staff',
    title: 'Staff',
    subtitle: 'Mobile App',
    laneIcon: Smartphone,
    accent: 'from-[#DC2626]/15 to-[#DC2626]/5',
    border: 'border-[#DC2626]/30',
    iconBg: 'bg-[#DC2626]/20 text-[#DC2626]',
    boxes: [
      { id: 'review', label: 'Admin Review', sublabel: 'HOD oversight', icon: UserCheck },
      { id: 'assign', label: 'Assign Tech', sublabel: 'Pick technician', icon: UserCheck },
      { id: 'work', label: 'Fix Issue', sublabel: 'In progress', icon: Wrench },
      { id: 'proof', label: 'After Photo', sublabel: 'Proof of work', icon: ImagePlus },
    ],
  },
  {
    id: 'resolution',
    title: 'Resolution',
    subtitle: 'Back to Citizen',
    laneIcon: CheckCircle2,
    accent: 'from-[#4CAF50]/15 to-[#4CAF50]/5',
    border: 'border-[#4CAF50]/30',
    iconBg: 'bg-[#4CAF50]/20 text-[#4CAF50]',
    boxes: [
      { id: 'track', label: 'Live Tracking', sublabel: 'Real-time status', icon: Activity },
      { id: 'done', label: 'Completed', sublabel: 'Issue resolved', icon: CheckCircle2 },
    ],
  },
];

function FlowArrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  if (direction === 'down') {
    return (
      <div className="flex justify-center py-2 text-[#505050]" aria-hidden="true">
        <div className="flex flex-col items-center">
          <div className="w-px h-4 bg-gradient-to-b from-[#404040] to-[#00BFFF]/60" />
          <ArrowDown className="w-5 h-5 text-[#00BFFF]/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center flex-shrink-0 px-1 text-[#505050]" aria-hidden="true">
      <div className="flex items-center">
        <div className="w-3 h-px bg-gradient-to-r from-[#404040] to-[#00BFFF]/60" />
        <ArrowRight className="w-4 h-4 text-[#00BFFF]/70 flex-shrink-0" />
      </div>
    </div>
  );
}

function FlowBoxCard({
  box,
  iconBg,
  border,
}: {
  box: FlowBox;
  iconBg: string;
  border: string;
}) {
  const Icon = box.icon;

  return (
    <div
      className={`flex flex-col items-center text-center min-w-[120px] sm:min-w-[130px] max-w-[150px] px-3 py-4 rounded-xl bg-[#1A1A1A] border ${border} shadow-lg hover:scale-105 transition-transform duration-300`}
    >
      <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-semibold text-white leading-tight">{box.label}</p>
      {box.sublabel && (
        <p className="text-[10px] text-[#808080] mt-1 leading-tight">{box.sublabel}</p>
      )}
    </div>
  );
}

function LaneRow({ lane, isLast }: { lane: FlowLane; isLast: boolean }) {
  const LaneIcon = lane.laneIcon;

  return (
    <div data-reveal className="reveal-up">
      {/* Lane header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${lane.accent} border ${lane.border}`}
        >
          <LaneIcon className={`w-4 h-4 ${lane.iconBg.split(' ')[1]}`} />
          <span className="text-xs font-bold text-white uppercase tracking-wider">{lane.title}</span>
        </div>
        <span className="text-xs text-[#606060]">{lane.subtitle}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#333333] to-transparent" />
      </div>

      {/* Boxes + arrows — horizontal on lg, vertical on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:flex-wrap">
        {lane.boxes.map((box, i) => (
          <Fragment key={box.id}>
            <div className="flex justify-center">
              <FlowBoxCard box={box} iconBg={lane.iconBg} border={lane.border} />
            </div>
            {i < lane.boxes.length - 1 && (
              <>
                <div className="lg:hidden">
                  <FlowArrow direction="down" />
                </div>
                <div className="hidden lg:block">
                  <FlowArrow direction="right" />
                </div>
              </>
            )}
          </Fragment>
        ))}
      </div>

      {/* Connector arrow to next lane */}
      {!isLast && (
        <div className="flex justify-center py-6" aria-hidden="true">
          <div className="flex flex-col items-center">
            <div className="w-px h-6 bg-gradient-to-b from-[#404040] via-[#00BFFF]/40 to-[#00BFFF]/70" />
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center">
              <ArrowDown className="w-4 h-4 text-[#00BFFF]" />
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-[#00BFFF]/70 to-[#404040]" />
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact status legend */
const statusFlow = [
  { status: 'Submitted', color: '#FFC107' },
  { status: 'Assigned', color: '#2196F3' },
  { status: 'In Progress', color: '#FF9800' },
  { status: 'Completed', color: '#4CAF50' },
];

export function WorkflowDiagram() {
  return (
    <section className="py-16 sm:py-24 border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal className="reveal-up text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Complete{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#0099CC]">
              Workflow
            </span>
          </h2>
          <p className="text-[#B0B0B0] max-w-2xl mx-auto">
            From QR scan to resolution — see how complaints move through the web portal, backend
            system, and mobile app.
          </p>
        </div>

        {/* Diagram container */}
        <div
          data-reveal
          className="reveal-up relative bg-gradient-to-br from-[#1E1E1E] to-[#141414] rounded-3xl border border-[#333333] p-6 sm:p-10 overflow-x-auto"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none rounded-3xl"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 min-w-0">
            {lanes.map((lane, i) => (
              <LaneRow key={lane.id} lane={lane} isLast={i === lanes.length - 1} />
            ))}
          </div>
        </div>

        {/* Status flow bar */}
        <div data-reveal className="reveal-up mt-8">
          <p className="text-center text-xs text-[#606060] uppercase tracking-widest mb-4">
            Complaint Status Progression
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0">
            {statusFlow.map((item, i) => (
              <div key={item.status} className="flex items-center">
                <div
                  className="px-4 py-2 rounded-full text-xs font-semibold border"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}40`,
                    backgroundColor: `${item.color}15`,
                  }}
                >
                  {item.status}
                </div>
                {i < statusFlow.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#404040] mx-2 hidden sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          data-reveal
          className="reveal-up mt-8 flex flex-wrap justify-center gap-4 sm:gap-8"
        >
          {[
            { label: 'Web Portal', color: '#00BFFF', icon: Globe },
            { label: 'System / AI', color: '#A855F7', icon: Server },
            { label: 'Mobile App', color: '#DC2626', icon: Smartphone },
            { label: 'Resolved', color: '#4CAF50', icon: CheckCircle2 },
          ].map(({ label, color, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-xs text-[#808080]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
