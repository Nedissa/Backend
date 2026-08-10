# Projektdetaljsida Relume-wireframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the styled `Frontend/apps/frontend/app/tjanster/projekt/[slug]/page.tsx` project detail page with a Relume neutral-style wireframe (gray-scale, placeholder visuals, real Swedish copy) following the approved design in `docs/historik/2026-08-10-projektdetalj-relume-wireframe-design.md`.

**Architecture:** Extract each of the 9 wireframe sections into small, focused presentational components under a new `app/tjanster/components/wireframe/` directory, each taking typed props derived from the existing `Project` type in `projekt-data.ts`. The page component composes them in order and handles the conditional rendering (tech-stack section, hero CTA). No new data fields, no client-side interactivity beyond what `ProjectNav` already provides — every wireframe component is a plain server component.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS (no Framer Motion, no custom CSS files — utility classes only, per Relume neutral style).

---

## Verification approach

This is a static wireframe with no existing test suite for this route (per spec: "Ingen automatiserad testsvit för denna route"). Each task's verification step is: run `npm run build` (or `npm run lint`) to catch type/syntax errors, then visually confirm via dev server + browser screenshot using the `chrome-devtools` MCP tools, per `CLAUDE.md`'s standing instruction to verify frontend changes visually before reporting done. The final task does a full visual pass across two projects (one with `website`+`technologies`, one without) to confirm conditional rendering.

---

### Task 1: Shared wireframe primitives

**Files:**
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/WireframePrimitives.tsx`

- [ ] **Step 1: Write the primitives file**

```tsx
import type { ReactNode } from 'react';

export function WireframeSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-24 lg:py-32 ${className}`}>
      <div className="max-w-[1440px] mx-auto w-full px-12 box-border">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-3.5 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-medium text-neutral-600 uppercase tracking-widest w-fit">
      {children}
    </span>
  );
}

export function ImagePlaceholder({
  label,
  aspect = 'aspect-video',
  className = '',
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`${aspect} bg-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 font-mono text-sm text-center px-4 ${className}`}
    >
      [{label}]
    </div>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold rounded-full no-underline hover:bg-neutral-700 transition-colors"
    >
      {children}
    </a>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-neutral-900 text-sm font-semibold rounded-full border border-neutral-300 no-underline hover:bg-neutral-100 transition-colors"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors referencing `WireframePrimitives.tsx`

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add apps/frontend/app/tjanster/components/wireframe/WireframePrimitives.tsx
git commit -m "feat: add Relume wireframe primitive components"
```

---

### Task 2: Hero and Metrics sections

**Files:**
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/HeroWireframe.tsx`
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/MetricsWireframe.tsx`

- [ ] **Step 1: Write `HeroWireframe.tsx`**

```tsx
import type { Project } from '../../projekt-data';
import { WireframeSection, Eyebrow, ImagePlaceholder, PrimaryButton, SecondaryButton } from './WireframePrimitives';

export function HeroWireframe({ project }: { project: Project }) {
  const bodyText = project.challenge ?? project.description.slice(0, 180);

  return (
    <WireframeSection className="pt-36">
      <div className="flex flex-col items-start text-left gap-4">
        <Eyebrow>Projektöversikt · {project.category}</Eyebrow>

        <h1 className="text-[clamp(32px,5vw,64px)] font-bold tracking-tight leading-none text-neutral-900 m-0">
          {project.title} — {project.year}
        </h1>

        <p className="text-base leading-relaxed text-neutral-600 max-w-[60ch] m-0">{bodyText}</p>

        <div className="flex flex-wrap gap-3 pt-4">
          {project.website && (
            <PrimaryButton href={`https://${project.website}`}>Besök live-sida ↗</PrimaryButton>
          )}
          <SecondaryButton href="/tjanster#projekt">Se alla projekt</SecondaryButton>
        </div>

        <div className="w-full pt-10">
          <ImagePlaceholder label={`${project.title} - Hero Showcase - 16:9`} aspect="aspect-video" />
        </div>
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 2: Write `MetricsWireframe.tsx`**

