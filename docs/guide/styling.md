# Styling

Import the stylesheet once, e.g. in your `main.ts`:

```ts
import "li-grid/style.css";
```

## Dark theme

Set `theme` in the grid config:

```ts
const config: GridConfig = {
    // ...
    theme: "dark", // 'light' (default) | 'dark' | 'auto'
};
```

| Value | Behavior |
|---|---|
| `light` | Light colors (default). |
| `dark` | Dark colors. |
| `auto` | Follows the user's OS setting via `prefers-color-scheme`. |

To switch at runtime, e.g. together with your app's own theme toggle, keep the config reactive:

```ts
import {reactive, watchEffect} from "vue";

const config = reactive<GridConfig>({ /* ... */ });

watchEffect(() => {
    config.theme = isDark.value ? "dark" : "light";
});
```

The dark theme doesn't paint a background behind the table, so it blends into your page. Only sticky cells, inputs and dropdowns get their own background.

## Responsive layout

The grid always takes the **full width of its container** and adapts to that width, not to the screen size (it uses CSS container queries). So it looks right in a sidebar, a modal or half of a split view, not only on phones.

When the container is **640px or narrower**:

- toolbar buttons and the totals line wrap onto new lines
- each added filter takes a full line, and its inputs stretch
- dropdowns fit inside the grid and scroll if long
- cells get tighter padding, and pagination wraps

On narrow containers, the table itself behaves as set by `mobileLayout`:

```ts
const config: GridConfig = {
    // ...
    mobileLayout: "stack", // 'scroll' (default) | 'stack'
};
```

| Value | Behavior |
|---|---|
| `scroll` | The table keeps its columns and scrolls sideways. Sticky columns stay pinned. |
| `stack` | Each row becomes a card with one `Label: value` line per column. Sortable headers turn into a row of sort buttons. |

::: tip
The grid sets `width: 100%` on itself. If you put it inside a flex or grid layout, make sure its parent has a width (e.g. `flex: 1; min-width: 0`), or the grid can collapse.
:::

## Fonts and isolation from your site's CSS

The grid uses its own font and size, and resets common element styles inside `.li-grid` (margins and bullets on lists, table borders and backgrounds, button and input fonts, link colors). Your site's global CSS such as `table { ... }` or `ul { ... }` won't leak in.

To use your site's font instead:

```css
.li-grid {
    --li-grid-font-family: inherit;
    --li-grid-font-size: 1rem;
}
```

| Variable | Default |
|---|---|
| `--li-grid-font-family` | System UI font stack (`-apple-system, system-ui, "Segoe UI", …`) |
| `--li-grid-font-size` | `14px` |

::: warning
The reset beats plain element selectors (`table`, `button`, `a`), but **not** more specific site rules like `.content table tr:nth-child(2n)`. If your page styles tables inside a wrapper class, put the grid outside that wrapper or override the rule for `.li-grid`.
:::

## Custom colors

All colors are CSS variables on `.li-grid`. Override any of them for your brand:

```css
.li-grid {
    --li-grid-row-hover: #eef6ff;
    --li-grid-button-bg: #fff;
}

.li-grid--dark {
    --li-grid-bg: #0d1117;
    --li-grid-row-hover: #161b22;
}
```

### Zebra rows

Odd rows (1st, 3rd, …) get the stripe. Set it with the variable rather than your own `tr { background }` rule, so sticky columns get the stripe color too:

```css
.li-grid {
    --li-grid-row-stripe: #fafafc;
}

.li-grid--dark {
    --li-grid-row-stripe: #202126;
}
```

To stripe other rows (e.g. even ones, or every 3rd), set the row's color variable instead of `background`. Keep `:not(:hover)` so hover still works:

```css
.li-grid .li-grid__table tbody tr:nth-child(odd):not(:hover) {
    --li-grid-row-current: transparent;
}

.li-grid .li-grid__table tbody tr:nth-child(even):not(:hover) {
    --li-grid-row-current: #fafafc;
}
```

::: warning
A plain `tr { background: … }` rule colors the normal cells only. Sticky cells paint their own opaque background (so scrolled content doesn't show through), and they only follow `--li-grid-row-current`.
:::

| Variable | Used for |
|---|---|
| `--li-grid-bg` | Sticky cell background |
| `--li-grid-text` | Text color (dark theme only; light inherits from your page) |
| `--li-grid-header-text` | Header text |
| `--li-grid-border` | Table borders |
| `--li-grid-row-hover` | Row hover background |
| `--li-grid-row-stripe` | Background of odd rows (zebra striping). `transparent` by default = off |
| `--li-grid-hover-duration` | Row hover fade, sticky columns included (default `0.15s`, `0s` to turn off) |
| `--li-grid-sticky-shadow` | Shadow next to sticky columns |
| `--li-grid-button-bg`, `--li-grid-button-hover-bg`, `--li-grid-button-active-bg` | Buttons and pagination |
| `--li-grid-button-border`, `--li-grid-button-text`, `--li-grid-button-disabled-text` | Buttons and pagination |
| `--li-grid-dropdown-bg`, `--li-grid-dropdown-border`, `--li-grid-dropdown-shadow` | Filter and column dropdowns |
| `--li-grid-filter-separator` | Line left of each added filter |
| `--li-grid-image-size` | Size of `GridFormatter.image` thumbnails (default `40px`) |
| `--li-grid-input-bg`, `--li-grid-input-text`, `--li-grid-input-border`, `--li-grid-input-focus` | Filter inputs |

## CSS classes

Everything uses BEM-style classes under `.li-grid`:

| Class | Element |
|---|---|
| `.li-grid` | Root. Also has `.li-grid--light`, `.li-grid--dark` or `.li-grid--auto` |
| `.li-grid__filters` | Top bar with filters, Load button and totals |
| `.li-grid__add-filter` | Toolbar buttons |
| `.li-grid__selected-filter` | One added filter |
| `.li-grid__responsive-table` | Horizontal scroll wrapper |
| `.li-grid__table` | The `<table>` |
| `.li-grid__sticky-left`, `.li-grid__sticky-right` | Sticky cells |
| `.li-grid__pagination` | Pagination bar |

Skip the stylesheet entirely if you'd rather style the grid from scratch.
