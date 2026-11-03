import type { Metadata } from "next";
import { facts } from "@/content/facts";
import { ForAgentsDoc } from "@/components/for-agents-doc";

export const metadata: Metadata = { title: "For agents", description: facts.summary, alternates: { canonical: "/for-agents" } };

/** The same facts record as /for-agents, inside the v5 frame (header, footer), set in v5's article type. */
export default function V5ForAgents() {
  return (
    <article className="v5-article v5-md v5-agents">
      <ForAgentsDoc home="/v5" labelClass="v5-label" />
    </article>
  );
}
