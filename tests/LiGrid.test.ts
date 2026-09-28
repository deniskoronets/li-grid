import {afterEach, describe, expect, it, vi} from "vitest";
import {flushPromises, mount} from "@vue/test-utils";
import {h} from "vue";
import LiGrid from "../src/LiGrid.vue";
import {GridConfig, GridData} from "../src/types";
import {GridFormatter} from "../src/formatters";

const rows = [
    {id: 1, name: "Alice", amount: 1500},
    {id: 2, name: "Bob", amount: null},
];

const data = (overrides: Partial<GridData["pagination"]> = {}): GridData => ({
    rows,
    pagination: {
        currentPage: 1,
        pagesTotalAmount: 1,
        rowsTotalAmount: rows.length,
        perPageRowsAmount: 20,
        ...overrides,
    },
});

const makeConfig = (overrides: Partial<GridConfig> = {}): GridConfig => ({
    columns: [
        {label: "ID", value: "id", sortable: "id"},
        {label: "Name", value: "name"},
        {label: "Amount", value: "amount", formatter: GridFormatter.number, contentAlign: "right"},
    ],
    filters: [
        {label: "Name", inputName: "name", type: "text"},
    ],
    dataLoader: vi.fn().mockResolvedValue(data()),
    ...overrides,
});

const mountGrid = async (config: GridConfig, props: Record<string, unknown> = {}) => {
    const wrapper = mount(LiGrid, {props: {config, ...props}});
    await flushPromises();
    return wrapper;
};

afterEach(() => {
    localStorage.clear();
});

