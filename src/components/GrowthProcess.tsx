"use client";

import { useEffect, useRef, useState } from "react";
import "./GrowthProcess.css";

const steps = [
  {
    number: "01",
    title: "Research",
    description:
      "Understand the market, audience, offer, and friction before touching the ad account.",
    phase: "PHASE 01",
    icon: "research",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Turn insight into a focused channel, message, and measurement plan.",
    phase: "PHASE 02",
    icon: "strategy",
  },
  {
    number: "03",
    title: "Creative",
    description:
      "Build testable ideas designed for attention, clarity, and conversion.",
    phase: "PHASE 03",
    icon: "creative",
  },
  {
    number: "04",
    title: "Execution",
    description:
      "Launch, learn, and optimise with disciplined campaign operations.",
    phase: "PHASE 04",
    icon: "execution",
  },
  {
    number: "05",
    title: "Results",
    description:
      "Translate performance into clear decisions and the next growth phase.",
    phase: "PHASE 05",
    icon: "results",
  },
];

function StepIcon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "research":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="7.2" />
          <path d="m16 16 5 5" />
        </svg>
      );
    case "strategy":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.8 8.2-2.6 5-5 2.6 2.6-5z" />
        </svg>
      );
    case "creative":
      return (
        <svg {...common}>
          <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
          <path d="m19 14 1.2 3.1L23 18l-2.8 1-1.2 3-1.1-3-2.9-1 2.9-.9z" />
        </svg>
      );
    case "execution":
      return (
        <svg {...common}>
          <path d="m7 4 13 8-13 8z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20V7" />
          <path d="M2 20h21" />
        </svg>
      );
  }
}

export default function GrowthProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`growth-process ${visible ? "is-visible" : ""}`}
      aria-labelledby="growth-process-heading"
    >
      <div className="growth-process-inner">

        {/* SECTION HEADER */}
        <div className="growth-process-header">
          <div className="growth-heading">
            <span className="growth-eyebrow">
              <span className="eyebrow-line" />
              THE GROWTH PROCESS
            </span>

            <h2 id="growth-process-heading">
              Clarity at every
              <br />
              <span>stage of growth.</span>
            </h2>
          </div>

          <p className="growth-intro">
            A connected operating rhythm—from first insight
            to the next informed decision.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="growth-timeline">

          <div className="timeline-track">
            <div className="timeline-progress" />
          </div>

          <div className="growth-cards">
            {steps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <article
                  key={step.number}
                  className={`growth-card ${
                    isActive ? "active-card" : ""
                  }`}
                  style={{
                    transitionDelay: visible
                      ? `${550 + index * 190}ms`
                      : "0ms",
                  }}
                  tabIndex={0}
                  aria-current={isActive ? "step" : undefined}
                  onMouseEnter={() => setActiveStep(index)}
                  onFocus={() => setActiveStep(index)}
                >
                  <div className="card-top">
                    <span className="card-number">
                      {step.number}
                    </span>

                    <div className="card-icon">
                      <StepIcon name={step.icon} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>

                  <p className="card-description">
                    {step.description}
                  </p>

                  <div className="card-divider" />

                  <span className="phase-label">
                    {step.phase}
                  </span>
                </article>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
