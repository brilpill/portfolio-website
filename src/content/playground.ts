/** Temporary local sample material, not claims of completed client projects. */
const sampleItems = [
  { id: "prompt-library", title: "A home for prompts", kind: "Interface", image: "/cases/samples/promptly-library.png", description: "Sample interface used to explore layout, hierarchy and a quieter workspace." },
  { id: "orbit", title: "Finding an orbit", kind: "Visual study", image: "/playground/orbit-study.svg", description: "An original abstract placeholder for motion and interaction experiments." },
  { id: "loan-terms", title: "A clearer next step", kind: "Interface", image: "/cases/samples/loan-term.png", description: "Sample product screen for exploring form structure and decision-making." },
  { id: "layers", title: "Under the surface", kind: "Visual study", image: "/playground/layers-study.svg", description: "An original layered composition, ready to be replaced with a real process experiment." },
  { id: "prompt-focus", title: "Room to focus", kind: "Interface", image: "/cases/samples/promptly-fullscreen.png", description: "A sample focused workspace. Local preview material, not a published case study." },
  { id: "loan-complete", title: "A small finish", kind: "Interface", image: "/cases/samples/loan-signed.png", description: "A sample completion screen for studying a clear end to a product flow." },
];
/** Thirty temporary pins with unique IDs; samples repeat until final artwork is supplied. */
export const playgroundItems = Array.from({ length: 30 }, (_, index) => {
  const sample = sampleItems[(index + Math.floor(index / 6) * 2) % sampleItems.length];
  const related = sample.id.startsWith("prompt") ? [0, 4] : sample.id.startsWith("loan") ? [2, 5] : [1, 3];
  const images = [sample, ...related.map(i => sampleItems[i]).filter(item => item.id !== sample.id)]
    .map(item => ({ src: item.image, alt: item.title }));
  return { ...sample, images, id: `${sample.id}-${index + 1}` };
});
export type PlaygroundItem = typeof playgroundItems[number];
