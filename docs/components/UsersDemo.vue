<script setup lang="ts">
import {reactive, watchEffect} from "vue";
import {useData} from "vitepress";
import {LiGrid, wrapObjectArrayWithGrid, GridFormatter} from "../../src";
import type {GridConfig} from "../../src";
import {dummyUsersDataGenerator, roles, statuses, countries} from "./dummy-users-data";

const users = dummyUsersDataGenerator();

const dateFormat = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "short", year: "numeric"});

const {isDark} = useData();

const config = reactive<GridConfig>({
    columns: [
        {label: "User", slotName: "user", sortable: "name", width: "220px", sticky: true},
        {label: "Role", slotName: "role", sortable: "role", contentAlign: "center"},
        {label: "Status", slotName: "status", sortable: "status"},
        {label: "Email", slotName: "email"},
        {label: "Photo", value: "avatar", formatter: GridFormatter.image, contentAlign: "center"},
        {label: "Country", value: (row: any) => `${row.flag} ${row.country}`, sortable: "country"},
        {label: "Skills", slotName: "tags", width: "160px"},
        {label: "Progress", slotName: "progress", sortable: "progress", width: "140px"},
        {label: "Rating", slotName: "rating", sortable: "rating", headerSlotName: "ratingHeader"},
        {label: "Verified", slotName: "verified", sortable: "verified", contentAlign: "center"},
        {label: "Activity", slotName: "activity", contentAlign: "center"},
        {label: "Balance", value: "balance", sortable: "balance", formatter: GridFormatter.number, contentAlign: "right"},
        {label: "Joined", value: (row: any) => dateFormat.format(new Date(row.createdAt)), sortable: "createdAt"},
        {label: "Actions", slotName: "actions", contentAlign: "center", sticky: true},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
        {label: "Email", inputName: "email", type: "text"},
        {label: "Role", inputName: "role", type: "select", selectItems: roles.map(r => ({key: r, value: r}))},
        {label: "Status", inputName: "status", type: "select", selectItems: statuses.map(s => ({key: s, value: s}))},
        {label: "Country", inputName: "country", type: "select", selectItems: countries.map(c => ({key: c.name, value: `${c.flag} ${c.name}`}))},
        {label: "Joined", inputName: "createdAt", type: "date-range"},
    ],
    defaultSort: {column: "id", order: "ASC"},
    columnsToggle: true,
    gridKey: "docs-demo-v3",
    mobileLayout: "stack",
    dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, users, 20),
});

// Follow the docs site's light/dark switch
watchEffect(() => {
    config.theme = isDark.value ? "dark" : "light";
});

// Tiny inline SVG line chart
const sparkline = (values: number[]) => values
    .map((v, i) => `${(i / (values.length - 1)) * 80},${22 - (v / 100) * 20}`)
    .join(" ");

const greet = (row: any) => alert(`Hello, ${row.name}!`);
</script>

<template>
    <ClientOnly>
        <!-- vp-raw opts out of VitePress content styles (tables, lists), like any host page CSS -->
        <div class="vp-raw">
            <li-grid :config="config">
                <template #user="{ row }">
                    <span class="demo-user">
                        <img :src="row.avatar" :alt="row.name" width="36" height="36" loading="lazy">
                        <span>
                            <b>{{ row.name }}</b>
                            <small>#{{ row.id }}</small>
                        </span>
                    </span>
                </template>

                <template #role="{ row }">
                    <span :class="['demo-badge', `demo-badge--${row.role}`]">{{ row.role }}</span>
                </template>

                <template #status="{ row }">
                    <span class="demo-status">
                        <i :class="`demo-status--${row.status}`"></i>{{ row.status }}
                    </span>
                </template>

                <template #email="{ row }">
                    <a :href="`mailto:${row.email}`" class="demo-link">{{ row.email }}</a>
                </template>

                <template #tags="{ row }">
                    <span class="demo-tags">
                        <span v-for="tag in row.tags" :key="tag" class="demo-tag">{{ tag }}</span>
                        <span v-if="!row.tags.length" class="demo-muted">none</span>
                    </span>
                </template>

                <template #progress="{ row }">
                    <span class="demo-progress" :title="`${row.progress}%`">
                        <span :style="{width: `${row.progress}%`}"></span>
                    </span>
                    <small>{{ row.progress }}%</small>
                </template>

                <template #ratingHeader="{ column }">
                    {{ column.label }} <span title="Average customer rating, 1–5">ⓘ</span>
                </template>

                <template #rating="{ row }">
                    <span class="demo-stars" :title="`${row.rating} / 5`">
                        <span v-for="n in 5" :key="n" :class="{on: n <= row.rating}">★</span>
                    </span>
                </template>

                <template #verified="{ row }">
                    <label class="demo-switch" :title="row.verified ? 'Verified' : 'Not verified'">
                        <input type="checkbox" v-model="row.verified">
                        <span></span>
                    </label>
                </template>

                <template #activity="{ row }">
                    <svg class="demo-sparkline" width="80" height="24" viewBox="0 0 80 24">
                        <polyline :points="sparkline(row.activity)" fill="none" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </template>

                <template #actions="{ row }">
                    <span class="demo-actions">
                        <button class="demo-button" @click="greet(row)">👋 Say hi</button>
                        <a :href="row.avatar" target="_blank" class="demo-button">View</a>
                    </span>
                </template>
            </li-grid>
        </div>
    </ClientOnly>
</template>

<style>
/* Show off built-in zebra rows (odd rows), in both themes */
.vp-raw .li-grid {
    --li-grid-row-stripe: var(--vp-c-bg-soft);
}
</style>

<style scoped>
.demo-user {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-align: left;
}

.demo-user img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: var(--vp-c-bg-soft);
}

.demo-user span {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.demo-user small, .demo-muted {
    opacity: 0.6;
}

.demo-badge {
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.demo-badge--admin { background: #fee2e2; color: #991b1b; }
.demo-badge--editor { background: #dbeafe; color: #1e40af; }
.demo-badge--viewer { background: #e5e7eb; color: #374151; }

.demo-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-transform: capitalize;
}

.demo-status i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.demo-status--active { background: #22c55e; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }
.demo-status--away { background: #f59e0b; }
.demo-status--blocked { background: #ef4444; }

.demo-link {
    color: var(--vp-c-brand-1);
    text-decoration: underline;
}

.demo-tags {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
}

.demo-tag {
    padding: 1px 6px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
    font-size: 12px;
    font-family: var(--vp-font-family-mono);
}

.demo-progress {
    display: inline-block;
    width: 80px;
    height: 6px;
    margin-right: 6px;
    border-radius: 3px;
    background: var(--vp-c-default-soft);
    overflow: hidden;
    vertical-align: middle;
}

.demo-progress span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #22c55e);
}

.demo-stars {
    letter-spacing: 1px;
    color: var(--vp-c-default-3);
}

.demo-stars .on {
    color: #f59e0b;
}

.demo-switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
    cursor: pointer;
}

.demo-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.demo-switch span {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: var(--vp-c-default-soft);
    transition: background 0.2s;
}

.demo-switch span::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s;
}

.demo-switch input:checked + span {
    background: #22c55e;
}

.demo-switch input:checked + span::before {
    transform: translateX(14px);
}

.demo-sparkline {
    display: inline-block;
    color: var(--vp-c-brand-1);
    vertical-align: middle;
}

.demo-actions {
    display: inline-flex;
    gap: 6px;
}

.demo-button {
    padding: 2px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
}

.demo-button:hover {
    background: var(--vp-c-default-soft);
}
</style>
