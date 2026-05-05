# clawdbot Neural Engine UI

clawdbot Neural Engine UI is a cinematic WebGL interface prototype for a live system-monitoring surface. It focuses on atmosphere, motion, and visual feedback rather than backend telemetry.

View the AI Studio prototype: https://ai.studio/apps/8aee507e-f37a-4c2d-bf26-ca24acda576c

## What It Explores

- 3D interface language for system status and activity.
- Motion-heavy dashboards that still need to remain readable.
- Combining React UI state with WebGL visual layers.
- How far a technical interface can lean into visual identity.

## Technical Notes

- React and Vite frontend.
- Three.js through React Three Fiber, drei, and postprocessing.
- framer-motion and lucide-react for UI transitions and controls.
- Tailwind for styling.

## Current Status

This is a prototype source repo. It is a visual system-interface concept, not a live telemetry product. Production work would require real data adapters, accessibility fallbacks, performance budgets, and reduced-motion support.

## Run Locally

Prerequisite: Node.js.

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## API Key Boundary

This prototype does not need a Gemini key for its current visual interface. If AI features are added later, keep model calls server-side or use an explicit visitor-provided key flow.

## AI-Assisted Build Note

This prototype was built with AI assistance. The useful work is the interaction direction, visual system shaping, and identifying where a cinematic UI needs real data, accessibility, and performance constraints.

## Related Public Notes

See the combined prototype overview repo: https://github.com/brycejohnson1417/ai-studio-prototype-overviews
