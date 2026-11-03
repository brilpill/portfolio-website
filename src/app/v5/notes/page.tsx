import type { Metadata } from "next";
import { NotesBoard } from "@/components/v5/notes-board";

export const metadata: Metadata = { title: "Notes" };

export default function V5Notes() {
  return <NotesBoard />;
}
