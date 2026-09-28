# Auto refresh

Reload the data every few seconds for dashboards, queues or live orders, keeping the user's filters, sort and page.

```vue
<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import {LiGrid} from "li-grid";
import type {GridConfig} from "li-grid";

const grid = ref<InstanceType<typeof LiGrid>>();
let timer: ReturnType<typeof setInterval> | undefined;

const config: GridConfig = {
    columns: [/* ... */],
    filters: [/* ... */],
    dataLoader: (filters, sort, page) => api.orders.list({filters, sort, page}),
};

onMounted(() => {
    timer = setInterval(() => {
        // Skip while the tab is in the background
        if (document.visibilityState === "visible") {
            grid.value?.reload();
        }
    }, 30_000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
    <li-grid ref="grid" :config="config" />
</template>
```

## With VueUse

```ts
import {useIntervalFn, useDocumentVisibility} from "@vueuse/core";

const visibility = useDocumentVisibility();

useIntervalFn(() => {
    if (visibility.value === "visible") {
        grid.value?.reload();
    }
}, 30_000);
```

::: tip
The grid shows **Loading...** in place of the rows while reloading. For very frequent refreshes (under ~10s) that flicker can be distracting, so pick an interval that fits how fast your data really changes.
:::
