# GridConfig

Everything the grid does is set by the `config` prop:

```vue
<li-grid :config="config" />
```

```ts
import type {GridConfig} from "li-grid";

const config: GridConfig = {
    columns: [/* ... */],
    filters: [/* ... */],
    dataLoader: (filters, sort, page) => fetchRows(filters, sort, page),
};
```

## Overview

| Option | Type | Default | Required |
|---|---|---|---|
| [`columns`](#columns) | `GridColumn[]` | | ✔ |
| [`filters`](#filters) | `GridFilter[]` | | ✔ |
| [`dataLoader`](#dataloader) | `(filters, sort, page) => Promise<GridData>` | | ✔ |
| [`defaultSort`](#defaultsort) | `GridSort` | `{column: '', order: 'ASC'}` | |
| [`columnsToggle`](#columnstoggle) | `boolean` | `false` | |
| [`gridKey`](#gridkey) | `string` | | |
| [`theme`](#theme) | `'light' \| 'dark' \| 'auto'` | `'light'` | |
| [`mobileLayout`](#mobilelayout) | `'scroll' \| 'stack'` | `'scroll'` | |

```ts
interface GridConfig {
    columns: GridColumn[];
    filters: GridFilter[];
    dataLoader: (filters: GridFilter[], sort: GridSort, page: number) => Promise<GridData>;
    defaultSort?: GridSort;
    columnsToggle?: boolean;
    gridKey?: string;
    theme?: 'light' | 'dark' | 'auto';
    mobileLayout?: 'scroll' | 'stack';
}
```

## `columns`

- **Type:** `GridColumn[]`
- **Required**

The table columns, in display order.

```ts
columns: [
    {label: "ID", value: "id", sortable: "id", width: "80px", sticky: true},
    {label: "Full name", value: (row) => `${row.firstName} ${row.lastName}`},
    {label: "Balance", value: "balance", formatter: GridFormatter.number, contentAlign: "right"},
    {label: "Actions", slotName: "actions"},
]
```

### `GridColumn`

| Option | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | | **Required.** Header text. Also used as the card label in the stacked mobile layout and in the Columns dropdown. |
| `value` | `string \| (row) => string` | | Row property to show, or a function returning the cell text. `null` values render as `n/a`. |
| `slotName` | `string` | | Render the cell with this named slot instead of `value`. The slot receives `{ row }`. |
| `headerSlotName` | `string` | | Render the header with this named slot instead of `label`. The slot receives `{ column }`. |
| `headerClasses` | `string[]` | `[]` | Extra CSS classes for the `<th>`. |
| `sortable` | `string` | | Makes the header clickable. Sent to `dataLoader` as `sort.column`. |
| `formatter` | `GridFormatter` | | `GridFormatter.number`: `1234567` → `1,234,567`. `GridFormatter.image`: value is an image URL, rendered as a thumbnail ([details](./guide/columns#images)). Applies to string `value` only. |
| `contentAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Cell text alignment. |
| `width` | `string` | | Minimum column width, any CSS length, e.g. `'120px'`. |
| `sticky` | `boolean` | `false` | Pin the column while scrolling sideways. Works only when it's the first or last **visible** column. |

More examples: [Columns guide](./guide/columns).

## `filters`

- **Type:** `GridFilter[]`
- **Required.** Pass `[]` for no filters.

Filters users can pick from the **Add filter** dropdown.

```ts
filters: [
    {label: "Name", inputName: "name", type: "text"},
    {label: "Status", inputName: "status", type: "select", selectItems: [
        {key: "active", value: "Active"},
        {key: "blocked", value: "Blocked"},
    ]},
    {label: "Age", inputName: "age", type: "number-range"},
    {label: "Registered", inputName: "createdAt", type: "date-range"},
]
```

### `GridFilter`

| Option | Type | Description |
|---|---|---|
| `label` | `string` | **Required.** Shown in the dropdown and next to the input. |
| `inputName` | `string` | **Required.** Field name your backend filters on. |
| `type` | `'text' \| 'select' \| 'number-range' \| 'date-range'` | **Required.** Input type. |
| `selectItems` | `{key: string, value: string}[]` | Options for `select`: `key` is sent, `value` is shown. |

The `value` each type sends is listed in the [Filters guide](./guide/filters#values-sent-to-dataloader).

## `dataLoader`

- **Type:** `(filters: GridFilter[], sort: GridSort, page: number) => Promise<GridData>`
- **Required**

Fetches one page of rows. Called on mount, on sort, on page change, on **Load**, and on `reload()`.

| Argument | Description |
|---|---|
| `filters` | Filters the user added that have a value, each with its `value` set. |
| `sort` | `{column, order}` of the current sort. |
| `page` | 1-based page number. |

Must resolve to:

```ts
interface GridData {
    rows: object[];
    pagination?: null | {
        currentPage: number;
        pagesTotalAmount: number;
        rowsTotalAmount: number;
        perPageRowsAmount: number;
    };
}
```

`pagination` is optional. Without it, the pagination bar and the totals line are hidden.

```ts
dataLoader: async (filters, sort, page) => {
    const res = await fetch("/api/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({filters, sort, page}),
    });
    return res.json();
}
```

For in-memory arrays use the helper: `(filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, rows)`. See [Loading data](./guide/data-loading).

## `defaultSort`

- **Type:** `GridSort`, i.e. `{column: string, order: 'ASC' | 'DESC'}`
- **Default:** `{column: '', order: 'ASC'}` (unsorted)

Sort used for the first load. `column` should match a column's `sortable` key, so its header shows the sort arrow.

```ts
defaultSort: {column: "createdAt", order: "DESC"}
```

## `columnsToggle`

- **Type:** `boolean`
- **Default:** `false`

Shows a **Columns** dropdown where users can hide and show columns. Set [`gridKey`](#gridkey) to remember their choice.

```ts
columnsToggle: true,
gridKey: "users-grid",
```

## `gridKey`

- **Type:** `string`
- **Default:** none (hidden columns aren't saved)

Unique ID of this grid. Hidden columns are saved in `localStorage` under `li-grid-hidden-columns:<gridKey>`, so the choice survives page reloads. Use a different key for every grid in your app.

::: tip
Hidden columns are stored by position. If you reorder or insert columns, change the key (e.g. `users-grid-v2`) so users don't end up with the wrong columns hidden.
:::

## `theme`

- **Type:** `'light' | 'dark' | 'auto'`
- **Default:** `'light'`

Color theme. `'auto'` follows the OS setting (`prefers-color-scheme`).

```ts
theme: "auto"
```

To switch at runtime, keep the config reactive and change `config.theme`. Colors can be customized with CSS variables. See [Styling](./guide/styling#dark-theme).

## `mobileLayout`

- **Type:** `'scroll' | 'stack'`
- **Default:** `'scroll'`

How the table looks when the grid's container is 640px or narrower.

| Value | Behavior |
|---|---|
| `scroll` | The table keeps its columns and scrolls sideways. Sticky columns stay pinned. |
| `stack` | Each row becomes a card with `Label: value` lines. Sortable headers become sort buttons. |

```ts
mobileLayout: "stack"
```

See [Responsive layout](./guide/styling#responsive-layout).

## Full example

```ts
import {GridFormatter} from "li-grid";
import type {GridConfig} from "li-grid";

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id", sortable: "id", width: "70px", sticky: true},
        {label: "Name", value: "name", sortable: "name"},
        {label: "Role", value: "role"},
        {label: "Balance", value: "balance", sortable: "balance", formatter: GridFormatter.number, contentAlign: "right"},
        {label: "Actions", slotName: "actions", contentAlign: "center", sticky: true},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
        {label: "Role", inputName: "role", type: "select", selectItems: [
            {key: "admin", value: "Admin"},
            {key: "user", value: "User"},
        ]},
        {label: "Created", inputName: "createdAt", type: "date-range"},
    ],
    dataLoader: (filters, sort, page) => api.users.list({filters, sort, page}),
    defaultSort: {column: "id", order: "DESC"},
    columnsToggle: true,
    gridKey: "users-grid",
    theme: "auto",
    mobileLayout: "stack",
};
```
