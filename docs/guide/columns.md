# Columns

Each item in `config.columns` describes one column.

```ts
columns: [
    {label: "ID", value: "id", sortable: "id", width: "80px"},
    {label: "Full name", value: (row) => `${row.firstName} ${row.lastName}`},
    {label: "Balance", value: "balance", formatter: GridFormatter.number, contentAlign: "right"},
    {label: "Actions", slotName: "actions"},
]
```

## Options

| Option | Type | Description |
|---|---|---|
| `label` | `string` | Header text. **Required.** |
| `value` | `string \| (row) => string` | Row property to display, or a function returning the cell text. `null` values render as `n/a`. |
| `slotName` | `string` | Render the cell with a named slot instead of `value`. |
| `headerSlotName` | `string` | Render the header with a named slot instead of `label`. |
| `headerClasses` | `string[]` | Extra CSS classes for the `<th>`. |
| `sortable` | `string` | Makes the header clickable. This key is sent to `dataLoader` as `sort.column`. |
| `formatter` | `GridFormatter` | `GridFormatter.number`: `1234567` → `1,234,567`. `GridFormatter.image`: the value is an image URL, shown as a thumbnail. |
| `contentAlign` | `'left' \| 'center' \| 'right'` | Cell text alignment. Default `left`. |
| `width` | `string` | Minimum column width, e.g. `"120px"`. |
| `sticky` | `boolean` | Pin the column while scrolling horizontally. Only takes effect when it's the first or last **visible** column. |

## Images

Set `formatter: GridFormatter.image` and the cell shows the URL from `value` as a 40×40 thumbnail (lazy-loaded, cropped to fit). Empty values show `n/a`.

```ts
import {GridFormatter} from "li-grid";

{label: "Photo", value: "photoUrl", formatter: GridFormatter.image}
```

Change the size for all image cells:

```css
.li-grid {
    --li-grid-image-size: 64px;
}
```

Need a caption, a link or a round avatar next to a name? Use a [cell slot](#cell-slots) instead.

## Cell slots

```vue
<li-grid :config="config">
    <template #actions="{ row }">
        <a :href="`/users/${row.id}`">Edit</a>
    </template>
</li-grid>
```

## Header slots

```ts
{label: "Status", value: "status", headerSlotName: "statusHeader"}
```

```vue
<template #statusHeader="{ column }">
    {{ column.label }} <span title="Updated hourly">ⓘ</span>
</template>
```

## Letting users hide columns

```ts
const config: GridConfig = {
    // ...
    columnsToggle: true,
    gridKey: "users-grid", // localStorage key, unique per grid
};
```

A **Columns** dropdown appears. Hidden columns are saved in `localStorage` under `li-grid-hidden-columns:<gridKey>`. Without `gridKey`, the choice is not persisted.
