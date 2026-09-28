<script setup lang="ts">
import {reactive, watchEffect} from "vue";
import {useData} from "vitepress";
import {LiGrid, wrapObjectArrayWithGrid, GridFormatter} from "../../src";
import type {GridConfig} from "../../src";

const roles = ["admin", "editor", "viewer"];
const names = ["Olena", "Taras", "Iryna", "Andrii", "Sofia", "Mykola", "Kateryna", "Bohdan", "Oksana", "Dmytro"];

const users = Array.from({length: 1250}, (_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]} #${i + 1}`,
    role: roles[i % roles.length],
    balance: Math.round(((i * 7919) % 100000) * 1.37),
    createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString().slice(0, 10),
}));

const {isDark} = useData();

const config = reactive<GridConfig>({
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
    dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, users),
});

// Follow the docs site's light/dark switch
watchEffect(() => {
    config.theme = isDark.value ? "dark" : "light";
});

const greet = (row: any) => alert(`Hello, ${row.name}!`);
</script>

<template>
    <ClientOnly>
        <li-grid :config="config">
            <template #actions="{ row }">
                <button class="demo-button" @click="greet(row)">Say hi</button>
            </template>
        </li-grid>
    </ClientOnly>
</template>

<style scoped>
.demo-button {
    padding: 2px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
}
</style>
