"use client";

import { services } from "@/content/portfolio-content";
import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { ArrowCounterClockwiseIcon, ArrowRightIcon, BracketsCurlyIcon, CheckIcon, CodeIcon, DeviceMobileIcon, EnvelopeSimpleIcon, MonitorIcon, StackIcon } from "@phosphor-icons/react";

export const stages = [
  { name: "Understand", detail: "Brief, people & purpose", title: "Start with the right question.", description: "What are we helping someone do? I collect the context, map the important tasks, and decide what the product needs to make easier.", output: "A clear problem and a focused flow." },
  { name: "Structure", detail: "Flows & wireframes", title: "Give the idea a structure.", description: "I work through the flow before polishing the screens. Wireframes help me check the hierarchy, find missing states, and make the next step obvious.", output: "A flow that makes sense before the styling." },
  { name: "Explore", detail: "UI directions & experiments", title: "Try a few ways forward.", description: "I explore layout, type, color, and interaction together. Comparing a few directions helps me choose what fits the product and its audience.", output: "A visual direction with a reason behind it." },
  { name: "Refine", detail: "Components, states & feel", title: "Make the details work together.", description: "The chosen direction becomes reusable components, responsive screens, and the states in between. Motion is part of the interaction, not a final decoration.", output: "An interface that looks and feels consistent." },
  { name: "Build", detail: "Code, test & iterate", title: "Build it the way it was designed.", description: "I work with coding agents to turn the design into a working interface, then check it in the browser. I test the responsive behavior, interactions, and the details that can get lost in a handoff.", output: "A working experience, ready to test and improve." },
];

export function StageArtifact({ stage, mobile }: { stage: number; mobile: boolean }) {
  if (stage === 0) return <div className="process-artifact process-brief"><span className="process-artifact-kicker">THE STARTING POINT</span><strong>Make room for<br />what matters.</strong><div className="process-note-row"><span>Who is it for?</span><span>What gets in the way?</span></div><div className="process-flow"><span>Arrive</span><ArrowRightIcon size={12} /><span>Find</span><ArrowRightIcon size={12} /><span>Do</span></div></div>;
  if (stage === 1) return <div className="process-artifact process-wireframe"><div className="process-mini-header"><span>Product / Wireframe</span><span>01</span></div><div className="process-wire-title" /><div className="process-wire-line" /><div className="process-wire-layout"><div className="process-wire-box" /><div><div className="process-wire-box" /><div className="process-wire-line" /><div className="process-wire-line short" /></div></div><div className="process-wire-action" /></div>;
  if (stage === 2) return <div className="process-artifact process-explore"><span className="process-artifact-kicker">VISUAL EXPLORATION</span><div className="process-direction"><span>Aa</span><strong>A little more<br />clarity.</strong></div><div className="process-swatches"><span /><span /><span /><span /></div><div className="process-explore-caption">Type · Color · Rhythm</div></div>;
  if (stage === 3) return <div className="process-artifact process-finished"><div className="process-mini-header"><span><span className="process-mini-mark" />Daylight</span><span>Today</span></div><strong>Space for your day.</strong><span className="process-artifact-subtitle">A little focus goes a long way.</span><div className="process-task"><span className="process-task-check"><CheckIcon size={10} /></span><span>Start with one good idea</span><span>01</span></div><div className="process-task"><span className="process-task-check empty" /><span>Make something thoughtful</span><span>02</span></div><div className="process-finished-footer"><span>{mobile ? "Your day, in your pocket." : "Less noise. More room to think."}</span><span className="process-mini-cta">Let’s begin<ArrowRightIcon size={11} /></span></div></div>;
  return <div className="process-artifact process-code"><div className="process-mini-header"><span><CodeIcon size={12} />experience.tsx</span><span>REACT</span></div><code><span className="process-code-comment">{'// From idea to interaction'}</span><br /><span className="process-code-purple">{'function '}</span>{'Experience() {'}<br />{'  return ('}<br />{'    '}<span className="process-code-green">{'<Product'}</span><br />{'      '}<span className="process-code-purple">{'view'}</span>{'="'}{mobile ? "mobile" : "web"}{'"'}<br />{'      '}<span className="process-code-purple">{'thoughtfullyBuilt'}</span><br />{'    '}<span className="process-code-green">{'/>'}</span><br />{'  );'}<br />{'}'}</code></div>;
}

