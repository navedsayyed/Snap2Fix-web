import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

export default function Snap2FixHeroDemo() {
  return (
    <div className="overflow-x-hidden w-[100%] min-h-screen">
      <CinematicHero
        brandName="Snap2Fix"
        tagline1="Report the issue,"
        tagline2="track the solution."
        cardHeading="Public Works, Simplified."
        cardDescription={
          <>
            <span className="text-white font-semibold">Snap2Fix</span> empowers 
            citizens to report infrastructure issues with AI-powered routing, 
            real-time tracking, and seamless communication with municipal departments.
          </>
        }
        metricValue={1247}
        metricLabel="Issues Resolved"
        ctaHeading="Start reporting today."
        ctaDescription="Join thousands making our communities better, one report at a time."
      />
    </div>
  );
}
