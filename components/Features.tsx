import React from "react";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";

function FeaturesSectionWithHoverEffectsDemo() {
  return (
    <div className="min-h-screen w-full">
        
      <div className="absolute top-0 left-0 w-full p-2">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Features of SprintFlow</h1>
        <FeaturesSectionWithHoverEffects />
      </div>
    </div>
  );
}

export { FeaturesSectionWithHoverEffectsDemo };