export function ProcessSlide({ onContact }: { onContact: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState(3);
  const [mobile, setMobile] = useState(false);
  const stage = stages[selected];
  const selectStage = (index: number) => { setSelected(index); setExpanded(true); };

  return (
    <section className="process-slide" aria-labelledby="process-heading">
      <header className="process-header">
        <div className="process-title-row"><div><span className="process-eyebrow">AN INTERFACE, TAKEN APART</span><h1 id="process-heading" data-slide-heading tabIndex={-1}>My process</h1></div></div>
        <div className="process-header-actions"><span className="process-study-label">Interactive study</span><Button variant="quiet" size="icon" aria-label="Contact Oleh" onClick={onContact}><EnvelopeSimpleIcon aria-hidden /></Button></div>
      </header>
      <div className="process-workspace">
        <div className="process-demonstration">
          <div className="process-view-switch" role="group" aria-label="Example format"><button aria-pressed={!mobile} onClick={() => setMobile(false)}><MonitorIcon size={15} aria-hidden />Web</button><button aria-pressed={mobile} onClick={() => setMobile(true)}><DeviceMobileIcon size={15} aria-hidden />Mobile</button></div>
          <div className="process-scene" data-expanded={expanded} data-format={mobile ? "mobile" : "web"} role="group" aria-label="Exploded process layers">
            {stages.map((item, index) => (
              <div className="process-layer" key={item.name} style={{ "--layer-index": index } as CSSProperties} data-selected={selected === index}>
                <button className="process-layer-label" tabIndex={expanded ? 0 : -1} aria-hidden={!expanded} aria-label={`Explore ${item.name.toLowerCase()} stage`} aria-pressed={selected === index} onClick={() => selectStage(index)}><span>{String(index + 1).padStart(2, "0")}</span><span>{item.name}<small>{item.detail}</small></span><i aria-hidden /></button>
                <button className={`process-plane process-plane-${index}`} tabIndex={expanded || index === 3 ? 0 : -1} aria-hidden={!expanded && index !== 3} aria-label={`${item.name} layer`} aria-pressed={selected === index} onClick={() => selectStage(index)}><span aria-hidden="true"><StageArtifact stage={index} mobile={mobile} /></span></button>
              </div>
            ))}
          </div>
          <div className="process-scene-footer"><span>One idea. Five layers of work.</span><Button variant="secondary" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="process-stage-details">{expanded ? <StackIcon data-icon="inline-start" aria-hidden /> : <BracketsCurlyIcon data-icon="inline-start" aria-hidden />}{expanded ? "Assemble" : "Explore layers"}</Button></div>
          <p className="process-sample-note">Sample interface for this interaction study.</p>
        </div>
        <aside className="process-explanation" id="process-stage-details" aria-label="Process explanation">
          <span className="process-detail-count">{String(selected + 1).padStart(2, "0")} / 05</span>
          <div className="process-detail-copy" key={selected} aria-live="polite"><h2>{stage.title}</h2><p>{stage.description}</p><span className="process-output-label">THE OUTPUT</span><p className="process-output">{stage.output}</p></div>
          <div className="process-stage-picker" role="group" aria-label="Choose process stage">{stages.map((item,index)=><button key={item.name} onClick={()=>selectStage(index)} aria-pressed={selected===index}><span>{String(index+1).padStart(2,"0")}</span>{item.name}<span className="process-stage-indicator" aria-hidden /></button>)}</div>
          <Button variant="quiet" className="process-reset" onClick={() => {setSelected(3);setMobile(false);setExpanded(true);}}><ArrowCounterClockwiseIcon data-icon="inline-start" aria-hidden />Reset view</Button>
        </aside>
      </div>
      <section className="process-services"><span className="content-kicker">Services · Working draft</span><h2>Where I can help.</h2><div className="service-list">{services.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    </section>
  );
}
