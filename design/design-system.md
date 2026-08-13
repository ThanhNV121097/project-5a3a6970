# Design System — Todo App

> Source of truth: the approved `index.html`.
> Every value below is extracted from it. Changing a value here without changing the approved design is a defect.

Last updated: 2026-08-13

## 1. Foundations

### 1.1 Color

Semantic tokens. Name by job, never by hue.

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#F8FAFC` | Page background, input/list/stat background |
| `--color-bg-tint-primary` | `#EFF6FF` | Hero wash, hover background, loading state, empty illustration |
| `--color-bg-tint-success` | `#ECFDF5` | Page gradient end |
| `--color-bg-success` | `#F0FDF4` | Completed todo item background |
| `--color-bg-danger` | `#FEF2F2` | Delete button and error state background |
| `--color-bg-danger-hover` | `#FEE2E2` | Delete hover, red badge background |
| `--color-bg-warning` | `#FEF3C7` | Warning badge background |
| `--color-bg-success-badge` | `#D1FAE5` | Success badge background |
| `--color-bg-primary-badge` | `#DBEAFE` | Badge and illustration background |
| `--color-surface` | `#FFFFFF` | Cards, nav, mini window, buttons on surface |
| `--color-surface-raised` | `#FFFFFF` | Dropdown menu on mobile |
| `--color-border` | `#DCE6F2` | Default border, divider |
| `--color-border-subtle` | `#E2E8F0` | Preview row border |
| `--color-border-primary-soft` | `#BFDBFE` | Eyebrow, loading state, empty illustration border |
| `--color-border-primary` | `#93C5FD` | Toggle empty border, clipboard clip border |
| `--color-border-success` | `#BBF7D0` | Completed todo border |
| `--color-border-danger` | `#FCA5A5` | Error state border |
| `--color-text` | `#0F172A` | Body text, headings, secondary button text |
| `--color-text-muted` | `#64748B` | Secondary text, helper text, completed task title |
| `--color-text-primary-strong` | `#1E40AF` | Loading state text |
| `--color-primary` | `#2563EB` | Primary action, checked state, focus color base, hero icon |
| `--color-primary-hover` | `#1D4ED8` | Primary button hover, blue badge text |
| `--color-primary-text` | `#FFFFFF` | Text on primary, checkmark on complete |
| `--color-success` | `#10B981` | Saved dot, completed toggle background |
| `--color-success-strong` | `#047857` | Green badge text |
| `--color-warning` | `#F59E0B` | Warning token source |
| `--color-warning-strong` | `#B45309` | Amber badge text |
| `--color-danger` | `#EF4444` | Danger token source |
| `--color-danger-text` | `#B91C1C` | Field error, delete button, red badge text |
| `--color-danger-strong` | `#991B1B` | Error state text |
| `--color-neutral-dot` | `#CBD5E1` | Mini window controls |
| `--color-neutral-panel` | `#F1F5F9` | Mini window bar |
| `--color-focus` | `rgba(37,99,235,.45)` | Focus ring |
| `--color-nav-surface` | `rgba(255,255,255,.82)` | Sticky nav background |
| `--color-card-surface` | `rgba(255,255,255,.94)` | Card background |
| `--color-hero-card-surface` | `rgba(255,255,255,.92)` | Hero preview card background |
| `--color-shadow` | `rgba(15,23,42,.12)` | Main card shadow |
| `--color-shadow-soft` | `rgba(15,23,42,.08)` | Nav shadow |
| `--color-shadow-primary` | `rgba(37,99,235,.25)` | Primary button shadow |
| `--color-shadow-primary-strong` | `rgba(37,99,235,.28)` | Logo shadow |
| `--color-orb-primary` | `rgba(37,99,235,.16)` | Decorative primary radial wash |
| `--color-orb-success` | `rgba(16,185,129,.16)` | Decorative success radial wash |
| `--color-success-halo` | `rgba(16,185,129,.14)` | Eyebrow dot halo |

#### Contrast audit

