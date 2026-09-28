# Dark mode toggle

Keep the grid in sync with your app's own light/dark switch.

## With VueUse

```vue
<script setup lang="ts">
import {reactive, watchEffect} from "vue";
import {useDark, useToggle} from "@vueuse/core";
import {LiGrid} from "li-grid";
import type {GridConfig} from "li-grid";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const config = reactive<GridConfig>({
    columns: [/* ... */],
    filters: [/* ... */],
    dataLoader: (filters, sort, page) => fetchRows(filters, sort, page),
});

watchEffect(() => {
    config.theme = isDark.value ? "dark" : "light";
});
</script>

<template>
    <button @click="toggleDark()">{{ isDark ? "☀️" : "🌙" }}</button>
    <li-grid :config="config" />
</template>
```

## Following the OS only

No switch in your app? Let the grid follow the system setting:

```ts
theme: "auto"
```

## Matching your dark palette

The built-in dark colors are neutral greys. Match them to your app:

```css
.li-grid--dark {
    --li-grid-bg: #0f172a;
    --li-grid-border: #1e293b;
    --li-grid-row-hover: #1e293b;
    --li-grid-button-bg: #1e293b;
    --li-grid-button-hover-bg: #334155;
    --li-grid-input-bg: #0f172a;
}
```

All variables are listed in [Styling](../guide/styling#custom-colors).
