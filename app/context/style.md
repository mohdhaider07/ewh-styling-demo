# UI/UX Design System & Architecture Rules

You are an expert front-end developer and UI architect. Follow these rules for every component, page, and Figma translation.

---

## 1. Styling Priority (always in this order)

1. **Ant Design** — prefer Ant components + `ConfigProvider` theme tokens for UI chrome (Button, Input, Select, Table, Typography, spacing via Ant props, etc.).
2. **Tailwind inline classes** — only when something **cannot** be done cleanly with Ant Design (layout shells, page spacing, flex/grid, one-off structure around Ant components).
3. **Reusable React components** — if the same UI pattern repeats, extract a component (not a CSS class).
4. **`globals.css` custom classes** — **very exceptional** only (see Section 5).

Never skip ahead to Tailwind or CSS to restyle something Ant already supports via tokens or props.

---

## 2. Theme & Colors — Single Source of Truth

**`ConfigProvider` in `app/AntdProvider.tsx` is the only source of truth for colors and theme.**

There is **no** `color.ts` (or similar) color registry. Hex values live **only** inside Ant theme config:

```tsx
// app/AntdProvider.tsx
<ConfigProvider
  theme={{
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: { key: "app" },
    token: {
      colorPrimary: "#1677ff",
      colorInfo: "#1AAB45",
      // all app colors belong here (or theme.components)
    },
  }}
>
  <div className="app">{children}</div>
</ConfigProvider>
```

### How colors reach Tailwind (when Tailwind is needed)

```text
AntdProvider token + cssVar
  → --ant-color-* on .app wrapper
  → globals.css @theme inline maps to --color-*
  → Tailwind semantic classes (bg-primary, text-muted, …)
```

| Tailwind (if needed) | Maps from |
| -------------------- | --------- |
| `bg-layout` | `--ant-color-bg-layout` |
| `bg-background` | `--ant-color-bg-container` |
| `text-foreground` | `--ant-color-text` |
| `text-muted` | `--ant-color-text-secondary` |
| `border-border` | `--ant-color-border-secondary` |
| `bg-fill` | `--ant-color-fill-quaternary` |
| `bg-primary` / `text-primary` | `--ant-color-primary` |
| `bg-info` / `text-info` | `--ant-color-info` |

**New color:** add to `AntdProvider` `theme.token` → map once in `@theme inline` → then use the Tailwind name (only if Ant alone is not enough).

**Hard ban:** no hex in JSX (`bg-[#…]`, `text-[#…]`), no raw `var(--ant-…)` in components when a mapped class exists, no parallel color files.

---

## 3. Light & Dark Mode

Controlled only by:

1. `next-themes` — `class` on `<html>` (`light` / `dark`).
2. `AntdProvider` — `defaultAlgorithm` vs `darkAlgorithm` from `resolvedTheme`.
3. Ant `cssVar` — updates `--ant-color-*`.

Use the **same** Ant components and (when needed) the **same** Tailwind semantic classes in both modes. Do **not** use `dark:` color utilities or `@media (prefers-color-scheme)` hex overrides.

```tsx
// Correct — one set of classes
<main className="bg-layout text-foreground">…</main>

// Incorrect
<main className="bg-white dark:bg-black text-black dark:text-white">…</main>
```

Toggle: `setTheme("light" | "dark" | "system")` from `next-themes` (Client Components only).

Required wiring: `ThemeProvider` → `AntdProvider` (`algorithm` + `cssVar` + `.app` wrapper) → `@theme` maps → no per-component dark color logic.

---

## 4. Tailwind Rules (when Ant is not enough)

- Write Tailwind **inline** on the element (`className="…"`).
- Use **only** semantic colors from `@theme` (fed by Ant), never hardcoded palette classes for brand colors.
- For reuse: create a **React component**, not a CSS class in `globals.css`.

```tsx
// Prefer Ant
<Button type="primary">Save</Button>
<Typography.Title level={3}>Dashboard</Typography.Title>

// Tailwind only for layout Ant does not own
<div className="flex min-h-full items-center justify-center gap-4 p-6">
  <Button type="primary">Save</Button>
</div>
```

Do **not** fight Ant component chrome with Tailwind color utilities (e.g. `bg-primary` on `Button type="primary"`). Style that via Ant tokens instead.

---

## 5. `globals.css` — Exceptional Only

`globals.css` is for:

1. `@layer` + `@import "tailwindcss"`.
2. `@theme inline` Ant → Tailwind token maps.
3. Base `body` styles via `@apply` + semantic tokens.
4. Keyframes / rare cases Tailwind cannot express (`::before`, complex selectors, etc.).

**Do not** add utility-shortcut classes (`.heading-primary`, `.card`) to shorten JSX. Prefer a reusable component.

Custom CSS classes targeting `.ant-*` are a **last resort**, always scoped to one semantic wrapper, never app-wide.

Keep layer order:

```css
@layer theme, base, antd, components, utilities;
```

(with `StyleProvider layer`) so overrides do not need `!important`.

---

## 6. Never Use `!important`

- No CSS `!important`.
- No Tailwind important modifiers (`!p-4`, `!bg-primary`, `!text-sm`).

If a style loses, fix the source: Ant tokens → Ant `className` / `classNames` / `styles` → layout Tailwind → exceptional scoped CSS. Do not force specificity.

---

## 7. Figma & Assets

**Colors:** If Figma has a hex missing from `AntdProvider` tokens / `@theme` maps — stop. Do not guess or hardcode. Ask:

> The exact hex code `[Hex Value]` is missing from our design system. Add it to `AntdProvider` `theme.token` (and `@theme inline` if Tailwind needs it), or tell me which existing token to use.

**Images / SVGs:** Use a sized placeholder (`bg-fill` or empty `<svg>`) with exact width, height, and aspect ratio from Figma. Do not invent complex inline SVGs or fake URLs.

---

## 8. Ant Customization Ladder

1. `theme.token` / `theme.components` in `AntdProvider`.
2. Ant props (`type`, `size`, `variant`, …).
3. Ant `className` / `classNames` / `styles` for instance tweaks.
4. Reusable React wrapper component.
5. Exceptional scoped CSS under one wrapper class (never unscoped `.ant-*`, never `!important`, never `dark:` hex hacks).

---

## 9. Quick Reference

| Do | Don't |
| -- | ----- |
| Colors in `AntdProvider` `ConfigProvider` | `color.ts` or hex in JSX |
| Ant first, then Tailwind | Tailwind-first restyling of Ant |
| Inline Tailwind for layout gaps | One-off classes in `globals.css` |
| Reusable React components | Duplicate markup or CSS shortcuts |
| Same classes in light & dark | `dark:bg-*`, media-query hex themes |
| Fix tokens / props when stuck | `!important` / `!utilities` |

| File | Owns |
| ---- | ---- |
| `app/AntdProvider.tsx` | Theme source of truth (`token`, `algorithm`, `cssVar`, `.app`) |
| `app/layout.tsx` | `ThemeProvider`, fonts, shell |
| `app/globals.css` | Layers, `@theme` maps, base body, exceptional CSS only |
| Feature code | Ant components + inline Tailwind layout; no hex; no `!important` |