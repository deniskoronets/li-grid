# Getting started

## Installation

```sh
npm install li-grid
```

LiGrid requires **Vue 3.4+**.

## Basic usage

```vue
<script setup lang="ts">
import {LiGrid} from "li-grid";
import type {GridConfig} from "li-grid";
import "li-grid/style.css";

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id", sortable: "id"},
        {label: "Name", value: "name", sortable: "name"},
        {label: "Email", value: "email"},
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
    <li-grid :config="config" />
</template>
```

That's it: the grid loads data when mounted and reloads whenever the user sorts, changes page or clicks **Load**.

## Next steps

- [Loading data](./data-loading): what `dataLoader` receives and must return
- [Columns](./columns): formatting, slots, alignment, sticky columns
- [Filters](./filters): filter types and their values
- [Live demo](../demo)

## Our sponsors

<a href="https://mobicard.com.ua/" title="Mobicard"><img src="https://mobicard.com.ua/favicon.svg" width="32" alt="Mobicard" style="display:inline-block"></a>
<a href="https://busyb.com.ua/" title="BusyB"><img src="https://busyb.com.ua/favicon.svg" width="32" alt="BusyB" style="display:inline-block"></a>
<a href="https://pc-info.com.ua/" title="PC-Info"><img src="https://pc-info.com.ua/favicon.svg" width="32" alt="PC-Info" style="display:inline-block"></a>
<a href="https://linktrust.pro/" title="LinkTrust"><img src="https://linktrust.pro/linktrust.svg" width="32" alt="LinkTrust" style="display:inline-block"></a>

## Author

Created and maintained by **[Denys Koronets](https://github.com/deniskoronets/)**.

## Have a project? Hire me!

Need a custom data grid, a Vue 3 app, or help integrating LiGrid into your product? I'm open to freelance and contract work.

👉 Get in touch via **[GitHub](https://github.com/deniskoronets/)**.