Every text-on-background pair actually used. Body text ≥ 4.5:1, large text (≥ 18.66px bold or ≥ 24px) ≥ 3:1, UI borders ≥ 3:1.

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-text` | `--color-bg` | `16.8:1` | AA |
| `--color-text` | `--color-surface` | `17.9:1` | AA |
| `--color-text-muted` | `--color-bg` | `4.7:1` | AA |
| `--color-text-muted` | `--color-surface` | `4.8:1` | AA |
| `--color-primary-text` | `--color-primary` | `5.2:1` | AA |
| `--color-primary-text` | `--color-primary-hover` | `6.7:1` | AA |
| `--color-primary` | `--color-bg-tint-primary` | `4.8:1` | AA |
| `--color-primary-hover` | `--color-bg-tint-primary` | `6.2:1` | AA |
| `--color-text-primary-strong` | `--color-bg-tint-primary` | `7.9:1` | AA |
| `--color-success-strong` | `--color-bg-success-badge` | `4.6:1` | AA |
| `--color-warning-strong` | `--color-bg-warning` | `4.7:1` | AA |
| `--color-danger-text` | `--color-bg-danger` | `6.4:1` | AA |
| `--color-danger-strong` | `--color-bg-danger` | `8.4:1` | AA |
| `--color-danger-text` | `--color-bg-danger-hover` | `5.8:1` | AA |
| `--color-text-muted` | `--color-bg-success` | `4.5:1` | AA |
| `--color-border-primary-soft` | `--color-bg-tint-primary` | `1.3:1` | FAIL for UI border |
| `--color-border` | `--color-surface` | `1.3:1` | FAIL for UI border |
| `--color-border-success` | `--color-bg-success` | `1.2:1` | FAIL for UI border |
| `--color-border-danger` | `--color-bg-danger` | `1.6:1` | FAIL for UI border |

### 1.2 Spacing

Base unit: `2px`. Most margins, padding, and gaps use these values.

| Token | Value |
|---|---|
| `--space-0` | `0px` |
| `--space-1` | `2px` |
| `--space-3` | `6px` |
| `--space-4` | `8px` |
| `--space-5` | `10px` |
| `--space-6` | `12px` |
| `--space-7` | `13px` |
| `--space-7-5` | `14px` |
| `--space-8` | `16px` |
| `--space-9` | `18px` |
| `--space-10` | `20px` |
| `--space-11` | `22px` |
| `--space-13` | `26px` |
| `--space-16` | `32px` |
| `--space-17` | `34px` |
| `--space-22` | `44px` |
| `--space-23` | `46px` |
| `--space-30` | `60px` |
| `--space-37` | `74px` |
| `--space-50` | `100px` |
|
One-off layout widths and sizes from mockup: `8px`, `10px`, `22px`, `34px`, `36px`, `76px`, `92px`, `120px`, `640px`, `820px`, `900px`, `1120px`, `calc(100% - 32px)`, `min(1120px,calc(100% - 32px))`.

### 1.3 Typography

Font families:

- Body: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Inter is named but not externally loaded; fallback system fonts render if Inter is unavailable.
- Headings: same as body.
- Mono: no monospace family used in approved design.

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--text-xs` | `12px` | inherited `1.5` | `900` | Badge text |
| `--text-sm` | `13px` | inherited `1.5` | `700` | Stat labels |
| `--text-helper` | `14px` | inherited `1.5` | `400`, `700` for errors | Helper and form error text |
| `--text-base` | `16px` | `1.5` | `400` | Body, form controls |
| `--text-card-title` | `18px` | inherited `1.5` | browser default bold / `700` | Small card heading and access-card strong |
| `--text-lede` | `20px` | inherited `1.5` | `400` | Hero lead paragraph |
| `--text-panel-title` | `22px` | inherited `1.5` | browser default bold | Todo panel h3 |
| `--text-stat` | `26px` | inherited `1.5` | browser default bold | Count values |
| `--text-section-title` | `32px` | inherited `1.5` | browser default bold | h2 section headings |
| `--text-hero-title` | `clamp(42px,7vw,76px)` | `.94` | browser default bold | h1 |

Heading levels are used in order: h1, h2, h3.

