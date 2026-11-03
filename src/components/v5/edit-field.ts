/** Replaces a text field's whole value as an edit the browser records, so ⌘Z / Ctrl+Z steps back through it (setting
 * React state directly leaves no undo history). The field's input event updates its state; where the browser won't
 * record the edit (field not focused, no execCommand), `fallback` sets the value instead. */
export function editField(field: HTMLInputElement | null, text: string, fallback: (text: string) => void) {
  if (field && document.activeElement === field) {
    field.select();
    const done = text ? document.execCommand("insertText", false, text) : document.execCommand("delete");
    if (done) return;
  }
  fallback(text);
}

/** Replaces the characters from `from` to `to` with `text` as a recorded edit (so ⌘Z undoes it), leaving the caret
 * after it. Where the browser won't record the edit, `fallback` gets the whole new value instead. */
export function editRange(field: HTMLInputElement | null, from: number, to: number, text: string, fallback: (text: string) => void) {
  if (field && document.activeElement === field) {
    field.setSelectionRange(from, to);
    const done = text ? document.execCommand("insertText", false, text) : document.execCommand("delete");
    if (done) return;
  }
  const value = field?.value ?? "";
  fallback(value.slice(0, from) + text + value.slice(to));
}
