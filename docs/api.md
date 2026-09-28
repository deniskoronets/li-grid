# API

## `<LiGrid>`

### Props

| Prop | Type | Description |
|---|---|---|
| `config` | `GridConfig` | **Required.** Grid configuration. |
| `translation` | `'en' \| 'uk' \| GridTranslation` | UI language. Default `'en'`. |

### Events

| Event | Payload |
|---|---|
| `sortChanged` | `GridSort` |

### Exposed methods

| Method | Description |
|---|---|
| `reload()` | Calls `dataLoader` again with the current filters, sort and page. |

### Slots

Any `slotName` / `headerSlotName` from your columns. Cell slots receive `{ row }`, header slots receive `{ column }`.

## `GridConfig`

```ts
interface GridConfig {
    columns: GridColumn[];
    filters: GridFilter[];
    dataLoader: (filters: GridFilter[], sort: GridSort, page: number) => Promise<GridData>;
    defaultSort?: GridSort;
    columnsToggle?: boolean;  // show the "Columns" dropdown
    gridKey?: string;         // localStorage key for hidden columns
    theme?: 'light' | 'dark' | 'auto'; // default 'light'
}
```

See [Columns](./guide/columns) and [Filters](./guide/filters) for `GridColumn` and `GridFilter`.

## `GridSort`

```ts
interface GridSort {
    column: string;
    order: 'ASC' | 'DESC';
}
```

## `GridData`

```ts
interface GridData {
    rows: object[];
    pagination?: null | GridPagination; // optional: omit if not paginated
}

interface GridPagination {
    currentPage: number;
    pagesTotalAmount: number;
    rowsTotalAmount: number;
    perPageRowsAmount: number;
}
```

## Exports

```ts
import {
    LiGrid,                  // component (also the default export)
    wrapObjectArrayWithGrid, // client-side filter/sort/paginate helper
    GridFormatter,           // column formatters enum
    formatters,
    resolveTranslation,
    liGridEnTranslation,
    liGridUkTranslation,
} from "li-grid";

import type {
    GridConfig, GridColumn, GridFilter, GridSort,
    GridData, GridPagination, GridTranslation,
} from "li-grid";
```
