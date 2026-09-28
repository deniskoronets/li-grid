# In-memory data

Already have all rows in the browser, e.g. a small list, a JSON file or a one-off API response? `wrapObjectArrayWithGrid` filters, sorts and paginates the array for you.

```vue
<script setup lang="ts">
import {LiGrid, wrapObjectArrayWithGrid} from "li-grid";
import type {GridConfig} from "li-grid";
import "li-grid/style.css";
import countries from "./countries.json";

const config: GridConfig = {
    columns: [
        {label: "Country", value: "name", sortable: "name"},
        {label: "Region", value: "region", sortable: "region"},
        {label: "Population", value: "population", sortable: "population", contentAlign: "right"},
    ],
    filters: [
        {label: "Country", inputName: "name", type: "text"},
        {label: "Region", inputName: "region", type: "select", selectItems: [
            {key: "Europe", value: "Europe"},
            {key: "Asia", value: "Asia"},
            {key: "Africa", value: "Africa"},
        ]},
    ],
    defaultSort: {column: "population", order: "DESC"},
    dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, countries),
};
</script>

<template>
    <li-grid :config="config" />
</template>
```

## Page size

Pass `perPage` as the 5th argument (default `300`):

```ts
dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, countries, 25),
```

## Data fetched once

Load the array once, then let the helper do the rest:

```ts
let rows: object[] | null = null;

const config: GridConfig = {
    // ...
    dataLoader: async (filters, sort, page) => {
        rows ??= await fetch("/api/products").then(r => r.json());
        return wrapObjectArrayWithGrid(filters, sort, page, rows);
    },
};
```

## What the helper does

- **text**: case-insensitive "contains"
- **select**: exact match on the key
- **date-range**: inclusive, when both dates are set
- **sort**: numbers numerically, booleans false→true, everything else with `localeCompare`; empty values first when ascending
- **pages**: `perPage` rows per page (5th argument, default `300`); out-of-range pages are clamped

::: warning Known issue
The helper's **number-range** filter expects `{min, max}`, but the number-range input sends `{from, to}`, so number-range filters currently have no effect with this helper. Filter numbers on the server, or map the value yourself before calling the helper.
:::

For large datasets (tens of thousands of rows and up), filter on the server instead. See [API backend](./api-backend).
