import {describe, expect, it} from "vitest";
import {wrapObjectArrayWithGrid} from "../src/helpers";
import {GridFilter} from "../src/types";

const rows = [
    {id: 1, name: "Alice", age: 30, role: "admin", joined: "2024-01-10"},
    {id: 2, name: "bob", age: 25, role: "user", joined: "2024-02-15"},
    {id: 3, name: "Charlie", age: 35, role: "user", joined: "2024-03-20"},
    {id: 4, name: "Dave", age: null, role: "guest", joined: "2024-04-25"},
];

const filter = (type: GridFilter["type"], inputName: string, value: any): GridFilter => ({
    label: inputName,
    inputName,
    type,
    value,
});

describe("wrapObjectArrayWithGrid", () => {
    it("returns all rows with pagination when no filters or sort", async () => {
        const result = await wrapObjectArrayWithGrid([], null, 1, rows);

        expect(result.rows).toHaveLength(4);
        expect(result.pagination).toEqual({
            currentPage: 1,
            pagesTotalAmount: 1,
            rowsTotalAmount: 4,
            perPageRowsAmount: 300,
        });
    });

    it("filters text case-insensitively by substring", async () => {
        const result = await wrapObjectArrayWithGrid([filter("text", "name", "B")], null, 1, rows);

        expect(result.rows.map((r: any) => r.id)).toEqual([2]);
    });

    it("filters select by exact match", async () => {
        const result = await wrapObjectArrayWithGrid([filter("select", "role", "user")], null, 1, rows);

        expect(result.rows.map((r: any) => r.id)).toEqual([2, 3]);
    });

    it("filters number-range inclusively", async () => {
        const result = await wrapObjectArrayWithGrid([filter("number-range", "age", {min: 25, max: 30})], null, 1, rows);

        expect(result.rows.map((r: any) => r.id)).toEqual([1, 2]);
    });

    it("ignores number-range without both bounds", async () => {
        const result = await wrapObjectArrayWithGrid([filter("number-range", "age", {min: 25})], null, 1, rows);

        expect(result.rows).toHaveLength(4);
    });

    it("filters date-range inclusively", async () => {
        const result = await wrapObjectArrayWithGrid(
            [filter("date-range", "joined", {from: "2024-02-15", to: "2024-03-20"})],
            null,
            1,
            rows,
        );

        expect(result.rows.map((r: any) => r.id)).toEqual([2, 3]);
    });

    it("skips filters with null or undefined value", async () => {
        const result = await wrapObjectArrayWithGrid(
            [filter("text", "name", null), filter("select", "role", undefined)],
            null,
            1,
            rows,
        );

        expect(result.rows).toHaveLength(4);
    });

    it("combines multiple filters with AND", async () => {
        const result = await wrapObjectArrayWithGrid(
            [filter("select", "role", "user"), filter("text", "name", "char")],
            null,
            1,
            rows,
        );

        expect(result.rows.map((r: any) => r.id)).toEqual([3]);
    });

    it("sorts numbers ascending with nulls first", async () => {
        const result = await wrapObjectArrayWithGrid([], {column: "age", order: "ASC"}, 1, rows);

        expect(result.rows.map((r: any) => r.id)).toEqual([4, 2, 1, 3]);
    });

    it("sorts numbers descending with nulls last", async () => {
        const result = await wrapObjectArrayWithGrid([], {column: "age", order: "DESC"}, 1, rows);

        expect(result.rows.map((r: any) => r.id)).toEqual([3, 1, 2, 4]);
    });

    it("sorts strings with localeCompare", async () => {
        const result = await wrapObjectArrayWithGrid([], {column: "name", order: "ASC"}, 1, rows);

        expect(result.rows.map((r: any) => r.name)).toEqual(["Alice", "bob", "Charlie", "Dave"]);
    });

    it("paginates by 300 rows and clamps the page into range", async () => {
        const many = Array.from({length: 650}, (_, i) => ({id: i + 1}));

        const page2 = await wrapObjectArrayWithGrid([], null, 2, many);
        expect(page2.rows).toHaveLength(300);
        expect((page2.rows[0] as any).id).toBe(301);
        expect(page2.pagination?.pagesTotalAmount).toBe(3);

        const tooFar = await wrapObjectArrayWithGrid([], null, 99, many);
        expect(tooFar.pagination?.currentPage).toBe(3);
        expect(tooFar.rows).toHaveLength(50);

        const tooLow = await wrapObjectArrayWithGrid([], null, 0, many);
        expect(tooLow.pagination?.currentPage).toBe(1);
    });

    it("uses a custom perPage", async () => {
        const many = Array.from({length: 45}, (_, i) => ({id: i + 1}));

        const page3 = await wrapObjectArrayWithGrid([], null, 3, many, 20);
        expect(page3.rows.map((r: any) => r.id)).toEqual([41, 42, 43, 44, 45]);
        expect(page3.pagination).toEqual({
            currentPage: 3,
            pagesTotalAmount: 3,
            rowsTotalAmount: 45,
            perPageRowsAmount: 20,
        });
    });

    it("rejects an invalid perPage", () => {
        expect(() => wrapObjectArrayWithGrid([], null, 1, rows, 0)).toThrow("perPage must be a positive integer");
        expect(() => wrapObjectArrayWithGrid([], null, 1, rows, 2.5)).toThrow("perPage must be a positive integer");
    });

    it("reports one page for empty data", async () => {
        const result = await wrapObjectArrayWithGrid([], null, 1, []);

        expect(result.rows).toEqual([]);
        expect(result.pagination?.pagesTotalAmount).toBe(1);
    });
});
