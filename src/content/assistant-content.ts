/** Prepared answers use the published About and case-study copy. They are editorial content, not AI output. */
export type AssistantPrompt = {
  id: string;
  question: string;
  answer: string;
  source: { label: string; href: string };
  followUps?: string[];
};

export const starterPromptIds = ["design", "process", "design-code", "availability"] as const;

export const assistantPrompts: AssistantPrompt[] = [
  {
    id: "design", question: "What do you design?",
    answer: "I design web and mobile products, from the first flow through interface details, design systems and motion. I also build front-end interfaces, so I can carry those decisions into a working experience.",
    source: { label: "What I do", href: "/about#what-i-do" },
    followUps: ["services", "mobile-example"],
  },
  {
    id: "process", question: "How do you work?",
    answer: "I start by understanding who uses the product and what they need to do. Then I work through structure, flows and visual directions, refine the states and interactions, and check the result in the browser or on a device. I adjust a decision when evidence says it is wrong.",
    source: { label: "About my approach", href: "/about#about-me" },
    followUps: ["handoff", "motion"],
  },
  {
    id: "design-code", question: "Tell me about your design + code background.",
    answer: "I studied computer engineering before design. Now I design in Figma and build front-end interfaces with coding agents. They handle repetitive implementation work; I make the decisions and check the details before anything ships.",
    source: { label: "Design and build", href: "/about#about-me" },
    followUps: ["tools", "code-example"],
  },
  {
    id: "availability", question: "Are you available for work?",
    answer: "I’m currently open for work. I’m based in Warsaw and open to remote, hybrid or on-site roles. If you have a role or project in mind, you can contact me directly.",
    source: { label: "Contact details", href: "/about#contact" },
    followUps: ["roles", "contact"],
  },
  {
    id: "services", question: "Which services can you help with?",
    answer: "I can help with mobile apps, web products and marketing sites, design systems, AI product interfaces, motion and front-end builds. The scope can be a full product flow or a focused polish pass.",
    source: { label: "Services", href: "/about#what-i-do" },
    followUps: ["mobile-example", "code-example"],
  },
  {
    id: "mobile-example", question: "Can I see a mobile case study?",
    answer: "LuminAsset shows a long solar installation journey made easier to follow, from the first estimate through later steps. Quantum Body shows several connected journaling practices, from choosing one to writing and revisiting entries.",
    source: { label: "LuminAsset case study", href: "/cases/luminasset" },
    followUps: ["process", "motion"],
  },
  {
    id: "handoff", question: "How do you handle design to development?",
    answer: "I define flows, states and components so the behavior is clear, then work with developers or build the front end myself. That helps preserve layout, motion and small interactions through implementation.",
    source: { label: "Design and build", href: "/about#about-me" },
    followUps: ["design-code", "tools"],
  },
  {
    id: "motion", question: "Why do you focus on motion?",
    answer: "Transitions, states and feedback help people understand what changed and where to look next. I use motion to make an interface feel clear and responsive, rather than adding movement for its own sake.",
    source: { label: "Motion and micro-interactions", href: "/about#what-i-do" },
    followUps: ["mobile-example", "code-example"],
  },
  {
    id: "tools", question: "What tools do you use to design and build?",
    answer: "I design in Figma and build interfaces with Next.js, Tailwind and coding agents. I use tools such as Claude Code, Codex and Cursor, while keeping the decisions and final review with me.",
    source: { label: "Tools and skills", href: "/about#what-i-do" },
    followUps: ["design-code", "code-example"],
  },
  {
    id: "code-example", question: "Can I see a project example?",
    answer: "The LuminAsset case study walks through a mobile product with a multi-step customer journey and the admin logic behind it. The case pages show the decisions and interface work in more detail.",
    source: { label: "LuminAsset case study", href: "/cases/luminasset" },
    followUps: ["mobile-example", "process"],
  },
  {
    id: "roles", question: "What kinds of roles fit you?",
    answer: "I’m open to product design and design engineering work with product teams, studios, agencies and startups. I can take a feature from early flows through a build, or join a team on a focused part of the product.",
    source: { label: "Experience", href: "/about#experience" },
    followUps: ["availability", "contact"],
  },
  {
    id: "contact", question: "How can I contact you?",
    answer: "You can reach me on LinkedIn or Telegram, or copy my email address from the contact section at the bottom of the About page.",
    source: { label: "Contact options", href: "/about#contact" },
    followUps: ["availability", "roles"],
  },
];

export const assistantPromptById = new Map(assistantPrompts.map(prompt => [prompt.id, prompt]));