### 1.4 Radius, border, shadow, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-xs` | `8px` | Checkmark box, clipboard clip |
| `--radius-sm` | `10px` | Skip link, badge |
| `--radius-md` | `12px` | Logo, toggle task, delete button |
| `--radius-lg` | `16px` | Inputs, preview rows, stats |
| `--radius-xl` | `18px` | Todo item, state box |
| `--radius-2xl` | `20px` | Mobile dropdown |
| `--radius-card` | `22px` | Card, mini window |
| `--radius-hero` | `32px` | Hero card |
| `--radius-full` | `999px` | Navigation shell, nav links, pills, buttons |
| `--border-width` | `1px` | Default border |
| `--border-width-strong` | `2px` | Checkbox/toggle border |
| `--border-width-focus` | `3px` | Focus ring and spinner border |
| `--shadow-sm` | `0 10px 24px rgba(37,99,235,.28)` | Logo |
| `--shadow-md` | `0 14px 40px rgba(15,23,42,.08)` | Sticky nav |
| `--shadow-lg` | `0 16px 34px rgba(37,99,235,.25)` | Primary button |
| `--shadow-xl` | `0 22px 60px rgba(15,23,42,.12)` | Resting cards and mobile dropdown |
| `--duration-fast` | `.18s` | Button hover |
| `--duration-base` | `.2s` | Preview row hover |
| `--duration-enter` | `.28s` | Todo item entry |
| `--duration-hero` | `.65s` | Hero card entry |
| `--duration-load` | `.8s` | Spinner rotation |
| `--duration-save` | `350ms` | Saved status flash |
| `--duration-demo-load` | `650ms` | Demo loading delay |
| `--easing` | `ease` | Button, row, entry animation |
| `--easing-spinner` | `linear` | Spinner |

Motion respects `prefers-reduced-motion: reduce`: animations, transitions, and smooth scroll are removed.

### 1.5 Layout and breakpoints

| Name | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `base` | `0px` | `calc(100% - 32px)` capped at `1120px` | 1 | `16px` to `20px` |
| `md` | `820px` | `min(1120px,calc(100% - 32px))` | Hero switches from 1 to 2 columns above this | `34px` hero gap |
| `lg` | `900px` | `min(1120px,calc(100% - 32px))` | Todo layout and grids switch to multi-column above this | `16px` to `20px` |
| `xl` | `1120px` | `1120px` max shell | Same as lg | `16px` to `34px` |

Z-index scale (only these values are allowed):

| Layer | Value |
|---|---|
| Decorative background | `-1` |
| Base | `0` |
| Sticky header | `5` |
| Skip link | `10` |
| Dropdown | `5` via sticky header stacking context |
| Modal backdrop | Not used |
| Modal | Not used |
| Toast | Not used |

## 2. Components

### 2.1 Button and link button

**Purpose** — Trigger primary, secondary, retry, replay, and navigation actions. Do not use for non-actions.

**Anatomy** — `[label]` or `[label] [optional icon/check symbol]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Primary | `--color-primary`, `--color-primary-hover`, `--color-primary-text`, `--radius-full`, `--shadow-lg` | Main add/start action |
| Secondary | `--color-surface`, `--color-text`, `--color-border`, `--radius-full` | Replay, retry, supporting links |
| Danger compact | `--color-bg-danger`, `--color-danger-text`, `--color-bg-danger-hover`, `--radius-md` | Delete task |
| Mobile menu | `--color-bg-tint-primary`, `--color-primary`, `--radius-full` | Open/close nav links on mobile |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Standard pill | content height from padding | `13px 18px` | `--text-base` |
| Nav link | content height from padding | `9px 12px` | `--text-base` |
| Mobile menu | content height from padding | `9px 12px` | `--text-base` |
| Danger compact | content height from padding | `8px 10px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Variant colors render; pointer cursor on buttons | Variant tokens |
| Hover | Primary darkens; all `.btn` lift `translateY(-2px)`; delete background deepens | `--color-primary-hover`, `--color-bg-danger-hover`, `--duration-fast` |
| Focus (keyboard) | Visible 3px blue ring with 3px offset | `--color-focus`, `--border-width-focus` |
| Active / pressed | No separate pressed style in approved design | Existing default/hover tokens |
| Disabled | Not visually designed; if needed, use non-interactive state with same component footprint and muted text | `--color-text-muted`, `--color-border` |
| Loading | Not visually designed for buttons; surrounding status text handles loading | Loading state component tokens |
| Error | Retry button uses secondary variant inside error panel | `--color-bg-danger`, `--color-danger-strong` |
| Empty | Empty state copy points to add task button; button style unchanged | Primary or secondary tokens |

