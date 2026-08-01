---
name: LiveLeaf
description: A peaceful, distraction-free personal block editor and knowledge workspace.
colors:
  primary: "#1f683a"
  primary-dark: "#267a46"
  neutral-bg: "#ffffff"
  neutral-dark-bg: "#1d2024"
  neutral-fg: "#2b2824"
  neutral-dark-fg: "#ebeced"
  surface-muted: "#f5f4f0"
  border-subtle: "#ededeb"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  sm: "3.6px"
  md: "4.8px"
  lg: "6px"
  xl: "8.4px"
  2xl: "10.8px"
  3xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-fg}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "#181614"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card-bento:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.3xl}"
    padding: "32px"
---

# Design System: LiveLeaf

## Overview

**Creative North Star: "The Editorial Sanctuary"**

LiveLeaf's visual language is an editorial sanctuary for deep focus, research, and quiet writing. It balances the timeless weight of classical print typography with modern SaaS speed and responsiveness. Built on high-contrast black-and-white fundamentals with a subtle Forest Emerald primary accent (`oklch(0.38 0.16 150)`), every interface element feels tactile, intentional, and uncluttered.

The interface eliminates visual noise, glowing AI badges, and unnecessary controls. Whitespace is used generously to separate thoughts, while subtle borders and soft background tones establish clear visual boundaries without heavy shadows.

**Key Characteristics:**
- **Editorial Serif Display**: Newsreader font paired with clean Inter body text for an authentic literary feel.
- **Deep Emerald Accent**: Used sparingly for high-value active states, checkmarks, and focus indicators.
- **Quiet Depth**: Flat-by-default surfaces with soft inset borders and subtle hover elevation.
- **Micro-Interaction Precision**: Spring physics and hover animations that react instantly without sluggish lag.

## Colors

The palette relies on pure paper whites, slate charcoal dark modes, and an understated Forest Emerald accent.

### Primary
- **Forest Emerald** (`#1f683a` / `oklch(0.38 0.16 150)`): Used for primary active states, selection highlights, checkmarks, and focus rings.

### Neutral
- **Paper White** (`#ffffff` / `oklch(1 0 0)`): Primary background for light mode pages and cards.
- **Ink Charcoal** (`#2b2824` / `oklch(0.158 0.010 60)`): High-contrast primary text color for light mode.
- **Muted Surface** (`#f5f4f0` / `oklch(0.965 0.006 80)`): Background for sidebars, inline code tags, and subtle card containers.
- **Slate Charcoal** (`#1d2024` / `oklch(0.172 0.005 265)`): Primary background for dark mode surfaces.
- **Subtle Border** (`#ededeb` / `oklch(0.930 0.005 80)`): Subtle 1px border stroke separating containers and sections.

### Named Rules
**The Rarity Rule.** The Forest Emerald primary accent is used on ≤5% of any given screen. Its rarity is what gives active states clear visual gravity.

## Typography

**Display Font:** Newsreader (serif, Google Fonts)
**Body Font:** Inter (sans-serif)
**Label/Mono Font:** Geist Mono (monospace)

**Character:** The pairing of Newsreader display headlines with Inter body text creates an editorial, literary atmosphere while preserving maximum scanability for long-form notes.

### Hierarchy
- **Display** (Regular 400, `clamp(2.5rem, 5vw, 4.5rem)`, `line-height: 1.1`): Hero headlines and landing title copy.
- **Headline** (Regular 400, `2.25rem`, `line-height: 1.25`): Document title headers and major section titles.
- **Title** (SemiBold 600, `1.25rem`, `line-height: 1.35`): Card headers and sidebar section labels.
- **Body** (Regular 400, `1rem`, `line-height: 1.8`, max line length `65–75ch`): Main writing canvas text, paragraph copy, and note content.
- **Label** (Medium 500, `0.75rem`, `letter-spacing: 0.1em`, uppercase): Eyebrow text, badge pills, word counters, and code tags.

## Layout

LiveLeaf uses a centered, single-column container structure for reading surfaces (`max-w-3xl` for document writing, `max-w-5xl` for Bento grids, `max-w-7xl` for overall page layout). Spacing follows a 8px rhythm scale (`8px`, `16px`, `24px`, `32px`, `64px`).

## Elevation & Depth

Surfaces are flat at rest. Depth is established through 1px subtle border strokes (`border border-border/50`) and tonal surface shifts (`bg-card`, `bg-muted/20`).

### Shadow Vocabulary
- **Card Hover** (`box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1)`): Appears on Bento card hover transitions.
- **Popover Floating** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1)`): Floating Tiptap Bubble Menu and search dropdown dialogs.

### Named Rules
**The Flat-By-Default Rule.** Surfaces remain flat at rest. Shadows appear strictly in response to interactive states (hover, drag elevation, popovers).

## Shapes

Forms use clean, soft radii. Standard UI elements use `rounded-lg` (8px) or `rounded-xl` (10.8px), while container Bento cards use `rounded-3xl` (24px) for a soft modern container silhouette.

## Components

### Buttons
- **Shape:** `rounded-lg` (8px)
- **Primary:** Dark background (`#2b2824`), white text (`#ffffff`), padding `12px 24px`.
- **Hover:** Darker background shift (`#181614`), subtle scale transform (`group-hover:translate-x-1` on arrows).

### Cards / Bento Containers
- **Corner Style:** `rounded-3xl` (24px)
- **Background:** `bg-card` (`#ffffff` light, `#23272d` dark)
- **Border:** `border border-border/50`
- **Internal Padding:** `32px` (`p-8`)

### Inputs / Fields
- **Style:** Height `38px`, `rounded-lg` (8px), border `border-input`.
- **Focus:** `border-ring`, `box-shadow: 0 0 0 3px oklch(0.38 0.16 150 / 25%)`.

### Navigation
- **Header Nav:** Centered navigation links (`Product`, `Organize`, `Search`, `Features`) positioned between Leaf logo and CTA action buttons.

## Do's and Don'ts

### Do:
- **Do** use Newsreader serif font for major display headlines and editorial section titles.
- **Do** maintain generous vertical whitespace (`py-24`) around major sections.
- **Do** use `Geist Mono` for status badges, keyboard shortcuts (`⌘K`), and word counter statistics.

### Don't:
- **Don't** use glowing green AI pills, animated icon rotations, or cheap hover color shifts.
- **Don't** add heavy drop shadows to rest states. Keep surfaces flat until interacted with.
- **Don't** mix multiple accent colors. Forest Emerald is the sole accent.
