# Gemini Notebook — Design System Guidance

## Context and goals

**Design intent:** Gemini Notebook must make dense notebook work calm, familiar, fast, and keyboard-accessible for authenticated users and operators.

This is the implementation contract for the dashboard web app. It was aligned to the provided Gemini Notebook reference: compact global header, notebook navigation, search, view controls, a primary **New notebook** action, and responsive notebook collections. Teams should prefer system consistency over local visual exceptions.

The dashboard must accommodate high interaction density: **98 buttons, 11 links, and 3 tables**, alongside navigation, search, grid/list views, filtering, and notebook creation.

## Design tokens and foundations

### Source tokens

Use source tokens only to establish the system. Components must consume semantic tokens, never raw values.

```css
:root {
  --font-family-primary: "Google Sans Flex", "Google Sans", sans-serif;
  --font-size-xs: 13px;
  --font-size-sm: 15px;
  --font-size-md: 16px;
  --font-size-lg: 24px;
  --font-weight-regular: 400;
  --line-height-base: 20px;

  --space-1: 1px;
  --space-2: 4px;
  --space-3: 6px;
  --space-4: 8px;
  --space-5: 12px;
  --space-6: 16px;

  --radius-xs: 50px;
  --radius-sm: 9999px;
  --motion-instant: 200ms;
  --motion-fast: 280ms;

  --palette-black: #000000;
  --palette-ink: #303030;
  --palette-muted-ink: #5e5e5e;
  --palette-canvas: #faf9f9;
  --palette-subtle: #f2f0f0;
  --palette-blue: #9dd2ff;
  --palette-border: #c4c7c5;
}
```

### Semantic tokens

```css
:root {
  --color-bg-canvas: var(--palette-canvas);
  --color-bg-surface: var(--palette-canvas);
  --color-bg-surface-subtle: var(--palette-subtle);
  --color-bg-selected: var(--palette-blue);
  --color-text-primary: var(--palette-ink);
  --color-text-secondary: var(--palette-muted-ink);
  --color-text-action: var(--palette-ink);
  --color-border-default: var(--palette-border);
  --color-focus-ring: var(--palette-ink);
  --color-state-disabled: var(--palette-muted-ink);
  --color-state-error: #b3261e;
  --color-text-on-error: #ffffff;

  --font-body: var(--font-family-primary);
  --text-label: var(--font-size-xs) / var(--line-height-base) var(--font-body);
  --text-body: var(--font-size-sm) / var(--line-height-base) var(--font-body);
  --text-title: var(--font-size-md) / 24px var(--font-body);
  --text-heading: var(--font-size-lg) / 32px var(--font-body);
  --focus-outline: 2px solid var(--color-focus-ring);
  --focus-offset: 2px;
}
```

- Components must use semantic tokens. Token values must pass the contrast requirements before use.
- The app must use `--font-body`; body text must use `--text-body`, metadata must use `--text-label`, and section headings must use `--text-heading`.
- Padding, gaps, and margins must use `--space-2` through `--space-6`. `--space-1` must be reserved for hairlines.
- Cards must use `--radius-xs`; pills, avatars, chips, and icon controls must use `--radius-sm`.
- Layout must retain at least `--space-6` inline gutter on narrow screens and must not create horizontal page scrolling.
- Direct feedback must complete within `--motion-instant`; transient enter/exit motion must complete within `--motion-fast`.
- With `prefers-reduced-motion: reduce`, non-essential motion must be removed and essential motion must resolve instantly.

## Component-level rules

Every component must define and implement these states:

| State | Required behavior |
| --- | --- |
| Default | Must show its normal semantic surface, label, and affordance. |
| Hover | Must provide a non-motion cue for fine pointers. |
| Focus-visible | Must show `--focus-outline` with `--focus-offset`; focus must never be hidden. |
| Active | Must remain visibly engaged while pressed or selected. |
| Disabled | Must prevent activation, communicate unavailable status, and retain readable contrast. |
| Loading | Must preserve layout, prevent duplicate actions, and expose progress text. |
| Error | Must preserve input where possible, identify the problem in text, and offer recovery. |

