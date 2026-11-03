/* eslint-disable @next/next/no-img-element */
import type { V5Mock } from "@/content/v5";

/** A home card's frame, drawn in the Figma's 477 × 269 units (--u in CSS) so it scales with the column. */
export function MockFrame({ mock, label }: { mock: V5Mock; label: string }) {
  return (
    <div className="v5-mock" data-kind={mock.kind} role={mock.kind === "blank" ? undefined : "img"} aria-label={mock.kind === "blank" ? undefined : label}>
      {mock.kind === "phones" && mock.screens.map((layers, i) => <Phone key={i} layers={layers} slot={i} />)}
      {mock.kind === "laptop" && <Laptop screen={mock.screen} />}
      {mock.kind === "hotshots" && <HotShots />}
    </div>
  );
}

/** iPhone 16 Plus, light titanium (Figma 1249:34683). */
function Phone({ layers, slot }: { layers: string[]; slot: number }) {
  return (
    <div className="v5-phone" data-slot={slot}>
      <i className="v5-phone-btn" data-b="1" /><i className="v5-phone-btn" data-b="2" /><i className="v5-phone-btn" data-b="3" /><i className="v5-phone-btn" data-b="4" />
      <div className="v5-phone-frame" />
      <div className="v5-phone-glass" />
      <div className="v5-phone-screen">{layers.map(src => <img key={src} src={src} alt="" loading="lazy" />)}</div>
      <img data-t-trace-skip className="v5-phone-island" src="/v5/sprite/island.svg" alt="" width={44.751} height={12.498} />
      <span className="v5-phone-time">9:41</span>
      <img data-t-trace-skip className="v5-phone-icons" src="/v5/sprite/status-icons.svg" alt="" width={30.399} height={5.241} />
    </div>
  );
}

/** MacBook Pro M4, space black (Figma 1249:34806). */
function Laptop({ screen }: { screen: string }) {
  return (
    <div className="v5-laptop">
      <div className="v5-laptop-bezel" />
      <div className="v5-laptop-display" />
      <div className="v5-laptop-border" />
      <div className="v5-laptop-screen"><img src={screen} alt="" loading="lazy" /></div>
      <img data-t-trace-skip className="v5-laptop-outline" src="/v5/sprite/mac-display-outline.svg" alt="" width={325.477} height={222.897} />
      <img data-t-trace-skip className="v5-laptop-divider" src="/v5/sprite/mac-divider.png" alt="" width={325} height={9} />
      <img data-t-trace-skip className="v5-laptop-camera" src="/v5/sprite/mac-camera.svg" alt="" />
      <div className="v5-laptop-body">
        <img data-t-trace-skip className="v5-laptop-base" src="/v5/sprite/mac-body.png" alt="" width={399} height={15} />
        <span data-t-trace-skip className="v5-laptop-light" data-l="middle"><img src="/v5/sprite/mac-middle-light.svg" alt="" /></span>
        <i className="v5-laptop-hard" />
        <span data-t-trace-skip className="v5-laptop-light" data-l="bottom"><img src="/v5/sprite/mac-bottom-light.svg" alt="" /></span>
        <img data-t-trace-skip className="v5-laptop-seam" src="/v5/sprite/mac-body-divider.svg" alt="" />
      </div>
      <img data-t-trace-skip className="v5-laptop-notch" src="/v5/sprite/mac-notch.svg" alt="" />
      <img data-t-trace-skip className="v5-laptop-notch" src="/v5/sprite/mac-notch-details.svg" alt="" />
      <img data-t-trace-skip className="v5-laptop-stand" data-side="l" src="/v5/sprite/mac-stand-l.svg" alt="" />
      <img data-t-trace-skip className="v5-laptop-stand" data-side="r" src="/v5/sprite/mac-stand-r.svg" alt="" />
    </div>
  );
}

/** Row art and widths of the HotShots corner pattern, top to bottom (Figma 1249:35030). */
const PATTERN: [number, number][] = [[0, 134.932], [0, 134.932], [1, 134.932], [1, 134.932], [0, 134.932], [2, 120.365], [3, 105.798], [4, 91.232], [5, 76.665], [6, 76.665], [6, 76.665], [7, 62.099], [8, 47.532], [8, 47.532], [8, 47.532], [9, 32.965], [9, 32.965]];

/** HotShots Labs logotype between two corner patterns (Figma 1249:34895). */
function HotShots() {
  const pattern = (corner: string) => (
    <div className="v5-hs-pattern" data-corner={corner}>
      {PATTERN.map(([row, width], i) => <img data-t-trace-skip key={i} src={`/v5/sprite/row-${row}.svg`} alt="" style={{ width: `calc(${width} * var(--u))` }} />)}
    </div>
  );
  return (
    <>
      <div className="v5-hs-logo">
        <img className="v5-hs-word" src="/v5/sprite/hotshots.svg" alt="" />
        <div className="v5-hs-row">
          <img className="v5-hs-labs" src="/v5/sprite/hotshots-labs.svg" alt="" />
          <img className="v5-hs-flag" src="/v5/sprite/hotshots-flag.svg" alt="" />
        </div>
      </div>
      {pattern("bl")}
      {pattern("tr")}
    </>
  );
}
