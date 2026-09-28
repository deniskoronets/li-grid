# Row actions

Add Edit / Delete buttons to every row and refresh the grid after a change.

```vue
<script setup lang="ts">
import {ref} from "vue";
import {LiGrid} from "li-grid";
import type {GridConfig} from "li-grid";

const grid = ref<InstanceType<typeof LiGrid>>();

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id"},
        {label: "Name", value: "name"},
        // Keep the actions visible while scrolling sideways
        {label: "Actions", slotName: "actions", contentAlign: "center", sticky: true},
    ],
    filters: [],
    dataLoader: (filters, sort, page) => api.users.list({filters, sort, page}),
};

const remove = async (row: {id: number, name: string}) => {
    if (!confirm(`Delete ${row.name}?`)) {
        return;
    }

    await api.users.delete(row.id);
    grid.value?.reload(); // same filters, sort and page
};
</script>

<template>
    <li-grid ref="grid" :config="config">
        <template #actions="{ row }">
            <router-link :to="`/users/${row.id}/edit`">Edit</router-link>
            ·
            <a href="#" @click.prevent="remove(row)">Delete</a>
        </template>
    </li-grid>
</template>
```

## Reload after a form in a modal

`reload()` keeps the current filters, sort and page, so users stay where they were:

```ts
const onUserSaved = () => {
    modal.close();
    grid.value?.reload();
};
```

## Reload from another component

Put the grid ref in a store (or `provide` it) and call `reload()` from anywhere:

```ts
// usersGrid.ts
import {shallowRef} from "vue";
export const usersGrid = shallowRef<{reload: () => void}>();
```

```vue
<script setup lang="ts">
import {usersGrid} from "./usersGrid";

const setGrid = (el: any) => {
    usersGrid.value = el ?? undefined;
};
</script>

<template>
    <li-grid :ref="setGrid" :config="config" />
</template>
```

```ts
// anywhere else
import {usersGrid} from "./usersGrid";
usersGrid.value?.reload();
```