### App header and navigation

**Anatomy:** brand link, primary navigation, notebook search, utilities, account menu, and primary creation action.

- Navigation must use `<nav aria-label="Primary">` with a list of links.
- The current route must use `aria-current="page"` and a persistent non-color selected cue.
- Desktop navigation should remain visible until it conflicts with search or utilities, then must collapse into a labeled menu button.
- Menu triggers must use `aria-expanded`, move focus into the menu, and restore focus on close.
- `Tab` and `Shift+Tab` must follow visual order; `Escape` must close menus or popovers. Composite menus should support arrow-key navigation.
- Touch targets must be at least 44 × 44 CSS px. Long labels must wrap only when expanded; compact labels must truncate visually while retaining a programmatic full name.

### Buttons and icon buttons

**Variants:** primary creation, secondary, tertiary/text, destructive, icon-only.

- Buttons must use native `<button>` unless they navigate; navigation must use `<a>`.
- Buttons must have descriptive labels: “New notebook”, “Delete notebook”, or “Open settings”. Icon-only buttons must use `aria-label`.
- Primary creation must use `--color-bg-selected` and `--color-text-primary`. Secondary controls should use `--color-bg-surface-subtle` and a visible boundary when contrast requires it.
- Button spacing must use spacing tokens. Compact controls must still provide a 44 × 44 CSS px touch target.
- `Enter` and `Space` must activate buttons. Pointer press must show active state; touch must not depend on hover.
- Loading buttons must disable repeat submission and announce a concise name such as “Creating notebook”. Irreversible destructive actions must require confirmation.

### Search, fields, and filters

**Anatomy:** label, input, optional leading icon, clear action, help text, validation message, result summary.

- Inputs must have a persistent visible label or an associated visually hidden label. Placeholder text must not be the only label.
- Search must use `type="search"`, an accessible name such as “Search notebooks”, and a labeled clear action when populated.
- Filter menus must support keyboard operation, `Escape` closing, and focus return to the trigger.
- Invalid fields must use `aria-invalid="true"` and connect errors through `aria-describedby`.
- Long queries must scroll inside the input. On narrow screens, search must occupy its own row or a dedicated search view.
- Empty results must state the query and count, then offer one clear reset action.

### Notebook cards and lists

**Anatomy:** notebook icon/thumbnail, title, metadata, source count/status, selection or overflow action, optional state badge.

- Each card must expose one primary activation target. Nested controls must be separate labeled buttons and must not be descendants of a link.
- Peer collections must use `<ul>` and `<li>`; views with row/column data relationships must use a semantic table.
- Titles must use `--text-title`, metadata must use `--text-label`, and all spacing must use the spacing scale.
- Hover, focus-visible, and selected states must remain distinct. Selected state must include a non-color cue such as a checkmark, boundary, or correct `aria-selected` pattern.
- Overflow buttons must be keyboard reachable and include the notebook title in their accessible name when feasible.
- Responsive grids should use a minimum card width and must reflow to one column instead of causing horizontal scrolling.
- Grid titles must visually clamp to two lines and expose the complete name programmatically. List/table titles may wrap.
- Empty collections must explain the situation and offer “New notebook”. Loading must retain stable card dimensions; errors must retain context and offer “Try again”.

### Tables and dense management views

- Tables must use `<table>`, `<caption>`, `<thead>`, `<tbody>`, and correctly scoped headers.
- Sorting controls must be buttons within headers, must expose `aria-sort`, and must retain visible focus.
- At narrow widths, tables must reflow into labeled records or use a visible contained horizontal scroller. The page must not scroll horizontally.
- Row actions must be labeled and must not be hover-only. Empty, loading, and error states must state the affected collection.

### Menus, dialogs, and status feedback

- Menus must be button-triggered, support `Escape`, restore focus, and retain logical tab/arrow order.
- Dialogs must use native `<dialog>` or `role="dialog"`, `aria-modal="true"`, a programmatic title, focus containment, and focus restoration. Destructive dialogs must focus the least destructive viable action.
- Success updates must use `role="status"`; urgent failures should use `role="alert"` only when interruption is necessary.
- Toasts must not be the only location for actionable errors.

