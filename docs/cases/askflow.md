# AskFlow

> **Changed 26 Oct 2026, at Oleh's request:**
> - **Overview, first block:** three presentation images from the AskFlow project page on fourmeta.com, at their published size (about 2250 px wide; Oleh's own downloads were low quality): website, product quiz, how it works. Mobile, AI advisor and social were tried and removed at Oleh's request; their files (`fm-mobile`, `fm-advisor`, `fm-instagram`) stay for now. The case study hero uses the same three images in the same block (it was the builder screen). An `images` block with `fill: true` (covers the frame) and `control: "player"` (timed dots instead of labelled tabs). The product screens are now the second block; the single shopping-assistant presentation is gone from the overview.
> - **Case study, Website chapter:** the two low-res presentations (`article-website.jpg`, `article-mobile.jpg`) are replaced by five from the same page: mobile pages, full page, newsletter, insights, quiz with AI. The two phone pairs were side-by-side images on that page, joined into one image each.
> - Files are `public/cases/askflow/fm-*.webp`; keys `af.fm*` in `askflow-media.ts`. The `article-*.jpg` files are no longer used.
>
> **Added 26 Oct 2026 from the AskFlow App Figma file (FjWV5Lv3MnBErouY1resCW, approved pages), at Oleh's request:**
> - **Appearance:** a live component, `askflow/answer-colour` (`src/cases/askflow/demos/answer-colour.tsx`), rebuilt from the "Example of applying colour for answers" board (6513:151548): pick a swatch or type a hex value, see the default, hover and active tokens, and try a live question. Plus theme examples (Themes page, 8074 and 13728 frames) as an `images` block; the dark one was removed at Oleh's request, so five remain.
> - **Catalogue:** matching products from an answer's menu, through to a score per product (Logic & Scoring page, 21105 and 19207 sections).
> - **Recommendations:** global settings from the builder menu: start screen, results page and assistant results (12464:114749).
> - **New chapter, Free trial:** versions A and B of where the trial offer appears (22948:26533/26534). Plan prices are blurred. The existing "First publication" screen is B's first step, so it moved here from Publish. The copy doesn't say which version shipped.
> - **Storefront:** a full quiz run in a popup over a demo store (16793:154649). The store's logo, tab title and URL are painted out.
> - Images are 1x JPGs in `public/cases/askflow/` (store-*, results-*, match-*, trial-a-*, trial-b-*, theme-*).
>
> **Also 26 Oct 2026, at Oleh's request:**
> - **Removed:** the Website chapter's five fourmeta.com presentations, the Setup chapter's connect-store pair, and the Catalogue close-up. Their files stay.
> - **Website chapter:** the desktop homepage is now a scrolling sheet like Quantum Body's Behance block: the whole page from the AskFlow Website Figma file (R8i88pBO3DRstcyiMLKzgb, 2001:21659), 1728 × 13095, as `website-home-full.jpg` with `website-home-cover.jpg` (its top) as the cover. The review ratings and contact email were replaced with "Sample", as on the mobile export; the customer logo strip is left as designed, as on mobile. The mobile homepage's scrolling phone stands over the sheet's right edge, as in the earlier desktop-and-phone layout (`phone` on the scrolling image). Then, at Oleh's request, moved into the laptop mockup: a `responsive` block with `frame: "laptop"`, the full page scrolling inside the laptop's screen and the mobile homepage scrolling in the phone beside it.
> - **More website pages (26 Oct 2026):** the Website chapter's laptop + phone block now has 11 tabs: Home, How to use, Pricing, FAQ, Health & Wellbeing, Fashion, Beauty, About us, Partners, Blog, Article, from the AskFlow Website Figma file (Section 4022:9763; the article is the first version, 2001:8875). Each page is in `public/cases/askflow/site/` as `<page>-full.jpg` (desktop, 1728 wide) and `<page>-m-full.jpg` (mobile, 375 wide), with top-of-page covers. Masked: plan prices and per-engagement rates (blurred); review ratings, testimonial names and company domains, including the edge-of-frame LEGO Colombia card, read "Sample". Product prices in the sample shop UI and the customer logo strip are left as on the homepage. Keys: `af.sitePages` in `askflow-media.ts`.
> - **Recommendations:** the Configuration side of the pair is now the full results-page settings screen (`results-page.jpg`) instead of the cropped `result-controls.png`, shown whole on the card grey at 4:3 (`results-page-4x3.jpg`), since a pair card crops to 4:3; the settings tabs below drop that screen to avoid showing it twice.
> - **Removed at Oleh's request:** the Selection demo from the Components grid; the typography and colour close-ups (Appearance); the mobile cart close-up (Cart); the assistant settings close-up (Assistant); the segmentation close-up (Integrations); the start-step validation close-up (Publish); the "Additional reporting design" tab (Reporting); the drop-off close-up with its cursor note (Insights); the routing close-up with its cursor note (Canvas). Files and the `askflow/selection` demo stay; text that mentioned the close-ups was trimmed.
> - **Live demos framed:** the logic jump, product picker and answer colours now sit inside the grey block as their own rounded app windows (`window: true` in `src/cases/demos.tsx`), the same size as the screenshot frames (64% wide, 16:10). Each demo keeps its 1152-wide layout and is scaled down to fit; the logic jump's cards moved 80px lower to sit centred, and its drag maths divides by the scale.
> - **Kit demos:** the Input lost its standing helper line (only the Validate result shows under it now) and the Select lost its keyboard hint, at Oleh's request.
> - **Kit demos, layout:** the Button, Select and Minimap are centred in their tiles (Minimap cards moved to sit centred above the minimap; the Select's open list floats over the tile below). The Input lost its Validate button (and the error/success messages it showed); its Small and Disabled switches sit top right, like the Button's. The Button's sizes (Xs–Lg) are now a second tab group in the block's bottom row, to the right of the style tabs, the row centred (`InTabRow` from `src/cases/demo-slot.tsx`); Destructive and Disabled stay top right. The Selection demo's Small switch is docked bottom centre (`.afk-dock`). The Input's focus ring now wraps the whole field, not just the text area. The Question card's "Show connection" switch and its connected state were removed.

> **As built, 25 Oct 2026.** The revised case file, saved as given; it matches the site: `src/content/case-studies.ts`, `src/content/project-slides.ts`, `src/content/askflow-media.ts`, demos in `src/cases/askflow/demos/` (kit.tsx for the six UI-kit pieces, logic-jump.tsx, product-picker.tsx), images in `public/cases/askflow/`. Differences from the file below:
> - Intro highlight: the site highlights a phrase that is in the intro ("connect answers to products"), since "From the merchant's canvas to the shopper's next step." isn't part of the intro text. Change either if you prefer.
> - App screens are fitted into 1536 × 960 without cropping: narrow or tall ones are extended at the sides, short ones at the bottom, by repeating their edge pixels. Browser blocks use `ratio: "16 / 10"`.
> - The Components chapter is live: all six demos are built and registered (`askflow/button`, `input`, `select`, `selection`, `question-card`, `minimap`), in the two grids as listed. The optional logic-jump and product-picker demos sit at the end of the Logic and Catalogue chapters.
> - Timeline is left empty on the slide (shown as a dash). Reference-only files, `exploration-code.png`, the long result/cart mobile partners and `website-home-full.png` aren't used on the page.

## 1. Basics

Slug: askflow
Title: AskFlow
Group: Web
Placement: featured
Format: Web App & Website
Icon: FlowArrow

## 2. Case overview

Headline: Building the tools behind a more personal shopping experience.
Overview: AskFlow gives merchants tools to create product quizzes and configure AI shopping assistance. I co-designed new app features and designed the marketing website. This case connects the visual builder, recommendation settings, shopper experience, publishing tools, and reporting that surround those features.
My role: Product Design (co-designer) / Website Design
Industry: eCommerce / SaaS
Case study: yes

Media:
1. browser · tabs · frame: bare — builder.png "Quiz builder", product-match.png "Product matching", chat-workspace.png "AI assistant", insights-map.png "Flow insights"
   caption: The product from creation to configuration and review. Sample designs.
2. image — article-assistant.png
   caption: A finished presentation of AskFlow's shopping-assistant experience, sourced from the supplied project article.
3. device · tabs — shopper-choice-mobile.png "Choice", shopper-image-mobile.png "Image choices" (long: shopper-image-mobile-full.png), shopper-form-mobile.png "Form"
   caption: Three examples of the shopper-facing experience on mobile. Sample designs.

## 3. Case study

Title: Building the tools behind a more personal shopping experience.
Intro: A product quiz involves more than writing questions. Merchants need to shape a flow, connect answers to products, make the experience fit their store, and understand what happens after publication. AskFlow brings these tasks together with AI shopping assistance. I worked as a co-designer on new app features within the shared product and also designed its marketing website.
Hero: browser · frame: bare — builder.png
Intro highlight: From the merchant's canvas to the shopper's next step.

Chapter — Product · Two sides of the same experience
Text: The merchant works with a map of questions, rules, and result steps. The shopper sees a focused sequence of choices and recommendations. Showing both sides makes the app easier to understand: the editor defines the experience, while the storefront turns that configuration into an interaction.
Pair:
  Left: label "Merchant", title "Build the route", text "Connected cards describe the questions and destinations within a quiz.", block: browser · frame: bare — branch-drag.png
  Right: label "Shopper", title "Answer one question at a time", text "Choice and image-question examples show how that structure becomes a smaller, focused interface.", block: device · tabs — shopper-choice-mobile.png "Choice", shopper-image-mobile.png "Images" (long: shopper-image-mobile-full.png)

Chapter — Website · Introducing the product through its interface
Text: I designed the marketing website to explain product quizzes and AI shopping assistance through interface examples, clear product sections, and calls to action. The visual language carries across desktop and mobile. A small set of finished presentations adds another view of how the product was communicated.
Figures: responsive · frame: bare
  web: website-home.png "Homepage"
  mobile: website-home-mobile.png (long: website-home-mobile-full.png)
         images — article-website.png "Website presentation", article-mobile.png "Mobile presentation"

Chapter — Setup · Connecting the store before building the experience
Text: Setup covers account creation, platform choice, store connection, and catalogue preparation. These stages give the merchant a route into the workspace before they begin configuring a quiz or assistant. The connection examples and completion screen make the hand-off between store setup and product creation visible.
Figures: browser · tabs · frame: bare — signup.png "Create an account", account-setup.png "Account setup", cms-choice.png "Choose a platform", catalog-sync.png "Catalogue ready"
         images — connect-store.png "Connect the store", store-connected.png "Connection complete"

Chapter — Workspace · Keeping the surrounding product in view
Text: The workspace brings quizzes, AI chats, integrations, and reporting into a shared navigation structure. Project switching, preferences, and team permissions support the work around the editor. Quiz status and workspace actions give the merchant a way back into existing experiences.
Figures: browser · tabs · frame: bare — dashboard.png "Quizzes", workspace-switcher.png "Switch workspace", workspace-preferences.png "Preferences", team-permissions.png "Users and permissions"

Chapter — Create · Starting with a prompt or a blank canvas
Text: Merchants can begin with a first question or describe the quiz they want to create. The AI-generation flow separates entering a prompt from reviewing a generated structure. The visual canvas then becomes the place to continue editing, rather than treating the initial generation as a finished quiz.
Figures: browser · tabs · frame: bare — ai-entry.png "First question", ai-prompt.png "Describe the quiz", ai-generated.png "Review the structure", builder.png "Continue in the builder"

Chapter — Canvas · Making relationships editable
Text: Questions and answers appear as cards with visible connection points. Branching can direct different answers to different destinations; grouped answers can share a route. Editing also includes smaller operations such as duplicating an answer and reconnecting a broken path. These interaction states explain how the map is intended to be used, beyond its appearance in a finished screenshot.
Figures: browser · tabs · frame: bare — choice-builder.png "Question card", choice-multiselect.png "Group answers", branch-routing.png "Route an answer", branch-restore.png "Reconnect a path", answer-duplicate.png "Duplicate an answer"
         image — routing-closeup.png
Annotation: cursor · points: [35, 48], [78, 48] · note: "An answer connects to its next step."

Chapter — Questions · Moving between structure and detail
Text: The map describes the overall route; the detailed editor handles the content within a step. Text choices, image choices, and forms use a preview alongside their settings. The image-step examples show answer imagery and layouts, while form editing provides input and consent controls.
Figures: browser · tabs · frame: bare — question-details.png "Question editor", question-add-answer.png "Add an answer", image-upload.png "Change an image", image-layout.png "Image layout"
         browser · tabs · frame: bare — form-types.png "Input types and consent", form-create.png "Create an input", form-input.png "Edit an input", form-design.png "Form appearance"

Chapter — Logic · Giving different answers different routes
Text: Logic jumps add conditional routing to the map. The canvas shows where a condition belongs, while the rule dialog provides a focused configuration view. Keeping the route and its rule available as separate views lets the case explain both the structure and the controls that define it.
Figures: browser · tabs · frame: bare — logic-step.png "Logic step", logic-jump-item.png "Choose a conditional route", logic-rule.png "Configure the rule"

Chapter — Catalogue · Matching the flow to products and variants
Text: Product matching places a searchable catalogue beside the canvas. Merchants can work with products and variants, use filters, and review their selection before saving. Empty matches and selection-limit feedback are part of the same task, so the interface also needs to explain when a choice cannot continue as expected.
Figures: browser · tabs · frame: bare — product-match.png "Browse products", product-filter.png "Filter the catalogue", product-selected.png "Select products and variants", product-empty.png "No matches", product-limit.png "Selection limit"
         image — catalogue-closeup.png

Chapter — Recommendations · Controlling the result of the quiz
Text: Result settings determine how recommendations are presented, including a single-product layout and a route through multiple result sets. The populated preview connects these settings to the shopper-facing outcome. Separate controls cover result imagery and the labels and actions attached to a product.
Pair:
  Left: label "Result", title "A recommendation the shopper can act on", text "A populated preview shows the relationship between product imagery, the recommendation, and its actions.", block: image — shopper-recommendations.png
  Right: label "Configuration", title "Decide what the result exposes", text "Result controls define the available actions and how product imagery is treated.", block: image — result-controls.png
Figures: browser · tabs · frame: bare — result-rules.png "Result configuration", result-one-product.png "One selected product", result-scroll.png "Multiple result sets"

Chapter — Appearance · Giving the experience a consistent visual treatment
Text: Theme settings sit beside the preview, covering typography, colours, backgrounds, buttons, and step transitions. Merchants can move between step types while working on the shared appearance, then save a theme. Close-ups keep these controls readable instead of reducing them to a thin sidebar in a full-window image.
Figures: browser · tabs · frame: bare — theme-settings.png "Theme selection", design-background.png "Background image", design-width.png "Button width", design-transition.png "Step transitions", theme-save.png "Save a theme"
         images — typography-closeup.png "Typography controls", colour-closeup.png "Colour controls"

Chapter — Shopper · Questions that fit the screen in front of them
Text: The shopper-facing examples include text choices, image options, phone and date inputs, and mobile forms. Progress, navigation, and the primary action stay close to the current task. Desktop and mobile examples show the range of layouts in the file; their different sample content is presented as examples rather than one continuous quiz.
Figures: browser · tabs · frame: bare — shopper-start.png "Opening question", shopper-image-desktop.png "Image choices", shopper-form.png "Phone input", shopper-date.png "Date input"
         device · frame: row — shopper-choice-mobile.png "Choices", shopper-image-mobile.png "Images" (long: shopper-image-mobile-full.png), shopper-form-mobile.png "Form"

Chapter — Cart · Connecting a recommendation to the next action
Text: Result-step settings include the number of recommendations and the actions available on each product. The screen set also contains individual cart actions and an add-all option. The mobile examples show a recommendation and its actions, with a separate close-up of the action at the end of the page.
Figures: browser · frame: bare — cart-settings.png
         device · tabs — shopper-results-mobile.png "Recommendations", shopper-cart-mobile.png "Cart actions"
         image — mobile-cart-controls.png

Chapter — Assistant · A second way to guide a shopper
Text: AskFlow also includes a conversational shopping experience. Its setup brings together store context, a greeting, personality, language, and visual settings, with a preview beside the configuration. The file includes multiple design iterations of these tools, showing both assistant behavior settings and its appearance within the store.
Figures: browser · tabs · frame: bare — chat-onboarding.png "Choose an experience", chat-workspace.png "Configure an assistant", chat-settings.png "Conversation settings", chat-design.png "Assistant settings"
         image — assistant-controls.png

Chapter — Knowledge · Configuring context and reviewing conversations
Text: An instruction screen combines a description of the assistant's role with a knowledge area for files and links. Conversation history gives the merchant a separate place to inspect individual exchanges, while embedding settings connect the configured assistant to a store. These views explain the management tools around the chat interface.
Figures: browser · tabs · frame: bare — chat-data-products.png "Instructions and knowledge", chat-logs.png "Conversation history", chat-embed.png "Embed the assistant"

Chapter — Integrations · Connecting the experience to other merchant tools
Text: Integrations appear both at workspace level and within a quiz. The designs distinguish connecting a service from configuring its use in a particular experience. A segmentation rule brings together product selection, a destination value, and a trigger condition, linking the quiz's configuration to the merchant's wider workflow.
Figures: browser · tabs · frame: bare — integrations-list.png "Available connections", integration-connected.png "Connected state", integration-quiz.png "Quiz integration settings", segmentation-rule.png "Segmentation rule"
         image — segmentation-closeup.png

Chapter — Publish · Checking the flow before it reaches the store
Text: Publishing includes validation for missing structure, such as an unset start step or an empty result. Each example states what is missing and offers a relevant next action. Publishing then opens format-specific configuration rather than one generic finish screen.
Figures: browser · tabs · frame: bare — publish-validation.png "Set the start step", publish-empty-result.png "Match result products", trial-first-publish.png "First publication", publish-options.png "Choose a format"
         image — validation-closeup.png

Chapter — Storefront · Choosing how the experience appears
Text: The publishing designs offer iframe, popup, and widget routes. Page placement and customisation settings let the merchant configure how an experience enters the store. Storefront examples show a quiz inside a popup and a widget beside the shopping content; mobile examples show the launcher in a smaller viewport.
Figures: browser · tabs · frame: bare — publish-settings.png "Choose a page", publish-embed.png "Iframe instructions", widget-customise.png "Widget placement", popup-store.png "Popup example", widget-store.png "Widget example"
         device · tabs — widget-mobile.png "Chat launcher", popup-mobile.png "Quiz launcher"

Chapter — Updates · Managing changes after publication
Text: The file includes saving, updating, restoration, and version-history states. These designs distinguish ongoing edits from the published experience and show how a merchant could inspect or return to a previous version. Some controls are marked as planned in the source, so these screens describe the designed workflow rather than establish release status.
Figures: browser · tabs · frame: bare — publish-history.png "Version history", publish-update.png "Publication actions", publish-restore.png "Restore the published version"

Chapter — Reporting · Looking across quizzes and conversations
Text: Reporting separates general activity, quizzes, and AI chats, with period selection and comparison controls. An empty overview provides the structure before activity is available. The sample figures are withheld here; the case focuses on what the reporting views organise and how merchants move between them.
Figures: browser · tabs · frame: bare — analytics.png "Overview", quiz-analytics.png "Quizzes", chat-analytics.png "AI chats", analytics-empty.png "Empty state"
         browser · tabs · frame: bare — analytics-date.png "Choose a period", analytics-period.png "Compare periods", advanced-analytics.png "Additional reporting design"

Chapter — Insights · Bringing the report back to the flow
Text: Quiz insights place activity information on the same question-and-answer structure used for building. Answer-level bars, drop-off detail, and version selection connect the report to a specific route through the quiz. Form-response and export views provide another level of inspection for steps that collect input.
Figures: browser · tabs · frame: bare — insights-map.png "Activity on a logic flow", insights-dropoff.png "Drop-off detail", insights-history.png "Version selection", form-responses.png "Form responses", form-export.png "Export choices"
         image — dropoff-closeup.png
Annotation: cursor · points: [40, 45], [52, 72] · note: "Inspect an answer within its route."

Chapter — Components · A shared language for a complex editor
Text: The supplied UI kit defines the recurring controls behind the experience: buttons, inputs, selection states, question and answer cards, navigation, and feedback. This section lets visitors try a small set of those pieces, connecting the system to the interactions already shown in the product.
Figures (implementation target; register the new demos specified below before rendering): components · askflow/button (wide), askflow/input, askflow/select, askflow/selection
         components · askflow/question-card, askflow/minimap

Chapter — Explorations · Ideas beyond the main workflow
Text: The wider file also contains concepts for AI suggestions alongside a question, statement steps, and variables. They show directions explored around the editor and are presented separately from the main product sequence.
Figures: browser · tabs · frame: bare — exploration-ai-suggestions.png "AI suggestions · concept", exploration-statement.png "Statement step · concept", exploration-variables.png "Variables · under review"

Chapter — Contribution · Designing within a shared product
Text: My role combined co-designing new app features with designing the marketing website. This case shows that work in its broader product context: the merchant tools, the shopper-facing interaction, the controls around publication, and the views used to review activity.

## Internal handoff — do not render on the website

### Editorial direction and page composition

- This replaces the earlier website-heavy AskFlow draft. Treat it as a flagship product case. The product journey leads; the website appears only in the second chapter and has exactly two media blocks: one responsive homepage and one finished-image gallery. Do not restore separate industry, support, tutorial, or blog chapters.
- Overview: three blocks, all centred on the product. Merchant app gallery, finished assistant presentation from the supplied article, and mobile shopper examples. The article image already contains a device; use `image`, without drawing another mockup around it.
- Keep the website examples compact and readable. `website-home.png` is a top viewport, not a miniature of the complete long page. `website-home-full.png` is retained as a source reference, not an extra public full-page block. Use only the two listed website figure blocks.
- Product figures deliberately vary: full browser views establish context; close-ups explain controls; Pair connects merchant settings and shopper output; phone rows expose multiple layouts; galleries preserve related states. Use the existing full-image viewer for inspecting the native assets.
- Tabs preserve the whole selected set. Do not silently reduce galleries to the first three images. Longer chapters can use the existing tab/player behavior, with meaningful short labels and lazy-loaded images. No new gallery pattern is required.
- The two cursor annotations are the limit for this case. Their purpose is to point to routing and drop-off detail. Adjust positions against the final layout; omit an annotation if it obstructs the UI.
- No `compare` slider is included: these sources do not establish a verified before/after redesign. The contrast between map, settings, and shopper output is explained through Pair and galleries.
- All images remain `sample`. The case should not expose internal source links, page names, status labels, masking notes, or this handoff to visitors.

### Scope, attribution and factual boundaries

- Confirmed by Oleh: **co-designer of new app features; designer of the marketing website**. He is not described as the sole product designer. The public feature explanations describe visible shared product behavior. Feature-level authorship, colleagues' contributions, dates, research, testing, decisions, release status, and measured results are not confirmed.
- The supplied article is an agency-level account. Its claims about branding, architecture, engineering, MVP delivery, commercial impact, and full-product ownership must not become first-person claims for Oleh. The public introduction and captions paraphrase only the basic product context, without importing those claims or copying the article's narrative.
- Do not invent test results, recommendation accuracy, conversion gains, user adoption, or usability improvements. Screenshots demonstrate design coverage, not that an AI system or backend was tested. There is no publishable outcome metric in this handoff.
- The complete app-page inventory was inspected. `page-coverage.json` records every page, visible desktop-frame counts, representative nodes, and new selections. It is a review record, not a claim that every frame was individually usability-tested or visually approved.
- Approved, new, in-progress, under-review, archived, prototype, and reference areas coexist in this file. Their labels do not prove release or authorship. Most public figures come from the approved-design grouping, but some frames within it still carry planned controls. The final Explorations chapter explicitly separates concepts; exclude it if the owner does not want exploratory work public.
- The source page called “Data sources / Products” currently renders a **New instruction** screen with role instructions and files/links. The packaged filename `chat-data-products.png` is retained for stable asset mapping; its public label is “Instructions and knowledge.” Do not claim it shows a product-ingestion workflow.
- `shopper-start.png` shows an opening question, not a dedicated welcome/start page. CMS choice shows platform options; it does not prove every named platform is implemented. An integration tile likewise does not establish that every connection was released.
- `advanced-analytics.png` is an additional reporting design from its own page, with older navigation. It is not a later step of the current overview or a verified improvement. Keep its alternative-design label.
- `publish-settings.png`, `publish-embed.png`, and storefront examples are different distribution routes. Do not sequence popup setup and iframe instructions as one continuous task. Version-history source screens contain a planned “Coming soon” control; public wording acknowledges designed rather than confirmed shipped behavior.
- Shopper examples use different sample quizzes, content, and products. Do not label desktop/mobile examples as pixel-matched responsive states or a single completed quiz. Some long mobile result sources contain missing lower product imagery; use only the populated first viewport and the dedicated cart-control close-up in the public Cart chapter. Retain their full partners for internal source review, without wiring those two files to `long()` or the public viewer. Replace incomplete lower imagery before any later full-length presentation. The complete image-choice and mobile website partners may use `long()` as listed.
- `scoring.png` remains reference-only. The source selection does not substantiate scoring weight controls or recommendation quality. Do not create a scoring chapter from the page name alone.

### Live components — required implementation specification

The Components chapter is an implementation target in this Markdown handoff. The demos below are **new**, not existing registered components. The website implementer must build and register them before adding the two `components` grids. Until then, keep this chapter out of the rendered route; do not show a broken demo, fake “Interactive” label, or substitute a giant component-sheet gallery. The exported kit boards are developer references and visual QA material.

Shared source styling:
- UI-kit file: `EJZsdGoGO1ZRgqWxXx0JnI`. The inspected controls use **Inter**, with Regular, Medium, and Semi Bold styles. Button text samples are 12, 14, and 16 px depending on size; source input samples use 14 px labels and 16 px values. Reinspect exact component dimensions and style bindings when implementing.
- Inspected primary default button fill: `#2563EB`; inspected question surface: `#F9FAFB`; answer default surface: `#FFFFFF`. These are sampled component values, not a complete token inventory. Read the supplied colour and typography foundations for all other values; do not substitute portfolio tokens or invent a global theme.
- Every demo: semantic controls, visible focus, keyboard operation, reduced motion, labelled state changes, and focus return after a menu or dialog. Portfolio sound switch gates click/toggle/key/erase/open/close and success/error cues; avoid duplicate cues. No backend, real product data, external service calls, or persistent merchant changes.

New component: `askflow/button`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=1-386
  Frame: stage; wide in the grid; content-fit height.
  Tabs: Primary · Secondary · Ghost · Toolbar · Link · Toolbar - Highlighted.
  Behaviour: real-size button; pointer hold shows Active; keyboard focus shows Focused; click temporarily shows Loading then returns to Default. A labelled Disabled control toggles the disabled state. Destructive and size options belong inside the frame rather than extra global tabs.
  Source variants: Size Xs / Sm / Md / Lg; State Default / Hover / Active / Loading / Focused / Disabled; Destructive False / True. Use existing combinations only, without assuming a full Cartesian set.
  Sounds: click and one local completion cue; disabled produces no action.
  Reference: kit-buttons.png.

New component: `askflow/input`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=44-344
  Frame: stage.
  Tabs: none.
  Behaviour: one labelled sample field with help text; focus and typing change its state. A local Validate action shows Error for empty input and Success for non-empty input, then permits correction. A labelled Disabled control is available. Make clear this is a portfolio demo, not real verification.
  Source variants: Size Default / Small; State Default / Hover / Focused / Error / Success / Disabled.
  Sounds: key / erase; one success or error cue after local validation.
  Reference: kit-inputs.png.

New component: `askflow/select`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=486-2162
  Frame: stage.
  Tabs: none.
  Behaviour: open a short neutral sample menu, move through options with the keyboard, select one, and reopen or clear. Escape closes and returns focus to the trigger. One menu level only.
  Source variants: Size Default / Small; State Default / Open / Selected.
  Sounds: open / close / click, gated by the portfolio switch.
  Reference: kit-dropdown.png.

New component: `askflow/selection`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=302-562
  Frame: stage.
  Tabs: none.
  Behaviour: two sample product checkboxes and a parent checkbox demonstrate unchecked, checked, and mixed selection; include a disabled example. Use Space to toggle. State remains local.
  Source variants: Size Default / Sm; Checked True / False; Disabled False / True; Mixed? False / True. Implement supported source combinations.
  Sounds: toggle.
  Reference: kit-selection.png.

New component: `askflow/question-card`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=1477-912
  Answers: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=1474-381
  Frame: stage.
  Tabs: Builder · Insights, matching the kit's Insights? False / True.
  Behaviour: one populated neutral question with two answers; edit one answer inline and use a labelled control to reveal its connection affordance. The Insights tab adds clearly labelled illustrative bars without real merchant data. No full editor, infinite canvas, or backend. If an extra local bar state is needed, document it as demo behavior rather than inventing a Figma variant.
  Source variants: Question State Default / Ghost. Answer State Default / Hover / Active / Filled / Filled/Hover, with Color? and Insights? flags. Preserve supported source combinations.
  Sounds: key / erase / click; one toggle cue when changing the local view.
  References: kit-questions.png / kit-answers.png; routing-closeup.png supplies populated product context.

New component: `askflow/minimap`
  Figma: https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=2025-662
  Frame: stage.
  Tabs: none.
  Behaviour: toggle the minimap open and closed over a tiny three-card sample map; select a miniature card to highlight its matching card in the stage. Provide keyboard buttons for the same selections. One level deep, with no full pan/zoom editor.
  Source variants: Open? True / False.
  Sounds: open / close / click.
  Reference: kit-minimap.png.

Optional product-interaction demos, additional to the system grid:
- A two-card logic connection using https://www.figma.com/design/FjWV5Lv3MnBErouY1resCW/Fourmeta-%7C-AskFlow-App?node-id=21321-27011 and rule dialog https://www.figma.com/design/FjWV5Lv3MnBErouY1resCW/Fourmeta-%7C-AskFlow-App?node-id=21362-95783. Stage; Tabs none; connect with pointer or equivalent keyboard button, open one rule dialog, close and return focus. No full builder. Use source tokens and shared sound/accessibility requirements above. Static fallback: logic-step.png / logic-rule.png.
- A local product picker using https://www.figma.com/design/FjWV5Lv3MnBErouY1resCW/Fourmeta-%7C-AskFlow-App?node-id=11538-35405. Stage; Tabs none; neutral sample catalogue, search, one expandable variant group, checkboxes and selection summary. No real catalogue, prices, network, or external save. Shared source styling, sound and accessibility requirements apply. Static fallback: product-match.png / product-selected.png.

### Assets, crops and source quality

- Deliver `askflow.md` and `askflow-images.zip`. The ZIP contains the expanded Figma selection, three selected article compositions, close-ups, native long partners, component reference boards, contact sheets, `asset-manifest.json`, `page-coverage.json`, and `article-provenance.json`.
- The manifest is authoritative for actual dimensions, source file keys/node IDs, article URLs, crops, local masking, sample status, and reference-only assets. Figma images are native 1×; no artificial 2× upscale. Article images retain their supplied resolution, even where below the template's preferred width.
- All supplied source files were read only. Text and bitmap masks are local to these exports. Re-exporting from Figma may restore client names, personal information, prices, or sample metrics. Keep the masked assets when implementing.
- Chrome is removed where the source contains it. Use `frame: bare`; no invented address and no second browser bar. Some source UI labels are old or inconsistent; page grouping does not reconcile different product iterations.
- Store-connection images are focused panel crops, excluding the surrounding store-account bitmap. Storefront header bitmaps are withheld. The rest of the storefront imagery is sample context, not a claim that the depicted store is a verified client.
- Reference-only/incomplete sources are not public figures: `scoring.png`, `product-result-editor.png`, `result-design.png`, `result-global.png`, `shopper-results.png`, `shopper-variants.png`, `shopper-cart.png`, `chat-preview.png`, `ai-loading.png`, and `kit-icons.png`. Crops such as `result-controls.png` use the usable part of those sources. Do not restore the blank imagery or place the sparse icon sheet into the public case.
- `exploration-code.png` is an archived code-editor reference, excluded from the public exploration gallery. The source does not establish a current custom-code feature. Emails, billing history, privacy/legal pages, competitor/reference boards and collaborator working pages were inventoried for coverage but are not presented as Oleh's shipped work.
- Component boards are references, not public component-sheet galleries. They also contain older placeholders or analytics values; masks do not make them proof of production data. Do not publish metrics from any board or screen.
- Some sample content remains inconsistent: image choices do not always match captions, some result previews have incomplete images, and chat-log examples include generic support conversations. Replace placeholders in the source before a publication export; do not claim these examples prove recommendation relevance or AI answer quality.
- Confirm source variants, per-feature contribution and publication permission before changing `sample` to public. Unknown year, duration and outcome fields remain absent. Keep the case visually useful now without inventing those facts.

### Original resources supplied by Oleh — retain for receiving agents

1. [App table of contents](https://www.figma.com/design/FjWV5Lv3MnBErouY1resCW/Fourmeta-%7C-AskFlow-App?node-id=245-65378&t=lT5sf8XiEl1pnB1z-11) — file `FjWV5Lv3MnBErouY1resCW`, node `245:65378`.
2. [Website homepage](https://www.figma.com/design/R8i88pBO3DRstcyiMLKzgb/Fourmeta-%7C-AskFlow-Website?node-id=2001-21658&t=OqXr4usw7QkntHCv-11) — file `R8i88pBO3DRstcyiMLKzgb`, section `2001:21658`.
3. [Other website pages](https://www.figma.com/design/R8i88pBO3DRstcyiMLKzgb/Fourmeta-%7C-AskFlow-Website?node-id=4022-9763&t=OqXr4usw7QkntHCv-11) — same website file, section `4022:9763`.
4. [AskFlow UI kit](https://www.figma.com/design/EJZsdGoGO1ZRgqWxXx0JnI/UI-Kit-for-Askflow?node-id=2514-765) — file `EJZsdGoGO1ZRgqWxXx0JnI`, page `2514:765`; this page is a divider, with foundations and components on the following pages.
5. [Supplied project article](https://www.fourmeta.com/projects/askflow) — source for three presentation images and basic project context. Image URLs are preserved in `article-provenance.json`; the article describes agency-wide work and does not establish individual authorship.

Retain the original links exactly, including node IDs. The manifest and full-page inventory provide deeper navigation. Receiving agents still need authorised Figma access; these links are not automatic public portfolio links or permission grants.
