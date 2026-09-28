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
