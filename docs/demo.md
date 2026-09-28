# Live demo

1,250 generated users, filtered, sorted and paginated in the browser with `wrapObjectArrayWithGrid`. Try adding filters, sorting by a column and hiding columns. On a phone (or a narrow browser window) rows turn into cards.

<UsersDemo />

## Source

```vue
<script setup lang="ts">
import {LiGrid, wrapObjectArrayWithGrid, GridFormatter} from "li-grid";
import type {GridConfig} from "li-grid";
import "li-grid/style.css";

const roles = ["admin", "editor", "viewer"];
const users = [/* ... */];

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id", sortable: "id", width: "70px", sticky: true},
        {label: "Name", value: "name", sortable: "name"},
        {label: "Role", value: "role", sortable: "role"},
        {label: "Balance", value: "balance", sortable: "balance", formatter: GridFormatter.number, contentAlign: "right"},
        {label: "Created", value: "createdAt", sortable: "createdAt"},
        {label: "Actions", slotName: "actions", contentAlign: "center", sticky: true},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
        {label: "Role", inputName: "role", type: "select", selectItems: roles.map(r => ({key: r, value: r}))},
        {label: "Created", inputName: "createdAt", type: "date-range"},
    ],
    defaultSort: {column: "id", order: "ASC"},
    columnsToggle: true,
    gridKey: "docs-demo",
    mobileLayout: "stack",
    dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, users),
};

const greet = (row: any) => alert(`Hello, ${row.name}!`);
</script>

<template>
    <li-grid :config="config">
        <template #actions="{ row }">
            <button @click="greet(row)">Say hi</button>
        </template>
    </li-grid>
</template>
```
