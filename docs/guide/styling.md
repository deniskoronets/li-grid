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

| Variable | Used for |
|---|---|
| `--li-grid-bg` | Sticky cell background |
| `--li-grid-text` | Text color (dark theme only; light inherits from your page) |
| `--li-grid-header-text` | Header text |
| `--li-grid-border` | Table borders |
| `--li-grid-row-hover` | Row hover background |
| `--li-grid-sticky-shadow` | Shadow next to sticky columns |
| `--li-grid-button-bg`, `--li-grid-button-hover-bg`, `--li-grid-button-active-bg` | Buttons and pagination |
| `--li-grid-button-border`, `--li-grid-button-text`, `--li-grid-button-disabled-text` | Buttons and pagination |
| `--li-grid-dropdown-bg`, `--li-grid-dropdown-border`, `--li-grid-dropdown-shadow` | Filter and column dropdowns |
| `--li-grid-filter-separator` | Line left of each added filter |
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
