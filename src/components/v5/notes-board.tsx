"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Note } from "@/lib/notes";
import { playCue } from "@/components/ui-sound";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** The guestbook: a "New note" card first, then visitors' notes, newest first, across four columns. */
export function NotesBoard() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [available, setAvailable] = useState(true);
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(4);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/notes").then(r => r.json()).then(data => { setNotes(data.notes); setAvailable(data.available); }).catch(() => setNotes([]));
    const query = matchMedia("(max-width: 1023px)");
    const sync = () => setCount(query.matches ? 2 : 4);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  useEffect(() => { if (writing) field.current?.focus(); }, [writing]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true); setError("");
    try {
      const response = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not post");
      setNotes(current => [data.note, ...current ?? []]);
      setText(""); setName(""); setWriting(false);
      playCue("success");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not post");
      playCue("error");
    } finally { setSending(false); }
  };

  const cards: ({ kind: "new" } | { kind: "note"; note: Note })[] = [{ kind: "new" }, ...(notes ?? []).map(note => ({ kind: "note" as const, note }))];
  const columns: typeof cards[] = Array.from({ length: count }, () => []);
  cards.forEach((card, i) => columns[i % count].push(card));

  return (
    <div className="v5-notes" style={{ paddingBottom: 64 }}>
      {columns.map((column, c) => (
        <div key={c} className="v5-notes-col">
          {column.map(card => card.kind === "new" ? (
            writing ? (
              <form key="new" className="v5-note-form" onSubmit={submit}>
                <textarea ref={field} value={text} maxLength={280} placeholder="Leave a note…" aria-label="Note" onChange={event => setText(event.target.value)} />
                <input value={name} maxLength={40} placeholder="Your name (optional)" aria-label="Your name" onChange={event => setName(event.target.value)} />
                {error && <p className="v5-note-error" role="alert">{error}</p>}
                <div className="v5-note-actions">
                  <span>{280 - text.length}</span>
                  <div>
                    <button type="button" data-sound="close" onClick={() => { setWriting(false); setError(""); }}>Cancel</button>
                    <button type="submit" data-sound="off" disabled={!text.trim() || sending}>{sending ? "Posting…" : "Post"}</button>
                  </div>
                </div>
              </form>
            ) : (
              <button key="new" type="button" className="v5-note-new" data-sound="open" data-cursor="Write a note" disabled={!available} onClick={() => setWriting(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" /></svg>
                {available ? "New note" : "Notes are closed for now"}
              </button>
            )
          ) : (
            <article key={card.note.id} className="v5-note">
              <p>{card.note.text}</p>
              <span>{card.note.name} · {date(card.note.at)}</span>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
}