```tsx
const PLACEHOLDER_METRICS = [
  { value: '[XX]', label: 'veckor leveranstid' },
  { value: '[XX]', label: 'sidor byggda' },
  { value: '[XX]%', label: 'snabbare laddtid' },
  { value: '[XX]', label: 'integrationer' },
];

import { WireframeSection } from './WireframePrimitives';

export function MetricsWireframe() {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {PLACEHOLDER_METRICS.map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <span className="text-[clamp(28px,3vw,40px)] font-bold tracking-tight text-neutral-900">
              {m.value}
            </span>
            <span className="text-sm text-neutral-600">{m.label}</span>
          </div>
        ))}
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 3: Verify it compiles**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors referencing `HeroWireframe.tsx` or `MetricsWireframe.tsx`

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add apps/frontend/app/tjanster/components/wireframe/HeroWireframe.tsx apps/frontend/app/tjanster/components/wireframe/MetricsWireframe.tsx
git commit -m "feat: add wireframe hero and metrics sections"
```

---

### Task 3: Alternating Utmaningen/Lösningen/Resultatet sections

**Files:**
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/AlternatingSection.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { WireframeSection, Eyebrow, ImagePlaceholder } from './WireframePrimitives';

export function AlternatingSection({
  eyebrow,
  heading,
  text,
  imageLabel,
  imageFirst,
}: {
  eyebrow: string;
  heading: string;
  text: string;
  imageLabel: string;
  imageFirst: boolean;
}) {
  return (
    <WireframeSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {imageFirst && <ImagePlaceholder label={imageLabel} aspect="aspect-[4/3]" />}
        <div className="flex flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight leading-[1.1] text-neutral-900 m-0">
            {heading}
          </h2>
          <p className="text-sm leading-[1.7] text-neutral-600 m-0">{text}</p>
        </div>
        {!imageFirst && <ImagePlaceholder label={imageLabel} aspect="aspect-[4/3]" />}
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors referencing `AlternatingSection.tsx`

- [ ] **Step 3: Commit**

```bash
cd Frontend
git add apps/frontend/app/tjanster/components/wireframe/AlternatingSection.tsx
git commit -m "feat: add alternating challenge/solution/result wireframe section"
```

---

### Task 4: Tech-stack, gallery, quote, and CTA+nav sections

**Files:**
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/TechStackWireframe.tsx`
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/GalleryWireframe.tsx`
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/QuoteWireframe.tsx`
- Create: `Frontend/apps/frontend/app/tjanster/components/wireframe/CtaNavWireframe.tsx`

- [ ] **Step 1: Write `TechStackWireframe.tsx`**

```tsx
import { WireframeSection } from './WireframePrimitives';

export function TechStackWireframe({ technologies }: { technologies: string[] }) {
  if (technologies.length === 0) return null;

  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 m-0">Verktyg &amp; plattform</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-neutral-100 border border-neutral-200 rounded-full text-sm font-medium text-neutral-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 2: Write `GalleryWireframe.tsx`**

```tsx
import type { ProjectStep } from '../../projekt-data';
import { WireframeSection, ImagePlaceholder } from './WireframePrimitives';

const FALLBACK_LABELS = ['Skrivbordsvy', 'Mobilvy', 'Detaljvy'];

export function GalleryWireframe({ steps }: { steps?: ProjectStep[] }) {
  const labels = steps && steps.length > 0 ? steps.map((s) => s.title) : FALLBACK_LABELS;

  return (
    <WireframeSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePlaceholder label={labels[0]} aspect="aspect-[4/3]" className="md:row-span-2" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
          {labels.slice(1).map((label) => (
            <ImagePlaceholder key={label} label={label} aspect="aspect-video" />
          ))}
        </div>
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 3: Write `QuoteWireframe.tsx`**

```tsx
import { WireframeSection } from './WireframePrimitives';

export function QuoteWireframe({ quote, projectTitle, category }: { quote: string; projectTitle: string; category: string }) {
  return (
    <WireframeSection className="border-t border-neutral-200">
      <div className="max-w-[600px] mx-auto flex flex-col gap-4 items-center text-center">
        <span className="text-4xl leading-none text-neutral-300">&ldquo;</span>
        <p className="text-lg leading-[1.65] text-neutral-800 m-0">{quote}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-11 h-11 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600 text-sm font-mono">
            [Foto]
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-neutral-900">[Kundnamn]</div>
            <div className="text-xs text-neutral-500">{projectTitle} · {category}</div>
          </div>
        </div>
      </div>
    </WireframeSection>
  );
}
```

- [ ] **Step 4: Write `CtaNavWireframe.tsx`**

```tsx
import Link from 'next/link';
import { WireframeSection, PrimaryButton } from './WireframePrimitives';

export function CtaNavWireframe({
  prevSlug,
  nextSlug,
}: {
  prevSlug: string;
  nextSlug: string;
}) {
  return (
    <>
      <WireframeSection className="border-t border-neutral-200 text-center">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-[clamp(28px,3.5vw,40px)] font-bold tracking-tight text-neutral-900 m-0">
            Vill du ha samma resultat?
          </h2>
          <PrimaryButton href="/tjanster/kontakt">Boka möte</PrimaryButton>
        </div>
      </WireframeSection>

      <section className="border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto w-full px-12 box-border pt-10 pb-24 flex justify-between">
          <Link
            href={`/tjanster/projekt/${prevSlug}`}
            className="px-7 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold no-underline rounded-full"
          >
            ← Föregående
          </Link>
          <Link
            href={`/tjanster/projekt/${nextSlug}`}
            className="px-7 py-3 bg-neutral-900 text-neutral-50 text-sm font-semibold no-underline rounded-full"
          >
            Nästa →
          </Link>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Verify it compiles**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors referencing the four new files

- [ ] **Step 6: Commit**

```bash
cd Frontend
git add apps/frontend/app/tjanster/components/wireframe/TechStackWireframe.tsx apps/frontend/app/tjanster/components/wireframe/GalleryWireframe.tsx apps/frontend/app/tjanster/components/wireframe/QuoteWireframe.tsx apps/frontend/app/tjanster/components/wireframe/CtaNavWireframe.tsx
git commit -m "feat: add tech-stack, gallery, quote, and CTA/nav wireframe sections"
```

---

### Task 5: Compose the page

**Files:**
- Modify: `Frontend/apps/frontend/app/tjanster/projekt/[slug]/page.tsx` (full rewrite of the JSX body; `generateStaticParams` and `generateMetadata` stay unchanged)

- [ ] **Step 1: Replace the file contents**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PROJECTS } from '../../projekt-data';
import { ProjectNav } from '../../components/ProjectNav';
import { HeroWireframe } from '../../components/wireframe/HeroWireframe';
import { MetricsWireframe } from '../../components/wireframe/MetricsWireframe';
import { AlternatingSection } from '../../components/wireframe/AlternatingSection';
import { TechStackWireframe } from '../../components/wireframe/TechStackWireframe';
import { GalleryWireframe } from '../../components/wireframe/GalleryWireframe';
import { QuoteWireframe } from '../../components/wireframe/QuoteWireframe';
import { CtaNavWireframe } from '../../components/wireframe/CtaNavWireframe';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const title = `${project.title} — Webbprojekt`;
  const description = project.description.slice(0, 155);
  return {
    title,
    description,
    openGraph: { title, description, url: `https://techpilots.se/tjanster/projekt/${slug}`, ...(project.image ? { images: [{ url: project.image }] } : {}) },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://techpilots.se/tjanster/projekt/${slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main className="bg-neutral-50 text-neutral-900 relative">
      <ProjectNav />

      <HeroWireframe project={project} />

      <MetricsWireframe />

      {project.challenge && (
        <AlternatingSection
          eyebrow="Utmaningen"
          heading={`Utmaningen med ${project.title}.`}
          text={project.challenge}
          imageLabel={`${project.title} - Utmaningen - 4:3`}
          imageFirst
        />
      )}

      {project.solution && (
        <AlternatingSection
          eyebrow="Lösningen"
          heading="Lösningen vi byggde."
          text={project.solution}
          imageLabel={`${project.title} - Lösningen - 4:3`}
          imageFirst={false}
        />
      )}

      {project.result && (
        <AlternatingSection
          eyebrow="Resultatet"
          heading="Resultatet för kunden."
          text={project.result}
          imageLabel={`${project.title} - Resultatet - 4:3`}
          imageFirst
        />
      )}

      {project.technologies && <TechStackWireframe technologies={project.technologies} />}

      <GalleryWireframe steps={project.steps} />

      {project.solution && (
        <QuoteWireframe quote={project.solution} projectTitle={project.title} category={project.category} />
      )}

      <CtaNavWireframe prevSlug={prevProject.slug} nextSlug={nextProject.slug} />
    </main>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors

- [ ] **Step 3: Start dev server and visually verify**

Run: `cd Frontend/apps/frontend && npm run dev`
Then using chrome-devtools MCP tools, navigate to `http://localhost:3000/tjanster/projekt/sagateatern` (has `website` + `technologies`) and `http://localhost:3000/tjanster/projekt/pistolero-studio` (no `website`) and take screenshots.

Expected: All 9 sections render in gray-scale per spec; hero shows "Besök live-sida" button only for sagateatern; tech-stack section renders for both (both have `technologies` in current data) — confirm visually there's no broken layout, no leftover color/italic styling, no console errors (`mcp__chrome-devtools__list_console_messages`).

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add apps/frontend/app/tjanster/projekt/\[slug\]/page.tsx
git commit -m "feat: compose Relume wireframe project detail page"
```

---

### Task 6: Remove now-unused components (if confirmed unused)

**Files:**
- Check usages, then delete if unused: `Frontend/apps/frontend/app/tjanster/components/ServicesAccordion.tsx`
- Check usages, then delete if unused: `Frontend/apps/frontend/app/tjanster/components/ProjectMockups.tsx`

- [ ] **Step 1: Grep for other usages before deleting**

Run (from `Frontend/apps/frontend`): search for `ServicesAccordion` and `ProjectMockups` imports across `app/`.

Expected: no remaining imports outside the old page.tsx (already replaced in Task 5). If any other file still imports these, **do not delete** — leave them and note it instead.

- [ ] **Step 2: Delete confirmed-unused files**

```bash
cd Frontend/apps/frontend
rm app/tjanster/components/ServicesAccordion.tsx
rm app/tjanster/components/ProjectMockups.tsx
```

(Per `Frontend/apps/frontend/CLAUDE.md`: delete files one at a time after grep-confirming, not a bulk `rm -rf` of a directory — satisfied here since these are two specific files, individually grep-checked in Step 1.)

- [ ] **Step 3: Verify build still passes**

Run: `cd Frontend/apps/frontend && npm run lint`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
cd Frontend
git add -u apps/frontend/app/tjanster/components/ServicesAccordion.tsx apps/frontend/app/tjanster/components/ProjectMockups.tsx
git commit -m "chore: remove ServicesAccordion and ProjectMockups, unused after wireframe rewrite"
```

---

## Explicit non-goals (do not implement)

- No new listing page at `/tjanster/projekt/`.
- No new fields on the `Project` type or `projekt-data.ts` — metrics stay hardcoded placeholders.
- No color, motion, or Techpilots branding — that is a separate future brainstorming cycle.
- No changes to `ProjectsSection.tsx` (the embedded project list on `/tjanster`).
- No changes to `ProjectNav.tsx`.
