/**
 * Live component demos in case studies (`kind: "component"`): the source file of each, read on the server when the
 * case page builds and shown in the block's Code tab, so the code is always what runs. Ids match `demos` in
 * demos.tsx. Paths are relative to src/cases, the published demo folder.
 */
export const demoFiles: Record<string, string> = {
  "luminasset/system-size-slider": "luminasset/demos/system-size-slider.tsx",
  "luminasset/estimate": "luminasset/demos/estimate.tsx",
  "luminasset/estimate-sheet": "luminasset/demos/estimate-sheet.tsx",
  "luminasset/site-survey": "luminasset/demos/site-survey.tsx",
  "luminasset/button": "luminasset/components/button.tsx",
  "luminasset/variables": "luminasset/tokens.ts",
  "luminasset/tokens-phone": "luminasset/tokens.ts",
  "askflow/logic-jump": "askflow/demos/logic-jump.tsx",
  "askflow/product-picker": "askflow/demos/product-picker.tsx",
  "tutor-iq/calendar": "tutor-iq/demos/kit.tsx",
  "tutor-iq/classroom-toolbar": "tutor-iq/demos/kit.tsx",
};
