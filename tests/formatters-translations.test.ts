import {describe, expect, it} from "vitest";
import {escapeHtml, formatters, resolveColumnValue} from "../src/formatters";
import {GridFormatter} from "../src/types";
import {resolveTranslation} from "../src/translations";
import {liGridEnTranslation} from "../src/translations/en";
import {liGridUkTranslation} from "../src/translations/uk";

const column = {label: "Col", value: "v"};

describe("formatters", () => {
    it("formats numbers with en-US thousands separators", () => {
        expect(formatters[GridFormatter.number](1234567.5, column)).toBe("1,234,567.5");
        expect(formatters[GridFormatter.number]("9876", column)).toBe("9,876");
    });

    it("renders images with escaped attributes", () => {
        expect(formatters[GridFormatter.image]("https://picsum.photos/100/100", {label: "Photo"}))
            .toBe('<img src="https://picsum.photos/100/100" alt="Photo" class="li-grid__image" loading="lazy">');

        const html = formatters[GridFormatter.image]('x" onerror="alert(1)', column);
        expect(html).toContain('src="x&quot; onerror=&quot;alert(1)"');
        expect(html).not.toContain('onerror="');
    });

    it("renders nothing for an empty image URL", () => {
        expect(formatters[GridFormatter.image]("", column)).toBe("");
    });
});

describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
        expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`))
            .toBe("&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;");
    });
});

describe("resolveColumnValue", () => {
    it("escapes plain values", () => {
        expect(resolveColumnValue({label: "A", value: "a"}, {a: "<b>bold</b>"})).toBe("&lt;b&gt;bold&lt;/b&gt;");
    });

    it("escapes function values", () => {
        expect(resolveColumnValue({label: "A", value: (row: any) => `<i>${row.a}</i>`}, {a: 1})).toBe("&lt;i&gt;1&lt;/i&gt;");
    });

    it("returns n/a for null and empty string for missing values", () => {
        expect(resolveColumnValue({label: "A", value: "a"}, {a: null})).toBe("n/a");
        expect(resolveColumnValue({label: "A", value: "a"}, {})).toBe("");
        expect(resolveColumnValue({label: "A", value: "a", formatter: GridFormatter.number}, {})).toBe("");
    });

    it("applies the column formatter", () => {
        expect(resolveColumnValue({label: "A", value: "a", formatter: GridFormatter.number}, {a: 1500})).toBe("1,500");
        expect(resolveColumnValue({label: "A", value: "a"}, {a: 0})).toBe("0");
    });
});

describe("resolveTranslation", () => {
    it("resolves built-in languages by ISO code", () => {
        expect(resolveTranslation("en")).toBe(liGridEnTranslation);
        expect(resolveTranslation("uk")).toBe(liGridUkTranslation);
    });

    it("returns a custom translation object as is", () => {
        const custom = {...liGridEnTranslation, load: "Fetch"};

        expect(resolveTranslation(custom)).toBe(custom);
    });

    it("throws on an unknown language", () => {
        expect(() => resolveTranslation("xx")).toThrow("Unknown translation: xx");
    });
});

describe("translations", () => {
    it("uk has every key that en has", () => {
        const missing = Object.keys(liGridEnTranslation).filter(key => !(key in liGridUkTranslation));

        expect(missing).toEqual([]);
    });
});
