// @vitest-environment jsdom
import {describe, expect, it} from "vitest";
import {flushPromises, mount} from "@vue/test-utils";
import LiGrid from "../src/LiGrid.vue";
import {resolveColumnValue} from "../src/formatters";
import {GridColumn, GridFormatter} from "../src/types";

// Parse the HTML like the browser does for v-html
const render = (html: string) => {
    const cell = document.createElement("span");
    cell.innerHTML = html;
    return cell;
};

const eventHandlerAttributes = (root: Element) => [...root.querySelectorAll("*")]
    .flatMap(el => [...el.attributes].map(a => a.name))
    .filter(name => name.startsWith("on"));

const payloads = [
    `x" onclick="somejsshit()`,
    `x' onclick='somejsshit()`,
    `x" onerror="alert(1)" y="`,
    `"><script>alert(1)</script>`,
    `"><img src=x onerror=alert(1)>`,
    `<b onclick="somejsshit()">click me</b>`,
    `<svg onload=alert(1)>`,
    `&quot; onclick=&quot;alert(1)`,
];

const textColumn: GridColumn = {label: "Name", value: "v"};
const imageColumn: GridColumn = {label: "Photo", value: "v", formatter: GridFormatter.image};
const numberColumn: GridColumn = {label: "Amount", value: "v", formatter: GridFormatter.number};
const functionColumn: GridColumn = {label: "Fn", value: (row: any) => row.v};

describe("XSS: text cells", () => {
    it.each(payloads)("renders %s as plain text", (payload) => {
        for (const column of [textColumn, functionColumn]) {
            const cell = render(resolveColumnValue(column, {v: payload}));

            expect(cell.children).toHaveLength(0);
            expect(cell.textContent).toBe(payload);
        }
    });
});

describe("XSS: image cells", () => {
    it.each(payloads)("keeps %s inside the src attribute", (payload) => {
        const cell = render(resolveColumnValue(imageColumn, {v: payload}));
        const imgs = cell.querySelectorAll("img");

        expect(imgs).toHaveLength(1);
        expect(cell.querySelectorAll("*")).toHaveLength(1);
        expect([...imgs[0].attributes].map(a => a.name).sort()).toEqual(["alt", "class", "loading", "src"]);
        expect(imgs[0].getAttribute("src")).toBe(payload);
        expect(eventHandlerAttributes(cell)).toEqual([]);
    });

    it("escapes the column label in alt", () => {
        const cell = render(resolveColumnValue({...imageColumn, label: `x" onload="alert(1)`}, {v: "a.png"}));

        expect(eventHandlerAttributes(cell)).toEqual([]);
        expect(cell.querySelector("img")!.getAttribute("alt")).toBe(`x" onload="alert(1)`);
    });
});

describe("XSS: number cells", () => {
    it.each(payloads)("renders %s without markup", (payload) => {
        const cell = render(resolveColumnValue(numberColumn, {v: payload}));

        expect(cell.children).toHaveLength(0);
    });
});

describe("XSS: rendered grid", () => {
    it("renders payloads in every cell type without creating elements or handlers", async () => {
        const rows = payloads.map(v => ({v}));
        const wrapper = mount(LiGrid, {
            props: {
                config: {
                    columns: [textColumn, imageColumn, numberColumn, functionColumn],
                    filters: [],
                    dataLoader: () => Promise.resolve({rows}),
                },
            },
        });
        await flushPromises();

        const body = wrapper.find("tbody").element;

        expect(body.querySelectorAll("script, svg, b")).toHaveLength(0);
        expect(body.querySelectorAll("img")).toHaveLength(payloads.length);
        expect(eventHandlerAttributes(body)).toEqual([]);
    });
});
