export enum GridFormatter {
    number = 'number',
}

export const formatters : Record<GridFormatter, (value: string | number) => string> = {
    [GridFormatter.number]: (value: string | number) => {
        return parseFloat(value).toLocaleString('en-US');
    }
}
