# Focus Companion — Design System (Swiss / International Style)

## Design Principles
- **Objective Clarity:** Content is king. No unnecessary decoration.
- **Mathematical Grid:** All spacing and layout follow a strict, asymmetric grid structure.
- **Typographic Dominance:** Meaning is conveyed through weight, size, and strict sans-serif hierarchy.
- **Flush Left, Ragged Right:** Text is highly readable, left-aligned, never justified.
- **Sharp Geometry:** No rounded corners. Interfaces are built with precise, sharp rectangles.

## Color Palette

### Brand Colors (Pastel Accents)

| Role | Hex |
|------|-----|
| **Soft Mint** | `#90d27f` |
| **Pastel Blue** | `#95b8dc` |
| **Soft Coral** | `#e87982` |
| **Pale Green** | `#bdd6a4` |
| **Dusty Blue** | `#91aac6` |
| **Light Pink** | `#ffa3ac` |
| **Leaf Green** | `#76b363` |
| **Periwinkle** | `#84a4db` |

### Color Strategy
**Swiss Functionalism with Pastel Color Fields** — Colors are used as large, flat geometric fields (backgrounds) or functional signals. Typography remains high-contrast (strict Black `#1a1a1a` on light colors, White on dark). No gradients, no shadows, no blurs. Pure flat colors.

## Typography

**Single Family:** Inter (or Helvetica/Neue Haas Grotesk if available).
**Alignment:** Flush-left, ragged-right exclusively.
**Styling:** High contrast between weights. Never use italics for decoration.

| Scale | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| xs | 0.75rem (12px) | 400 | 1.4 | Captions, metadata, utility |
| sm | 0.875rem (14px) | 400 | 1.5 | Body, UI labels |
| base | 1rem (16px) | 400 | 1.5 | Body text, standard content |
| lg | 1.25rem (20px) | 500 | 1.4 | Subheadings |
| xl | 2rem (32px) | 700 | 1.1 | Section headings, strong hierarchy |
| 2xl | 3rem (48px) | 700 | 1.0 | Display, Hero (tight tracking) |

## Layout & Spacing (The Grid)

Spacing is strictly mathematical, based on a 4px/8px modular grid. Layouts should be asymmetric, utilizing strong vertical alignment lines.

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | 0.25rem (4px) | Micro adjustments |
| `--space-2` | 0.5rem (8px) | Tight component spacing |
| `--space-4` | 1rem (16px) | Standard grid gutter |
| `--space-8` | 2rem (32px) | Macro spacing, block separations |
| `--space-12` | 3rem (48px) | Section breaks |
| `--space-16` | 4rem (64px) | Page margins |

## Geometry & Borders

**Radius:** `0px` for all elements. Swiss design relies on strict horizontal and vertical lines. Cards, buttons, and inputs must have sharp 90-degree corners.
**Borders:** Use solid, thin lines (`1px` or `2px`) to define structure where necessary, or rely entirely on high-contrast color blocks.

## Motion

**Brutal and Instant** — Swiss design is static and print-inspired.
- Avoid slow, sweeping, or elastic animations.
- Use instant state changes (0ms) or extremely fast fades (`100ms`).
- Motion should only communicate functional state changes (on/off, open/close).

## Z-Index Scale

| Layer | Value |
|-------|-------|
| base | 0 |
| dropdown | 50 |
| sticky | 100 |
| modal-backdrop | 200 |
| modal | 300 |
| toast | 400 |
| tooltip | 500 |
