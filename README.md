# LiGrid

[![npm](https://img.shields.io/npm/v/li-grid.svg)](https://www.npmjs.com/package/li-grid)
[![CI](https://github.com/deniskoronets/li-grid/actions/workflows/ci.yml/badge.svg)](https://github.com/deniskoronets/li-grid/actions/workflows/ci.yml)
[![License](https://img.shields.io/npm/l/li-grid.svg)](./LICENSE)

Lightweight **Vue 3** data grid with server-side filtering, sorting, pagination, column toggling and translations.

📖 **[Documentation](https://deniskoronets.github.io/li-grid/)** · 🎮 **[Live demo](https://deniskoronets.github.io/li-grid/demo)**

## Features

- One async `dataLoader` works with any backend
- Text, select, number range and date range filters
- Sortable columns and pagination
- Users can hide columns, and the choice is saved in localStorage
- Light, dark and auto (OS-following) themes, customizable via CSS variables
- Responsive: fits its container, with optional card layout on narrow screens
- Sticky first/last columns
- Custom cell and header slots
- English and Ukrainian built in, or bring your own translation
- TypeScript types included

## Installation

```sh
npm install li-grid
```

Requires Vue 3.4+.

## Quick start

```vue
<script setup lang="ts">
import {LiGrid} from "li-grid";
import type {GridConfig} from "li-grid";
import "li-grid/style.css";

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id", sortable: "id"},
        {label: "Name", value: "name", sortable: "name"},
        {label: "Actions", slotName: "actions"},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
    ],
    dataLoader: async (filters, sort, page) => {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({filters, sort, page}),
        });

        return response.json(); // { rows: [...], pagination: {...} }
    },
};
</script>

<template>
    <li-grid :config="config">
        <template #actions="{ row }">
            <a :href="`/users/${row.id}`">Edit</a>
        </template>
    </li-grid>
</template>
```

Have all your data in memory already? Use the built-in helper:

```ts
import {wrapObjectArrayWithGrid} from "li-grid";

dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, rows)
```

See the **[documentation](https://deniskoronets.github.io/li-grid/)** for columns, filters, translations, styling and the full API.

## Development

```sh
npm install
npm test           # run tests
npm run build      # build the library into dist/
npm run docs:dev   # run the docs site locally
```

## Our sponsors

<a href="https://mobicard.com.ua/" title="Mobicard"><img src="https://mobicard.com.ua/favicon.svg" width="32" alt="Mobicard"></a>
<a href="https://busyb.com.ua/" title="BusyB"><img src="https://busyb.com.ua/favicon.svg" width="32" alt="BusyB"></a>
<a href="https://pc-info.com.ua/" title="PC-Info"><img src="https://pc-info.com.ua/favicon.svg" width="32" alt="PC-Info"></a>
<a href="https://linktrust.pro/" title="LinkTrust"><img src="https://linktrust.pro/linktrust.svg" width="32" alt="LinkTrust"></a>

## Author

Created and maintained by **[Denys Koronets](https://github.com/deniskoronets/)**.

## License

[Apache License 2.0](./LICENSE). Copyright © 2026 Denys Koronets.

If you redistribute this code, keep the [LICENSE](./LICENSE) and [NOTICE](./NOTICE) files, as the license requires.
