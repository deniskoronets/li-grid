# API backend

Load data page by page from your server.

## Client

Send filters, sort and page as JSON in a `POST` request:

```ts
import type {GridConfig, GridFilter, GridSort} from "li-grid";

const post = async (url: string, body: unknown) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }

    return res.json();
};

// Send only what the server needs, not the whole filter config (labels, select options, ...)
const requestBody = (filters: GridFilter[], sort: GridSort, page: number) => ({
    page,
    sort: sort.column ? sort : null,
    filters: filters.map(f => ({field: f.inputName, type: f.type, value: f.value})),
});

const config: GridConfig = {
    columns: [
        {label: "ID", value: "id", sortable: "id"},
        {label: "Name", value: "name", sortable: "name"},
        {label: "Age", value: "age", sortable: "age"},
        {label: "Registered", value: "created_at", sortable: "created_at"},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
        {label: "Age", inputName: "age", type: "number-range"},
        {label: "Registered", inputName: "created_at", type: "date-range"},
    ],
    dataLoader: (filters, sort, page) => post("/api/users", requestBody(filters, sort, page)),
};
```

## Request

The server receives a body like this:

```json
{
    "page": 2,
    "sort": {"column": "created_at", "order": "DESC"},
    "filters": [
        {"field": "name", "type": "text", "value": "ali"},
        {"field": "age", "type": "number-range", "value": {"from": "18", "to": "30"}},
        {"field": "created_at", "type": "date-range", "value": {"from": "2024-01-01", "to": "2024-06-30"}}
    ]
}
```

| Field | Description |
|---|---|
| `page` | Requested page, 1-based. |
| `sort` | `{column, order}`. `column` is the clicked column's `sortable` key, `order` is `ASC` or `DESC`. `null` until the user sorts, unless `defaultSort` is set. |
| `filters` | Filters the user added. Each has `field` (the filter's `inputName`), `type` and `value`. Empty text and select filters are left out. |

Filter `value` by type:

| `type` | `value` |
|---|---|
| `text` | String the user typed. Usually matched as "contains". |
| `select` | The chosen item's `key`. |
| `number-range` | `{from, to}` as strings. Either or both can be `""`, so skip empty sides. |
| `date-range` | `{from, to}` as `YYYY-MM-DD` strings. Either or both can be `""`, so skip empty sides. |

The same field can appear more than once if the user adds the same filter twice.

## Expected response

Whatever your backend is written in, `dataLoader` must resolve to this shape:

```json
{
    "rows": [
        {"id": 1, "name": "Alice", "age": 30, "created_at": "2024-01-10"},
        {"id": 2, "name": "Bob", "age": null, "created_at": "2024-02-15"}
    ],
    "pagination": {
        "currentPage": 1,
        "pagesTotalAmount": 12,
        "rowsTotalAmount": 574,
        "perPageRowsAmount": 50
    }
}
```

### `rows`

- **Type:** array of objects. **Required.** Use `[]` for no results, and the grid shows *No data to display*.
- One object per table row, **already filtered, sorted and cut to the page** by the server. The grid shows rows exactly in the order you return them.
- Keys must match the columns' `value`. A column `{value: "created_at"}` reads `row.created_at`. Extra keys are fine and are available in slots, e.g. an `id` for action links.
- `null` values render as `n/a`. Missing keys render as an empty cell.
- Values are shown as text. Format dates, money and so on on the server, or in a column `value` function (see [Custom cells](./custom-cells)).

### `pagination`

**Optional.** Leave it out (or send `null`) when you return all rows at once. The pagination bar and the "Total … rows found" line are then hidden.

| Field | Type | Meaning |
|---|---|---|
| `currentPage` | number | Page these rows belong to, **1-based**. The grid highlights it in the pagination bar. |
| `pagesTotalAmount` | number | Total number of pages, at least `1`. The bar is shown only when this is `> 1`. |
| `rowsTotalAmount` | number | Rows matching the current filters across **all** pages. Shown as "Total 574 rows found". |
| `perPageRowsAmount` | number | Page size. Shown as "50 per page". |

::: tip Rules of thumb
- Send **numbers, not strings** (`1`, not `"1"`). Page math breaks with strings.
- Count `rowsTotalAmount` **after** filtering, so the totals match what the user searched for.
- If the requested page is past the end, e.g. after filters shrank the results, return the last page and its number as `currentPage`. Or return page 1.
- `pagesTotalAmount = max(1, ceil(rowsTotalAmount / perPageRowsAmount))`.
:::

### Examples

No results:

```json
{"rows": [], "pagination": {"currentPage": 1, "pagesTotalAmount": 1, "rowsTotalAmount": 0, "perPageRowsAmount": 50}}
```

No pagination, with everything in one response:

```json
{"rows": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}
```

### Adapting an existing API

Your API doesn't have to use this format. Convert its response in `dataLoader`:

::: code-group

```ts [Laravel paginator]
// {data, current_page, last_page, total, per_page}
dataLoader: async (filters, sort, page) => {
    const res = await post("/api/users", requestBody(filters, sort, page));
    return {
        rows: res.data,
        pagination: {
            currentPage: res.current_page,
            pagesTotalAmount: res.last_page,
            rowsTotalAmount: res.total,
            perPageRowsAmount: res.per_page,
        },
    };
}
```

```ts [Spring Data Page]
// {content, number (0-based), totalPages, totalElements, size}
dataLoader: async (filters, sort, page) => {
    const res = await post("/api/users", {...requestBody(filters, sort, page), page: page - 1});
    return {
        rows: res.content,
        pagination: {
            currentPage: res.number + 1,
            pagesTotalAmount: Math.max(1, res.totalPages),
            rowsTotalAmount: res.totalElements,
            perPageRowsAmount: res.size,
        },
    };
}
```

```ts [Django REST Framework]
// {count, next, previous, results}: page size isn't in the response, so use your PAGE_SIZE
const PAGE_SIZE = 50;

dataLoader: async (filters, sort, page) => {
    const res = await post("/api/users/", requestBody(filters, sort, page));
    return {
        rows: res.results,
        pagination: {
            currentPage: page,
            pagesTotalAmount: Math.max(1, Math.ceil(res.count / PAGE_SIZE)),
            rowsTotalAmount: res.count,
            perPageRowsAmount: PAGE_SIZE,
        },
    };
}
```

:::

::: warning
Sort column and filter values come from the browser. On the server, whitelist the sortable columns and pass values as query parameters, never concatenate them into SQL.
:::

## Showing load errors

If `dataLoader` rejects, the grid stays in its loading state. Catch errors and show them your way:

```ts
dataLoader: async (filters, sort, page) => {
    try {
        return await post("/api/users", requestBody(filters, sort, page));
    } catch (e) {
        toast.error("Couldn't load users");
        return {rows: []};
    }
}
```