## Accessibility requirements and testable acceptance criteria

The app must meet WCAG 2.2 AA.

| Requirement | Pass condition |
| --- | --- |
| Keyboard operation | Every interactive element can be reached and operated using keyboard alone; there is no unintended keyboard trap. |
| Focus visibility | Every keyboard-focused control displays a visible 2px indicator with 2px separation from adjacent content. |
| Contrast | Normal text meets 4.5:1, large text meets 3:1, and essential controls, icons, boundaries, and focus indicators meet 3:1. |
| Target size | Every pointer target is at least 24 × 24 CSS px; primary and compact touch controls provide 44 × 44 CSS px or equivalent spacing. |
| Semantic names | Every control has a descriptive programmatic name; meaningful images have suitable text alternatives. |
| Forms | Every input has an associated label; errors are textual and expose `aria-invalid` plus a description. |
| Dynamic updates | Loading, result counts, success, and errors are announced once through correctly scoped live regions. |
| Zoom and reflow | At 400% zoom and 320 CSS px viewport width, content reflows without two-dimensional page scrolling or lost actions. |
| Motion | Reduced-motion preference removes non-essential animation without hiding meaning. |

Automated accessibility checks must run in CI for critical routes. Manual keyboard, screen-reader, zoom/reflow, and contrast checks must happen before release.

## Content and tone standards

Use concise, confident, task-first language.

- Labels must name the object or result: “New notebook”, “Search notebooks”, “Manage sources”, “Delete notebook”.
- Labels must not use vague phrases such as “Click here”, “Submit”, “More”, or context-free “Continue”.
- Empty states should state the situation in one sentence, then offer the next action.
- Errors must name the failure, preserve useful context, and offer recovery.

| Situation | Use | Do not use |
| --- | --- | --- |
| Create | “New notebook” | “Add” |
| Empty state | “No notebooks yet. Create one to begin adding sources.” | “Nothing here.” |
| Search miss | “No notebooks match ‘biology’. Clear search.” | “No results.” |
| Failure | “We couldn’t load your notebooks. Try again.” | “Error 500.” |
| Destructive action | “Delete notebook” | “Remove” |

## Anti-patterns and prohibited implementations

- Components must not consume raw palette values; they must consume semantic tokens.
- Interfaces must not hide outlines or replace focus indicators with hover-only styling.
- Cards must not be a clickable surface containing interactive descendants.
- Icons must not be the only accessible label for unfamiliar or destructive actions.
- Controls must not be hover-only; placeholders must not be the sole field label.
- Disabled buttons must not be the only explanation for unavailable actions.
- Page-level horizontal scrolling must not be introduced for dense data views.
- Errors must not rely on color, motion, or transient toast alone.
- One-off type, space, radius, or color exceptions must not be introduced for local layout fixes.

### Migration notes

1. Replace raw component colors with semantic token references.
2. Replace clickable `div` elements with native buttons or anchors.
3. Consolidate custom buttons, cards, and inputs into documented variants.
4. Add focus-visible rules before removing legacy outlines.
5. Validate keyboard operation and 400% zoom after each migration.

## QA checklist

- [ ] The page has one `<h1>` and a logical heading hierarchy.
- [ ] Components use semantic color, spacing, typography, radius, and motion tokens.
- [ ] Every interactive component implements default, hover, focus-visible, active, disabled, loading, and error behavior.
- [ ] Every control has a descriptive visible or programmatic name.
- [ ] Keyboard order is logical; `Escape` closes menus and dialogs.
- [ ] Focus is visible, not clipped, and restored after overlays close.
- [ ] Text and non-text contrast pass the stated thresholds.
- [ ] Touch interactions meet target-size requirements.
- [ ] Grid, list, and table views work at 320 CSS px and 400% zoom with no page-level horizontal scrolling.
- [ ] Long content, empty states, loading, and errors have been tested.
- [ ] Reduced motion has been tested.
- [ ] Automated and manual accessibility checks pass for changed workflows.
