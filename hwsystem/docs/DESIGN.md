# Design System

## Principle

Target audience: installer with dirty hands on-site, and specifier checking certificates.

**Premium here = precision, information density, clarity. Not luxury lifestyle.**

**References by feel:** Festool, Hilti, Snickers Workwear, Bosch Professional. Not Apple, not SaaS landing.

---

## Typography

| Role | Font |
|------|------|
| Headings | `Inter Tight` (600) — tight, industrial |
| Body | `Inter` (400/500) |
| Numerics / SKU / specs | `JetBrains Mono` (500) — SKU must be recognizable instantly |

| Token | Size (desk/mob) | Line Height | Weight |
|-------|-----------------|-------------|--------|
| `display` | 56/40 | 1.05 | 600 |
| `h1` | 40/32 | 1.15 | 600 |
| `h2` | 28/24 | 1.25 | 600 |
| `h3` | 20/18 | 1.35 | 600 |
| `body` | 16 | 1.6 | 400 |
| `small` | 14 | 1.5 | 400 |
| `mono` | 14 | 1.4 | 500 |

**Sentence case everywhere.** No ALL CAPS except eyebrow labels (12px, tracking 0.08em).

---

## Colors (Tailwind Tokens)

```javascript
const colors = {
  ink:          '#101418',
  steel:        '#5A6673',
  mist:         '#9AA3AD',
  concrete:     '#F4F5F6',
  line:         '#E2E5E8',
  white:        '#FFFFFF',
  signal:       '#D93A1E',
  'signal-hover': '#BF3018',
  success:      '#1D7A4D',
  warning:      '#B8791B',
  danger:       '#C4342A',
};
```

> **Rule: Accent occupies < 5% of screen.** If you have 3 red buttons on one screen, you've failed.

---

## Spacing (4px base)

`1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32` → 4px…128px

- Sections: `py-20` mobile, `py-32` desktop
- Container: `max-w-[1280px]`, gutter 24px

---

## Radius

| Token | Value |
|-------|-------|
| `sm` | 4px — inputs, badges |
| `md` | 6px — buttons, cards |
| `lg` | 8px — modals |

> Nothing above 8px. Rounded corners are a soft signal; here we want instrumental.

---

## Elevation

No drop shadows by default. Separate with `border: 1px solid line`.

Shadow only on dropdown/modal: `0 8px 24px rgba(16,20,24,0.10)`.

---

## Buttons

| Variant | Style |
|---------|-------|
| `primary` | bg `signal`, text white, radius md, h-11, px-6, weight 500 |
| `secondary` | bg `ink`, text white |
| `outline` | border `line`, text `ink`, hover bg `concrete` |
| `ghost` | text `steel`, hover text `ink` |

All buttons:
- `transition: 150ms ease`
- Focus ring: 2px `signal`, offset 2px
- Disabled: opacity 40%, cursor not-allowed

---

## ProductCard (Most Important Component)

```
┌──────────────────────────────┐
│  [image, 4:3, object-contain, bg concrete]
│  SOMFY              ← eyebrow, 12px, steel
│  LT50 CSI 50/12     ← h3, ink
│  SKU: 1043523       ← mono, 13px, mist
│  50 Nm · Ø45 · 230V ← specs chips, 13px
│  ─────────────────────────────
│  £128.40 ex VAT     ← 20px, 600
│  or [ Log in for trade price ]
│  ● In stock · Next day   ← success dot
│  [ Add to basket ]
└──────────────────────────────┘
```

**Rules:**
- Border `line`, hover → border `ink`
- No scale, no shadow
- Specs always visible in card — installer chooses by specs, not photo

---

## Forms

- Label above field, 14px, weight 500, ink
- Input h-11, border `line`, focus border `ink` + ring
- Error: 13px `danger` below field, icon `alert-circle`
- Never placeholder as label
- Quote form: max 5 fields. Each additional field = -10% conversion.

---

## Icons

`lucide-react`, stroke 1.5, 20px inline / 24px standalone.

No emoji. No filled icons.

---

## Layout

- Grid: 12 columns, gap 24px
- Catalog: 4 columns desktop / 2 tablet / 1 mobile
- Sidebar filters desktop; bottom sheet drawer on mobile (**not** accordion in flow)
- Sticky: header (64px) + filter bar on catalog

---

## Animations

| Type | Spec |
|------|------|
| Entrance | `opacity 0→1`, `translateY 8px→0`, 300ms `ease-out`, `once: true` |
| Hover | 150ms, only `border-color` / `background` |

**Forbidden:** parallax, scroll-jack, counters, typewriter, stagger > 60ms, `whileInView` on every card separately

`prefers-reduced-motion` disables everything.

---

## Mobile is First-Class, Not Adaptation

Installer is on-site with one hand.
- Tap targets ≥ 44px
- Search accessible from every screen
- Price and availability visible without scroll

---