describe("LiGrid", () => {
    it("loads data on mount with empty filters, default sort and page 1", async () => {
        const config = makeConfig();
        await mountGrid(config);

        expect(config.dataLoader).toHaveBeenCalledWith([], {column: "", order: "ASC"}, 1);
    });

    it("renders headers, rows, formatted values and n/a for nulls", async () => {
        const wrapper = await mountGrid(makeConfig());

        expect(wrapper.findAll("th").map(th => th.text())).toEqual(["ID", "Name", "Amount"]);

        const bodyRows = wrapper.findAll("tbody tr");
        expect(bodyRows).toHaveLength(2);
        expect(bodyRows[0].findAll("td").map(td => td.text())).toEqual(["1", "Alice", "1,500"]);
        expect(bodyRows[1].findAll("td")[2].text()).toBe("n/a");
        expect(bodyRows[0].findAll("td")[2].classes()).toContain("align-right");
    });

    it("renders function column values", async () => {
        const wrapper = await mountGrid(makeConfig({
            columns: [{label: "Upper", value: (row: any) => row.name.toUpperCase()}],
        }));

        expect(wrapper.find("tbody td").text()).toBe("ALICE");
    });

    it("renders custom slots", async () => {
        const wrapper = mount(LiGrid, {
            props: {config: makeConfig({columns: [{label: "Actions", slotName: "actions"}]})},
            slots: {actions: (props: any) => h("button", `Edit ${props.row.id}`)},
        });
        await flushPromises();

        expect(wrapper.find("tbody button").text()).toBe("Edit 1");
    });

    it("shows the empty state when there are no rows", async () => {
        const wrapper = await mountGrid(makeConfig({
            dataLoader: vi.fn().mockResolvedValue({rows: [], pagination: null}),
        }));

        expect(wrapper.find("tbody").text()).toBe("No data to display");
    });

    it("shows the total rows count", async () => {
        const wrapper = await mountGrid(makeConfig({
            dataLoader: vi.fn().mockResolvedValue(data({rowsTotalAmount: 12345})),
        }));

        expect(wrapper.find(".li-grid__filters p").text()).toContain("12,345");
    });

    it("toggles sort order, emits sortChanged and reloads", async () => {
        const config = makeConfig();
        const wrapper = await mountGrid(config);

        await wrapper.find("th a").trigger("click");
        await flushPromises();

        expect(wrapper.emitted("sortChanged")?.[0][0]).toEqual({column: "id", order: "DESC"});
        expect(config.dataLoader).toHaveBeenLastCalledWith([], {column: "id", order: "DESC"}, 1);
    });

    it("uses defaultSort for the first load", async () => {
        const config = makeConfig({defaultSort: {column: "id", order: "DESC"}});
        await mountGrid(config);

        expect(config.dataLoader).toHaveBeenCalledWith([], {column: "id", order: "DESC"}, 1);
    });

    it("adds a filter and passes only non-empty filters to the loader", async () => {
        const config = makeConfig();
        const wrapper = await mountGrid(config);

        await wrapper.find(".li-grid__filters-list li").trigger("click");
        expect(wrapper.findAll(".li-grid__selected-filter")).toHaveLength(1);

        const load = wrapper.findAll("button.li-grid__add-filter")[1];

        await load.trigger("click");
        await flushPromises();
        expect(config.dataLoader).toHaveBeenLastCalledWith([], expect.anything(), 1);

        await wrapper.find(".li-grid__selected-filter input").setValue("ali");
        await load.trigger("click");
        await flushPromises();
        expect(config.dataLoader).toHaveBeenLastCalledWith(
            [expect.objectContaining({inputName: "name", type: "text", value: "ali"})],
            expect.anything(),
            1,
        );
    });

    it("removes a selected filter", async () => {
        const wrapper = await mountGrid(makeConfig());

        await wrapper.find(".li-grid__filters-list li").trigger("click");
        await wrapper.find(".li-grid__selected-filter-remove").trigger("click");

        expect(wrapper.findAll(".li-grid__selected-filter")).toHaveLength(0);
    });

    it("renders pagination with gaps and navigates between pages", async () => {
        const config = makeConfig({
            dataLoader: vi.fn().mockResolvedValue(data({currentPage: 1, pagesTotalAmount: 10})),
        });
        const wrapper = await mountGrid(config);

        const items = wrapper.findAll(".li-grid__pagination li").map(li => li.text());
        expect(items).toEqual(["1", "2", "3", "—", "10", "Next"]);

        await wrapper.findAll(".li-grid__pagination li")[4].trigger("click");
        await flushPromises();
        expect(config.dataLoader).toHaveBeenLastCalledWith([], expect.anything(), 10);
    });

    it("works without pagination in the loader response", async () => {
        const wrapper = await mountGrid(makeConfig({
            dataLoader: vi.fn().mockResolvedValue({rows}),
        }));

        expect(wrapper.findAll("tbody tr")).toHaveLength(2);
        expect(wrapper.find(".li-grid__pagination").exists()).toBe(false);
        expect(wrapper.find(".li-grid__filters p").exists()).toBe(false);
    });

    it("hides pagination when there is a single page", async () => {
        const wrapper = await mountGrid(makeConfig());

        expect(wrapper.find(".li-grid__pagination").exists()).toBe(false);
    });

    it("hides columns and persists the choice in localStorage", async () => {
        const config = makeConfig({columnsToggle: true, gridKey: "users"});
        const wrapper = await mountGrid(config);

        await wrapper.findAll(".li-grid__columns-list input")[1].trigger("change");

        expect(wrapper.findAll("th").map(th => th.text())).toEqual(["ID", "Amount"]);
        expect(JSON.parse(localStorage.getItem("li-grid-hidden-columns:users")!)).toEqual([1]);

        const remounted = await mountGrid(config);
        expect(remounted.findAll("th").map(th => th.text())).toEqual(["ID", "Amount"]);
    });

    it("does not render the columns toggle unless enabled", async () => {
        const wrapper = await mountGrid(makeConfig());

        expect(wrapper.find(".li-grid__columns-toggle").exists()).toBe(false);
    });

    it("applies sticky classes only to the first and last visible columns", async () => {
        const wrapper = await mountGrid(makeConfig({
            columns: [
                {label: "A", value: "id", sticky: true},
                {label: "B", value: "name", sticky: true},
                {label: "C", value: "amount", sticky: true},
            ],
        }));

        const headers = wrapper.findAll("th");
        expect(headers[0].classes()).toContain("li-grid__sticky-left");
        expect(headers[1].classes()).not.toContain("li-grid__sticky-left");
        expect(headers[1].classes()).not.toContain("li-grid__sticky-right");
        expect(headers[2].classes()).toContain("li-grid__sticky-right");
    });

    it("applies the light theme by default", async () => {
        const wrapper = await mountGrid(makeConfig());

        expect(wrapper.classes()).toEqual(["li-grid", "li-grid--light"]);
    });

    it.each(["dark", "auto"] as const)("applies the %s theme class", async (theme) => {
        const wrapper = await mountGrid(makeConfig({theme}));

        expect(wrapper.classes()).toContain(`li-grid--${theme}`);
    });

    it("adds the stack class only when mobileLayout is 'stack'", async () => {
        expect((await mountGrid(makeConfig())).classes()).not.toContain("li-grid--stack");
        expect((await mountGrid(makeConfig({mobileLayout: "stack"}))).classes()).toContain("li-grid--stack");
    });

    it("labels every data cell with its column for the stacked layout", async () => {
        const wrapper = await mountGrid(makeConfig());

        expect(wrapper.findAll("tbody tr")[0].findAll("td").map(td => td.attributes("data-label")))
            .toEqual(["ID", "Name", "Amount"]);
    });

    it("uses a built-in translation", async () => {
        const wrapper = await mountGrid(makeConfig(), {translation: "uk"});

        expect(wrapper.text()).toContain("Завантажити");
    });

    it("exposes reload()", async () => {
        const config = makeConfig();
        const wrapper = await mountGrid(config);

        (wrapper.vm as any).reload();
        await flushPromises();

        expect(config.dataLoader).toHaveBeenCalledTimes(2);
    });
});
