import {describe, expect, it} from "vitest";
import {formatters, GridFormatter} from "../src/formatters";
import {resolveTranslation} from "../src/translations";
import {liGridEnTranslation} from "../src/translations/en";
import {liGridUkTranslation} from "../src/translations/uk";

describe("formatters", () => {
    it("formats numbers with en-US thousands separators", () => {
        expect(formatters[GridFormatter.number](1234567.5)).toBe("1,234,567.5");
        expect(formatters[GridFormatter.number]("9876")).toBe("9,876");
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
