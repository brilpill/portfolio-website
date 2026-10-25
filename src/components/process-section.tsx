"use client";

import { useState } from "react";
import { processIntro, processSteps } from "@/content/portfolio-content";
import { ProcessSticker } from "./process-sticker";

/**
 * My process, laid out like a case slide: the layered sticker as the media (its Web / Mobile tabs centred
 * at the bottom of the stage) and the sticky details column, which explains each step for the selected format.
 */
export function ProcessSection() {
  const [mobile, setMobile] = useState(false);
  const format = mobile ? "mobile" : "web";

  return <section className="project-slide process-case" aria-labelledby="process-heading">
    <div className="project-layout">
      <div className="project-media" aria-label="My process, as a layered sticker">
        <figure className="case-media"><div className="case-stage process-case-stage"><ProcessSticker mobile={mobile} onMobileChange={setMobile} /></div></figure>
      </div>
      <aside className="project-info" aria-label="Process steps">
        <div className="project-story">
          <div className="project-overview">
            <h1 id="process-heading" tabIndex={-1} data-slide-heading>My process</h1>
            <p key={format} className="process-case-swap">{processIntro[format]}</p>
          </div>
          <ol className="process-case-steps">
            {processSteps.map((step, i) => <li key={step.name}>
              <span className="process-case-number">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2>{step.name}</h2>
                <p key={format} className="process-case-swap">{step[format]}</p>
              </div>
            </li>)}
          </ol>
        </div>
      </aside>
    </div>
  </section>;
}
