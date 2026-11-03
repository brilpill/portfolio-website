import type { ReactNode } from "react";

/** Enough Markdown for the articles: headings, paragraphs, lists, code blocks, rules, and inline bold, italic,
 * code and links. Anything else comes through as plain text. */
export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  const lines = source.split("\n");
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      i++;
      blocks.push(<pre key={i} className="v5-md-code"><code>{code.join("\n")}</code></pre>);
      continue;
    }
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={i} />); i++; continue; }
    const heading = line.match(/^(#{2,3})\s+(.*)/);
    if (heading) {
      const Tag = heading[1].length === 2 ? "h2" : "h3";
      blocks.push(<Tag key={i}>{inline(heading[2])}</Tag>);
      i++;
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      for (; i < lines.length && /^[-*]\s/.test(lines[i]); i++) items.push(lines[i].slice(2));
      blocks.push(<ul key={i}>{items.map((item, n) => <li key={n}>{inline(item)}</li>)}</ul>);
      continue;
    }
    const paragraph: string[] = [];
    for (; i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|[-*]\s|---+$)/.test(lines[i]); i++) paragraph.push(lines[i]);
    blocks.push(<p key={i}>{inline(paragraph.join(" "))}</p>);
  }
  return <div className="v5-md">{blocks}</div>;
}

const TOKEN = /(\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*)/;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text, key = 0;
  for (let match = rest.match(TOKEN); match; match = rest.match(TOKEN)) {
    if (match.index) out.push(rest.slice(0, match.index));
    const [whole, , bold, code, label, href, italic] = match;
    if (bold) out.push(<strong key={key++}>{inline(bold)}</strong>);
    else if (code) out.push(<code key={key++}>{code}</code>);
    else if (label) out.push(<a key={key++} href={href} target="_blank" rel="noopener noreferrer" data-cursor="Open link">{inline(label)}</a>);
    else if (italic) out.push(<em key={key++}>{inline(italic)}</em>);
    rest = rest.slice(match.index! + whole.length);
  }
  if (rest) out.push(rest);
  return out;
}
