import {GridFormatter} from "./formatters";
import {liGridEnTranslation} from "./translations/en";

export interface GridFilter {
    label: string,
    inputName: string,
    type: 'text' | 'number-range' | 'select' | 'date-range',
    value?: any,
    selectItems?: {key: string, value: string}[],
}

export interface GridData {
    rows: object[],
    // Omit (or set null) when the data isn't paginated
    pagination?: null | GridPagination,
}

export interface GridSort {
    column: string,
    order: 'ASC' | 'DESC',
}

export interface GridPagination {
    currentPage: number,
    pagesTotalAmount: number,
    rowsTotalAmount: number;
    perPageRowsAmount: number;
}

export interface GridColumn {
    // Label should be set, but header slot can override header value
    label: string;
    headerSlotName?: string;
    headerClasses?: string[],

    sortable?: string;
    formatter?: GridFormatter,
    contentAlign?: 'left' | 'center' | 'right',
    width?: string,

    // Can be either value or slotName
    value?: string | ((row: string) => string);
    slotName?: string;

    // Only takes effect when the column ends up first or last among the visible columns
    sticky?: boolean;
}

export interface GridConfig {
    columns: GridColumn[],
    filters: GridFilter[],
    dataLoader: (filters: GridFilter[], sort: GridSort, page: number) => Promise<GridData>,

    defaultSort?: GridSort,

    // Shows a "columns" button letting the user hide/show columns. Disabled by default.
    columnsToggle?: boolean,

    // Required when columnsToggle is enabled: used as the localStorage key for persisting hidden columns.
    gridKey?: string,

    // Color theme. 'auto' follows the OS preference (prefers-color-scheme). Defaults to 'light'.
    theme?: 'light' | 'dark' | 'auto',
}

export type GridTranslation = typeof liGridEnTranslation;
