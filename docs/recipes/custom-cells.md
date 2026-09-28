# Custom cells

Anything beyond plain text goes through slots: set `slotName` on the column and fill the slot. It receives `{ row }`.

## Status badge

```ts
{label: "Status", slotName: "status", contentAlign: "center"}
```

```vue
<template #status="{ row }">
    <span :class="['badge', `badge--${row.status}`]">{{ row.status }}</span>
</template>
```

```css
.badge { padding: 2px 8px; border-radius: 999px; font-size: 12px; }
.badge--active { background: #dcfce7; color: #166534; }
.badge--blocked { background: #fee2e2; color: #991b1b; }
```

## Link to a detail page

```vue
<template #name="{ row }">
    <a :href="`/users/${row.id}`">{{ row.name }}</a>
</template>
```

## Dates and money

For plain text, a `value` function is enough, no slot needed:

```ts
const date = new Intl.DateTimeFormat("en-GB", {dateStyle: "medium"});
const money = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});

columns: [
    {label: "Created", value: (row) => date.format(new Date(row.createdAt)), sortable: "createdAt"},
    {label: "Balance", value: (row) => money.format(row.balance), contentAlign: "right"},
]
```

## Image only

No slot needed: use the image formatter.

```ts
{label: "Photo", value: "photoUrl", formatter: GridFormatter.image}
```

## Avatar + name

```vue
<template #user="{ row }">
    <span style="display: inline-flex; align-items: center; gap: 8px">
        <img :src="row.avatarUrl" alt="" width="24" height="24" style="border-radius: 50%">
        {{ row.name }}
    </span>
</template>
```

## Header with a tooltip

Set `headerSlotName`. The slot receives `{ column }`. It works on sortable columns too.

```ts
{label: "Score", value: "score", sortable: "score", headerSlotName: "scoreHeader"}
```

```vue
<template #scoreHeader="{ column }">
    {{ column.label }} <span title="Calculated nightly">ⓘ</span>
</template>
```
