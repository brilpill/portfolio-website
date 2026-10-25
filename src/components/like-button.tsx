"use client";

import { useEffect, useRef, useState } from "react";
import { HeartIcon } from "@phosphor-icons/react";

/** How often an open, visible page re-reads the count, so likes from other visitors show up. */
const REFRESH = 20_000;
const SPARKS = [0, 60, 120, 180, 240, 300];

/**
 * Like button for a case study (after ktz.dk/work/nm-skills): a quiet heart and the live count. Liking fills the
 * heart, pulses a ring and throws six sparks; liking again takes it back. The count updates at once and is
 * then confirmed by the server (api/likes/[slug]).
 */
export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const pending = useRef(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      // Skip while a click is on its way, so a slow read can't undo the optimistic count.
      if (document.hidden || pending.current) return;
      try {
        const response = await fetch(`/api/likes/${slug}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as { count: number | null; liked: boolean };
        if (alive && !pending.current) { setCount(data.count); setLiked(data.liked); }
      } catch { /* offline: keep what is shown */ }
    };
    void load();
    const timer = window.setInterval(load, REFRESH);
    document.addEventListener("visibilitychange", load);
    return () => { alive = false; window.clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, [slug]);

  const toggle = async () => {
    const next = !liked;
    setLiked(next);
    setCount(value => value === null ? value : Math.max(0, value + (next ? 1 : -1)));
    if (next) setBurst(value => value + 1);
    pending.current++;
    try {
      const response = await fetch(`/api/likes/${slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ liked: next }) });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json() as { count: number; liked: boolean };
      setCount(data.count); setLiked(data.liked);
    } catch {
      // The like didn't save: put the button back as it was.
      setLiked(!next);
      setCount(value => value === null ? value : Math.max(0, value + (next ? -1 : 1)));
    } finally { pending.current--; }
  };

  const label = count === null ? (liked ? "Unlike this case" : "Like this case") : `${liked ? "Unlike" : "Like"} this case, ${count} ${count === 1 ? "like" : "likes"}`;
  return <button type="button" className="like-button" aria-pressed={liked} aria-label={label} onClick={toggle}>
    <span className="like-button-heart">
      <HeartIcon size={16} weight="fill" aria-hidden />
      {/* Remounted per like (key) so the ring and sparks replay every time. */}
      {burst > 0 && <span key={burst} className="like-button-burst" aria-hidden>
        <i className="like-button-ring" />
        {SPARKS.map(angle => <i key={angle} className="like-button-spark" style={{ rotate: `${angle}deg` }} />)}
      </span>}
    </span>
    {count !== null && <span key={count} className="like-button-count" aria-hidden>{count}</span>}
  </button>;
}