**Accessibility** — Use native `button` for actions and `a` only for navigation. Maintain visible focus. Minimum hit target should be 44×44px; standard buttons meet target by padding, danger compact relies on row context and should be kept easy to tap.

### 2.2 Text input

**Purpose** — Capture todo title. Do not use for search or multiline content without extending states.

**Anatomy** — `[label] [input] [helper text] [error text]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Standard | `--color-bg`, `--color-border`, `--color-text`, `--radius-lg` | Task title field |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Standard | content height from padding | `13px 14px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Pale background, 1px border | `--color-bg`, `--color-border` |
| Hover | No separate hover style | Default tokens |
| Focus (keyboard) | Background turns white; visible focus ring | `--color-surface`, `--color-focus` |
| Active / pressed | Same as focus while editing | Focus tokens |
| Disabled | Not visually designed | `--color-text-muted`, `--color-border` if later needed |
| Loading | Not applicable to field; form remains available in mockup | Default tokens |
| Error | Error text appears; `aria-invalid=true`; field keeps base border | `--color-danger-text` |
| Empty | Placeholder shows example task; empty submit reveals required error | `--color-text-muted`, `--color-danger-text` |

**Accessibility** — `label` uses `for`. Input uses `aria-describedby` for helper and error. Blank submission focuses field and sets `aria-invalid`.

### 2.3 Todo item

**Purpose** — Show one saved task with complete/uncomplete and delete actions.

**Anatomy** — `[toggle button] [task title] [delete button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Open | `--color-bg`, `--color-border`, `--color-text` | Task not complete |
| Done | `--color-bg-success`, `--color-border-success`, `--color-success`, `--color-primary-text`, `--color-text-muted` | Task complete |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Standard | content height from padding | `12px` row padding, `12px` gap | `--text-base` |
| Toggle | `34px` | none | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Open task has unchecked square and normal title | `--color-bg`, `--color-border`, `--color-text` |
| Hover | Row itself has no hover; delete button has hover | `--color-bg-danger-hover` |
| Focus (keyboard) | Toggle and delete show focus ring | `--color-focus` |
| Active / pressed | Toggle switches between open and done; delete removes row | Variant tokens |
| Disabled | Not visually designed | Use muted title and keep controls non-interactive if introduced |
| Loading | List-level loading replaces items | Loading state tokens |
| Error | List-level error replaces items | Error state tokens |
| Empty | Empty state replaces list | Empty state tokens |

**Accessibility** — Toggle and delete are native buttons with action-specific `aria-label` including task title. List uses `aria-live="polite"`.

### 2.4 Card and panel

**Purpose** — Group related UI: form, list, state cards, accessibility notes, hero preview. Do not use for every tiny text block.

**Anatomy** — `[optional heading] [body content] [optional actions]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Standard card | `--color-card-surface`, `--color-border`, `--radius-card`, `--shadow-xl` | Todo panels, state cards, access cards |
| Hero card | `--color-hero-card-surface`, `--radius-hero`, `--shadow-xl` | Main visual preview only |
| Mini window | `--color-surface`, `--color-border`, `--radius-card` | Embedded app preview |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Panel | content height | `22px` | `--text-base` |
| State/access card | content height | `20px` | `--text-base` |
| Hero card | content height | `22px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | White translucent surface, border, large shadow | Card variant tokens |
| Hover | No generic hover; preview rows inside can move | `--duration-base` |
| Focus (keyboard) | Cards are not focusable unless containing controls | N/A |
| Active / pressed | Not interactive | N/A |
| Disabled | Not interactive | N/A |
| Loading | Loading state box may sit inside card | Loading state tokens |
| Error | Error state box may sit inside card | Error state tokens |
| Empty | Empty state box may sit inside card | Empty state tokens |

**Accessibility** — Use semantic `section` or `article` with headings. Do not make entire card clickable when individual controls exist.

### 2.5 Navigation bar

**Purpose** — Give page anchors and mobile menu. Do not add multi-level navigation to this one-page app.

**Anatomy** — `[brand link with logo] [mobile menu button] [anchor links]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Desktop sticky pill | `--color-nav-surface`, `--color-border`, `--radius-full`, `--shadow-md` | Width above `820px` |
| Mobile dropdown | `--color-surface-raised`, `--color-border`, `--radius-2xl`, `--shadow-xl` | Width at or below `820px` |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Nav shell | content height | `12px 14px` | `--text-base` |
| Brand logo | `36px` | none | `--text-base` |
| Link | content height | `9px 12px` | `--text-base` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Sticky blurred pill with muted links | `--color-nav-surface`, `--color-text-muted` |
| Hover | Links gain blue-tint background and primary text | `--color-bg-tint-primary`, `--color-primary` |
| Focus (keyboard) | Link/menu button shows focus ring | `--color-focus` |
| Active / pressed | Mobile button toggles text between Menu and Close, links panel opens | `--color-surface-raised`, `--shadow-xl` |
| Disabled | Not designed | N/A |
| Loading | Not applicable | N/A |
| Error | Not applicable | N/A |
| Empty | Not applicable | N/A |

