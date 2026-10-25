# Portfolio assistant plan

## What works now

The sidebar is a viewable preview while the chatbot is unavailable. Its entry buttons, preset questions, input, composer icons and info icon show “Currently unavailable.” on hover. The questions and composer cannot submit. The input uses the earlier soft gray, single-line layout and original icons. Close and Escape still work.

The editorial question map below remains in `src/content/assistant-content.ts` for a later phase. The prepared answers, follow-ups, project picker and selected-text context are currently **not active in the UI**. A selected-text shortcut can open the preview, but it does not attach or submit the selection.

## Question map

| Starter | Answer source | Follow-ups |
| --- | --- | --- |
| What do you design? | About: What I do | Which services can you help with? · Can I see a mobile case study? |
| How do you work? | About: approach | How do you handle design to development? · Why do you focus on motion? |
| Tell me about your design + code background. | About: Design and build | What tools do you use to design and build? · Can I see a project example? |
| Are you available for work? | Home availability and About contact | What kinds of roles fit you? · How can I contact you? |

These are drafted in `src/content/assistant-content.ts`. They need a fresh content review before activation.

## Live AI implementation

1. **Curate the source set.** The user-provided `Portfolio content.md` is a working brief, while `src/content/portfolio-content.ts`, `src/content/case-studies.ts`, and `src/content/project-slides.ts` drive current pages. Review claims before they become AI context. Publish small source records with a stable ID, page URL, title, text, review status and update date. Exclude legacy profile claims, private links, unlisted showcase material, and phase-two More projects until approved. Availability should have one current, dated source rather than being inferred from old job copy.
2. **Create a server endpoint.** A server route such as `/api/assistant` receives the question, a short conversation history, chosen project slugs, and optional selected text with its page URL. Validate lengths and slugs, apply rate limits, and keep model credentials on the server. The browser should never send the entire DOM or hidden draft content.
3. **Assemble context.** Use the chosen projects as filters, the selected passage as explicitly labeled quoted context, and a few relevant approved source records from About and case studies. If a claim is absent or uncertain, answer that it is unknown. Include links to the exact supporting page or case section in replies. Treat selected text and retrieved documents as data, not instructions to the model.
4. **Stream a response.** Show a pending state, then the response and source links. Support cancellation, retry, failure and rate-limit states. Keep keyboard focus in the composer. Preserve the question and context visibly so the visitor knows what the answer used.
5. **Handle privacy and quality.** Do not save selected text or conversation history by default. Decide separately whether opt-in analytics or server logs are needed. Test answers against the published biography and both case studies, especially dates, metrics, availability and project attribution. Add a direct contact path when the assistant cannot answer.

No provider or paid model has been selected or connected by this UI work.
