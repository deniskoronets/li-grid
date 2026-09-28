# Filters

Filters listed in `config.filters` appear in the **Add filter** dropdown. Users can add several, fill them in and click **Load**.

```ts
filters: [
    {label: "Name", inputName: "name", type: "text"},
    {label: "Status", inputName: "status", type: "select", selectItems: [
        {key: "active", value: "Active"},
        {key: "blocked", value: "Blocked"},
    ]},
    {label: "Age", inputName: "age", type: "number-range"},
    {label: "Registered", inputName: "createdAt", type: "date-range"},
]
```

## Options

| Option | Type | Description |
|---|---|---|
| `label` | `string` | Shown in the dropdown and next to the input. |
| `inputName` | `string` | Field name your backend filters on. |
| `type` | `'text' \| 'select' \| 'number-range' \| 'date-range'` | Input type. |
| `selectItems` | `{key, value}[]` | Options for `select`. `key` is sent, `value` is shown. |

## Values sent to `dataLoader`

Each filter passed to `dataLoader` is your config object plus a `value`:

| Type | `value` |
|---|---|
| `text` | `string` the user typed |
| `select` | the selected item's `key` |
| `number-range` | `{ from: string, to: string }` |
| `date-range` | `{ from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }` |

Filters left empty (blank text, no select option chosen) are not sent.

The same filter type can be added more than once.
