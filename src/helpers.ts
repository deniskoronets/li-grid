import {GridData, GridFilter, GridSort} from "./types";

export function wrapObjectArrayWithGrid(filters: GridFilter[], sort: GridSort | null, page: number, objectArray: object[], perPage = 300) {
    let data = objectArray.filter((row) => {
        return filters.every((filter: GridFilter) => {
            if (filter.value === null || filter.value === undefined) return true; // skip empty filters

            switch (filter.type) {
                case "text":
                    return (row as any)[filter.inputName]
                        ?.toString()
                        .toLowerCase()
                        .includes(filter.value.toString().toLowerCase());

                case "number-range":
                    if (
                        typeof filter.value?.min === "number" &&
                        typeof filter.value?.max === "number"
                    ) {
                        const num = Number((row as any)[filter.inputName]);
                        return num >= filter.value.min && num <= filter.value.max;
                    }
                    return true;

                case "select":
                    return filter.value === (row as any)[filter.inputName];

                case "date-range":
                    if (filter.value?.from && filter.value?.to) {
                        const date = new Date((row as any)[filter.inputName] as any);
                        return (
                            date >= new Date(filter.value.from) &&
                            date <= new Date(filter.value.to)
                        );
                    }
                    return true;

                default:
                    return true;
            }
        });
    });

    if (sort) {
        const field = sort.column;
        const direction = sort.order.toLowerCase() === 'asc' ? 'asc' : 'desc';

        data = data.sort((a, b) => {
            const valA = (a as any)[field];
            const valB = (b as any)[field];

            if (valA == null && valB == null) return 0;
            if (valA == null) return direction === "asc" ? -1 : 1;
            if (valB == null) return direction === "asc" ? 1 : -1;

            if (typeof valA === "number" && typeof valB === "number") {
                return direction === "asc" ? valA - valB : valB - valA;
            }

            if (typeof valA === "boolean" && typeof valB === "boolean") {
                return direction === "asc"
                    ? Number(valA) - Number(valB)
                    : Number(valB) - Number(valA);
            }

            const strA = valA?.toString() ?? '';
            const strB = valB?.toString() ?? '';
            return direction === "asc"
                ? strA.localeCompare(strB)
                : strB.localeCompare(strA);
        });
    }

    // --- Pagination ---
    if (!Number.isInteger(perPage) || perPage < 1) {
        throw new Error('perPage must be a positive integer, got: ' + perPage);
    }
    const rowsTotalAmount = data.length;
    const pagesTotalAmount = Math.max(1, Math.ceil(rowsTotalAmount / perPage));

    // Clamp page into range
    const currentPage = Math.min(Math.max(page, 1), pagesTotalAmount);

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pagedRows = data.slice(start, end);

    return Promise.resolve({
        rows: pagedRows,
        pagination: {
            currentPage,
            pagesTotalAmount,
            rowsTotalAmount,
            perPageRowsAmount: perPage,
        },
    } as GridData);
}
