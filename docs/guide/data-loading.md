# Loading data

All data comes from one function in your config:

```ts
dataLoader: (filters: GridFilter[], sort: GridSort, page: number) => Promise<GridData>
```

It's called:

- once when the grid is mounted
- when the user clicks a sortable header
- when the user changes page
- when the user clicks **Load** (after changing filters)
- when you call `reload()` on the component ref

## Arguments

| Argument | Description |
|---|---|
| `filters` | Filters the user added **that have a value**. Each item is the filter from your config plus a `value`. See [Filters](./filters) for value shapes. |
| `sort` | `{ column, order }`. `column` is the `sortable` key of the clicked column (empty string until the user sorts, unless `defaultSort` is set). `order` is `'ASC'` or `'DESC'`. |
| `page` | 1-based page number. |

## Return value

```ts
interface GridData {
    rows: object[];
    pagination?: null | {     // optional
        currentPage: number;
        pagesTotalAmount: number;
        rowsTotalAmount: number;
        perPageRowsAmount: number;
    };
}
```

Pagination is **optional**. If you don't paginate, return just `{ rows }`: the grid then hides the pagination bar and the "Total … rows found" line. With pagination, the bar is shown only when `pagesTotalAmount > 1`.

```ts
dataLoader: async () => ({rows: await fetchAllUsers()})
```

## Client-side data

Already have the whole array in memory? Use `wrapObjectArrayWithGrid` to filter, sort and paginate it:

```ts
import {wrapObjectArrayWithGrid} from "li-grid";

const config: GridConfig = {
    // ...
    dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, myRows),
};
```

The 5th argument sets the page size (default `300`):

```ts
dataLoader: (filters, sort, page) => wrapObjectArrayWithGrid(filters, sort, page, myRows, 50),
```

## Reloading from outside

```vue
<script setup lang="ts">
import {ref} from "vue";

const grid = ref();
const refresh = () => grid.value.reload();
</script>

<template>
    <button @click="refresh">Refresh</button>
    <li-grid ref="grid" :config="config" />
</template>
```

## Events

| Event | Payload | When |
|---|---|---|
| `sortChanged` | `GridSort` | The user clicked a sortable header. |
