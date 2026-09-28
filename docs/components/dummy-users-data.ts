export const roles = ["admin", "editor", "viewer"];
export const statuses = ["active", "away", "blocked"];
export const countries = [
    {flag: "🇺🇦", name: "Ukraine"},
    {flag: "🇵🇱", name: "Poland"},
    {flag: "🇩🇪", name: "Germany"},
    {flag: "🇺🇸", name: "USA"},
    {flag: "🇯🇵", name: "Japan"},
];

const firstNames = ["Olena", "Taras", "Iryna", "Andrii", "Sofia", "Mykola", "Kateryna", "Bohdan", "Oksana", "Dmytro"];
const lastNames = ["Shevchenko", "Kovalenko", "Bondarenko", "Tkachenko", "Kravchenko", "Melnyk", "Boyko", "Moroz"];
const skills = ["vue", "php", "design", "sql", "devops", "mobile", "ai"];

export interface DummyUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: string;
    status: string;
    country: string;
    flag: string;
    tags: string[];
    progress: number;
    rating: number;
    verified: boolean;
    activity: number[];
    balance: number;
    createdAt: string;
}

/**
 * Seeded random generator (mulberry32): same seed, same numbers.
 * Keeps the demo data identical on every page load.
 */
const createRandom = (seed: number) => {
    const next = (): number => {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    return {
        int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
        pick: <T, >(list: T[]): T => list[Math.floor(next() * list.length)],
        chance: (probability: number) => next() < probability,
    };
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

export function dummyUsersDataGenerator(count = 1250, seed = 42): DummyUser[] {
    const random = createRandom(seed);

    return Array.from({length: count}, (_, index): DummyUser => {
        const id = index + 1;
        const firstName = random.pick(firstNames);
        const lastName = random.pick(lastNames);
        const country = random.pick(countries);

        return {
            id,
            name: `${firstName} ${lastName}`,
            email: `${firstName}.${lastName}${id}@example.com`.toLowerCase(),
            avatar: `https://picsum.photos/100/100?random=${id}`,
            role: random.pick(roles),
            status: random.pick(statuses),
            country: country.name,
            flag: country.flag,
            tags: skills.filter(() => random.chance(0.3)),
            progress: random.int(0, 100),
            rating: random.int(1, 5),
            verified: random.chance(0.6),
            activity: Array.from({length: 12}, () => random.int(0, 100)),
            balance: random.int(0, 150000),
            createdAt: toIsoDate(new Date(2024, 0, random.int(1, 600))),
        };
    });
}
