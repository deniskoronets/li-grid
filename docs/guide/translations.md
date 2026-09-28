# Translations

English is the default. Ukrainian is built in:

```vue
<li-grid :config="config" translation="uk" />
```

## Custom translation

Pass an object with every key of the English translation:

```ts
import {liGridEnTranslation} from "li-grid";
import type {GridTranslation} from "li-grid";

const de: GridTranslation = {
    ...liGridEnTranslation,
    filters: "Filter:",
    addFilter: "Filter hinzufügen",
    load: "Laden",
    loading: "Wird geladen...",
    noData: "Keine Daten",
    // ...
};
```

```vue
<li-grid :config="config" :translation="de" />
```

## Keys

| Key | English |
|---|---|
| `filters` | Filters: |
| `addFilter` | Add filter |
| `load` | Load |
| `loading` | Loading... |
| `noData` | No data to display |
| `prevPage` | Previous |
| `nextPage` | Next |
| `filterRangeFrom` | From |
| `filterRangeTo` | To |
| `filterTextPartial` | Type for partial find |
| `filterSelectEmpty` | Select item to filter |
| `filterLabel-select` | Select |
| `filterLabel-text` | Partial search |
| `filterLabel-number-range` | Range search |
| `filterLabel-date-range` | Date range search |
| `total` | Total |
| `rowsFound` | rows found |
| `perPage` | per page |
| `columns` | Columns |

Want your language built in? Pull requests are welcome.