**Accessibility** — `nav` has `aria-label`. Mobile button uses `aria-expanded` and `aria-controls`. Escape closes menu. Brand link has descriptive `aria-label`.

### 2.6 Badge and status pill

**Purpose** — Label product state or category with short text. Do not use for long sentences.

**Anatomy** — `[optional dot] [label]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Eyebrow/status | `--color-bg-tint-primary`, `--color-border-primary-soft`, `--color-primary`, `--color-success` | Hero eyebrow, saved status |
| Blue | `--color-bg-primary-badge`, `--color-primary-hover` | Loading state label |
| Green | `--color-bg-success-badge`, `--color-success-strong` | Empty/success label |
| Amber | `--color-bg-warning`, `--color-warning-strong` | Validation label |
| Red | `--color-bg-danger-hover`, `--color-danger-text` | Error label |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Eyebrow | content height | `8px 12px` | `--text-base` |
| Badge | content height | `6px 10px` | `--text-xs` |
| Dot | `8px` | none | N/A |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Pill shape with variant colors | Variant tokens |
| Hover | No hover style; badges are not interactive | N/A |
| Focus (keyboard) | Not focusable unless wrapped in link/button | N/A |
| Active / pressed | Not interactive | N/A |
| Disabled | Not designed | N/A |
| Loading | Status text can read `Saving…` | Eyebrow tokens |
| Error | Use red badge variant | Red variant tokens |
| Empty | Use green badge variant when labeling empty state | Green variant tokens |

**Accessibility** — Decorative dot uses `aria-hidden="true"`. Status text that changes stays concise.

### 2.7 Loading, empty, and error state box

**Purpose** — Explain database state clearly before, during, or after loading. Do not leave list blank.

**Anatomy** — Loading: `[spinner] [status text]`. Empty: `[illustration] [title] [instruction]`. Error: `[title] [instruction] [retry button]`.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Loading | `--color-bg-tint-primary`, `--color-border-primary-soft`, `--color-text-primary-strong`, `--duration-load` | Fetch in progress |
| Empty | `--color-bg-tint-primary`, `--color-border-primary-soft`, `--color-text-muted` | No tasks saved |
| Error | `--color-bg-danger`, `--color-border-danger`, `--color-danger-strong` | Database unavailable |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| State box | content height | `18px` | `--text-base` |
| Spinner | `22px` | none | N/A |
| Empty illustration | `120px × 92px` | none | N/A |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Hidden until state applies | N/A |
| Hover | Retry button has secondary button hover only | Button tokens |
| Focus (keyboard) | Retry button shows focus ring | `--color-focus` |
| Active / pressed | Retry replays loading then success | Loading tokens |
| Disabled | Not designed | N/A |
| Loading | Spinner rotates and text says `Loading tasks from database…` | Loading tokens |
| Error | Red panel says `Could not load tasks.` and gives retry | Error tokens |
| Empty | Illustration plus `No tasks yet` and `Add one task to start.` | Empty tokens |

**Accessibility** — Loading uses `role="status"` and `aria-live="polite"`. Error uses `role="alert"`. Empty illustration has title and desc.

### 2.8 Stats summary

**Purpose** — Summarize total, open, and done task counts. Do not use for unrelated analytics.

**Anatomy** — `[count] [label]` repeated three times.

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Standard | `--color-bg`, `--color-border`, `--radius-lg`, `--color-text`, `--color-text-muted` | Task summary in add panel |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Stat tile | content height | `14px` | `--text-stat`, `--text-sm` |

**States**

| State | Visual change | Tokens |
|---|---|---|
| Default | Three equal columns with centered count and label | Standard tokens |
| Hover | No hover style | N/A |
| Focus (keyboard) | Not interactive | N/A |
| Active / pressed | Not interactive | N/A |
| Disabled | Not designed | N/A |
| Loading | Counts can read `0` while list loads in mockup | Standard tokens |
| Error | Counts keep last or zero values while error state shows | Standard tokens |
| Empty | Counts show `0` total, `0` open, `0` done | Standard tokens |

**Accessibility** — Container uses `aria-label="Task summary"`. Counts must update with list state.

## 3. Content and formatting

- Voice and tone: calm, practical, plain language focused on today’s tasks and clear next actions.
- Date, time, number, and currency formats: no dates, times, or currency appear; task counts use plain integers and pluralize `task` / `tasks` in English.
- Capitalization rule for buttons, headings, and labels: sentence case for headings and buttons (`Add task`, `Review states`, `Try again`); product name remains `Todo App`.
- Empty-state wording pattern: name missing content, then give one concrete next action (`No tasks yet`; `Add one task to start.`).
- Error-message wording pattern: name problem in one sentence, then give one retry or recovery instruction (`Could not load tasks.`; `Retry once network or database is available.`).
- Validation wording pattern: direct instruction tied to field (`Enter a task title before adding.`).

## 4. Known deviations

Places where the approved design does not follow its own rules or the anti-patterns in `references/ai-defaults.md`. Record, do not silently fix.

| Where | Deviation | Why it stands | Follow-up |
|---|---|---|---|
| Page background, logo, body pseudo-element | Decorative gradients and radial washes are used, while AI defaults recommend flat fills unless gradient has functional meaning. | Stakeholder approved calm blue/green visual treatment in mockup. | Keep for first build; revisit if product needs stricter utility feel. |
| Resting cards and mobile dropdown | `--shadow-xl` is strong on resting cards (`0 22px 60px rgba(15,23,42,.12)`), while defaults advise light/no shadows on resting surfaces. | Approved design uses soft floating cards as main visual hierarchy. | Reduce only if stakeholder requests flatter UI. |
| Radius scale | Many radius values exist (`8px`, `10px`, `12px`, `16px`, `18px`, `20px`, `22px`, `32px`, `999px`) instead of 3–4 steps. | Values are already present in approved CSS. | Consolidate in future redesign, not during documentation. |
| Spacing scale | Spacing uses many one-off values (`13px`, `14px`, `18px`, `22px`, `26px`, `34px`, `46px`, `74px`). | Values are already present in approved CSS. | Normalize spacing in future redesign. |
| Borders | Several UI borders fail 3:1 contrast (`#DCE6F2` on white, `#BFDBFE` on `#EFF6FF`, `#BBF7D0` on `#F0FDF4`, `#FCA5A5` on `#FEF2F2`). | Mockup relies on shadow, fill, and layout more than border contrast. | Increase border contrast during accessibility hardening if allowed. |
| Buttons | Disabled and loading button states are not visually specified. | Current one-page mockup has no disabled/loading buttons; loading is panel-level. | Add button-specific states if backend submission can be pending or disabled. |
| Text input | Error state sets `aria-invalid` and message but does not change field border color. | Approved design keeps field border stable and error copy visible. | Add danger border only if stakeholder wants stronger validation styling. |
| Font loading | `Inter` is listed first but not loaded. | Approved HTML is self-contained and uses system fallback if Inter is unavailable. | Load Inter in implementation only if brand fidelity matters. |

## 5. Change log

| Date | Change | Design PR |
|---|---|---|
| 2026-08-13 | Initial design system extracted from approved `index.html`. | This PR |
