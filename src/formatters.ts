import {GridColumn, GridFormatter} from "./types";

export const escapeHtml = (value: unknown): string => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Each formatter returns HTML and must escape whatever it puts into it
export const formatters : Record<GridFormatter, (value: string | number, column: GridColumn) => string> = {
    [GridFormatter.number]: (value) => {
        return escapeHtml(parseFloat(String(value)).toLocaleString('en-US'));
    },
    [GridFormatter.image]: (value, column) => {
        if (value === '') {
            return '';
        }

        return `<img src="${escapeHtml(value)}" alt="${escapeHtml(column.label)}" class="li-grid__image" loading="lazy">`;
    },
}

// HTML for a cell of a column with `value` (not `slotName`)
export const resolveColumnValue = (column: GridColumn, row: any): string => {
    if (typeof column.value === 'function') {
        return escapeHtml(column.value(row));
    }

    const value = row[column.value];

    if (value === null) {
        return 'n/a';
    }

    if (value === undefined) {
        return '';
    }

    return column.formatter ? formatters[column.formatter](value, column) : escapeHtml(value);
}
