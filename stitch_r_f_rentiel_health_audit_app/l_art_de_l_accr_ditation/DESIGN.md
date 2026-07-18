---
name: L'Art de l'Accréditation
colors:
  surface: '#fff8f0'
  surface-dim: '#e0d9cf'
  surface-bright: '#fff8f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e9'
  surface-container: '#f4ede3'
  surface-container-high: '#eee7dd'
  surface-container-highest: '#e8e2d8'
  on-surface: '#1e1b15'
  on-surface-variant: '#4f4442'
  inverse-surface: '#33302a'
  inverse-on-surface: '#f7f0e6'
  outline: '#817472'
  outline-variant: '#d3c3c0'
  surface-tint: '#6f5955'
  primary: '#6f5955'
  on-primary: '#ffffff'
  primary-container: '#f3d6d0'
  on-primary-container: '#715c57'
  inverse-primary: '#dcc0bb'
  secondary: '#536253'
  on-secondary: '#ffffff'
  secondary-container: '#d3e4d1'
  on-secondary-container: '#576757'
  tertiary: '#50616a'
  on-tertiary: '#ffffff'
  tertiary-container: '#cddfea'
  on-tertiary-container: '#52636c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f9dcd6'
  primary-fixed-dim: '#dcc0bb'
  on-primary-fixed: '#271814'
  on-primary-fixed-variant: '#56423e'
  secondary-fixed: '#d6e7d4'
  secondary-fixed-dim: '#bacbb9'
  on-secondary-fixed: '#111f13'
  on-secondary-fixed-variant: '#3c4a3c'
  tertiary-fixed: '#d3e5f0'
  tertiary-fixed-dim: '#b7c9d4'
  on-tertiary-fixed: '#0c1e26'
  on-tertiary-fixed-variant: '#384952'
  background: '#fff8f0'
  on-background: '#1e1b15'
  surface-variant: '#e8e2d8'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.15em
  annotation:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
This design system bridges the rigorous world of medical accreditation with a sophisticated, human-centric aesthetic. The brand personality is institutional yet gentle, evoking the meticulous care of a scholar’s sketchbook combined with the structured elegance of Art Deco.

The design style is a hybrid of **Pastel Art Deco** and **Sketchbook Marginalia**. It utilizes symmetrical geometric motifs—fans, sunbursts, and arches—to provide a sense of stability and order required for official audits. This structure is softened by tactile, hand-drawn elements like pencil cross-hatching, organic arrows, and annotated notes, creating a UI that feels approachable, calm, and "analog" rather than cold and clinical.

## Colors
The palette is rooted in a "Cream & Pastels" theme, designed to reduce auditor fatigue and evoke a sense of heritage.
- **Base (#FAF3E9):** A warm cream paper texture used for the canvas of the application.
- **Primary (#F3D6D0):** A soft blush used for highlights and primary branding elements.
- **Functional Pastel Tones:** Used specifically for the A/B/C/D scoring system:
    - **A-cote (Success):** Sage (#CBDCC9) represents full conformity.
    - **B-cote (Info):** Powder Blue (#CFE1EC) represents minor improvements.
    - **C-cote (Accent):** Soft Gold (#E3C98F) represents moderate non-conformity.
    - **D-cote (Alert):** Dusty Rose (#D98E86) represents critical non-conformity.
- **Text (#4A433D):** Warm Graphite, providing high contrast without the harshness of pure black.

## Typography
The typographic hierarchy emphasizes clarity and rhythmic spacing. 
- **Headlines:** Use **Plus Jakarta Sans** for its rounded, geometric properties. All headers are set in **Small Caps** with generous tracking to mimic Art Deco signage.
- **UI & Body:** **Source Sans 3** provides a clean, neutral, and highly legible foundation for dense audit data and institutional reports.
- **Annotations:** **Be Vietnam Pro** is used sparingly for "marginalia" (tips, side-notes, or auditor comments), styled with a slightly informal, hand-annotated feel.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain the "page-like" quality of a physical audit sketchbook. 
- **Structure:** 12-column grid with wide 24px gutters. Content is centered with significant "white space" (cream space) to the left and right.
- **Symmetry:** Alignment is strictly symmetrical in the Art Deco tradition, particularly for headers and domain emblems.
- **Mobile Adaption:** For tablets and mobile, the 12-column grid collapses to a single column, and margins are reduced to 16px. Large headers scale down to 24px (headline-md).
- **Rhythm:** Spacing between sections is generous (48px+) to allow the pencil-sketch marginalia to sit comfortably in the gutters.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Graphic Line-work** rather than traditional drop shadows.
- **Surfaces:** Cards and panels use a slightly lighter or darker tint of the cream base (#FAF3E9) to differentiate layers.
- **Borders:** Instead of blurs, depth is indicated by **"Pencil-Sketch" Borders**—thin, 1px graphite lines that may appear slightly imperfect or doubled in corners.
- **Overlays:** Modals use a soft backdrop blur (3px) combined with a semi-transparent cream tint to maintain the sketchbook feel.

## Shapes
The shape language is a mix of high-geometry and organic softness.
- **Cards & Inputs:** Use a 0.5rem (8px) radius for a gentle, approachable feel.
- **Scoring Buttons:** Use full-pill (rounded-xl) shapes to distinguish them as interactive, tactile elements.
- **Motifs:** Geometric shapes (fans, arches) are used as decorative containers for domain icons.

## Components
- **Audit Cards:** Soft cream backgrounds with 1px graphite sketch-borders. A small sunburst motif is embossed in the top-right corner of the card to indicate section completion.
- **Scoring Buttons (A/B/C/D):** Distinctly colored pills. When active, they gain a "pencil-circled" stroke—a hand-drawn graphite ring that surrounds the button.
- **Domain Emblems:** Seven custom icons (Fan, Sunburst, Arch, Laurel, Wave, Chevron, Radiating Dots) rendered in single-weight graphite lines.
- **Sunburst Progress Dials:** Instead of a standard progress bar, a circular sunburst motif fills incrementally with a Sage (#CBDCC9) wash as audit criteria are met.
- **Input Fields:** Clean, underlined inputs (resembling a ledger) with small-caps labels.
- **Lists:** Audit checklists use hand-drawn "X" or "Check" marks for selection, moving away from standard digital checkboxes.