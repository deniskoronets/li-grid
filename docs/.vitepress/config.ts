import {defineConfig} from "vitepress";

const sponsors = [
    {name: "Mobicard", url: "https://mobicard.com.ua/", logo: "https://mobicard.com.ua/favicon.svg"},
    {name: "BusyB", url: "https://busyb.com.ua/", logo: "https://busyb.com.ua/favicon.svg"},
    {name: "PC-Info", url: "https://pc-info.com.ua/", logo: "https://pc-info.com.ua/favicon.svg"},
    {name: "LinkTrust", url: "https://linktrust.pro/", logo: "https://linktrust.pro/linktrust.svg"},
];

const sponsorsHtml = sponsors
    .map(s => `<a href="${s.url}" title="${s.name}" target="_blank" rel="noopener"><img src="${s.logo}" alt="${s.name}" width="24" height="24" style="display:inline-block;margin:0 6px;vertical-align:middle"></a>`)
    .join("");

export default defineConfig({
    title: "LiGrid",
    description: "Lightweight Vue 3 data grid with filters, sorting, pagination and column toggling.",
    base: "/li-grid/",
    cleanUrls: true,
    lastUpdated: true,

    themeConfig: {
        nav: [
            {text: "Guide", link: "/guide/getting-started"},
            {text: "GridConfig", link: "/config"},
            {text: "Recipes", link: "/recipes/"},
            {text: "API", link: "/api"},
            {text: "Demo", link: "/demo"},
            {text: "npm", link: "https://www.npmjs.com/package/li-grid"},
        ],

        sidebar: [
            {
                text: "Guide",
                items: [
                    {text: "Getting started", link: "/guide/getting-started"},
                    {text: "Loading data", link: "/guide/data-loading"},
                    {text: "Columns", link: "/guide/columns"},
                    {text: "Filters", link: "/guide/filters"},
                    {text: "Translations", link: "/guide/translations"},
                    {text: "Styling", link: "/guide/styling"},
                ],
            },
            {
                text: "Recipes",
                link: "/recipes/",
                items: [
                    {text: "API backend", link: "/recipes/api-backend"},
                    {text: "In-memory data", link: "/recipes/client-side"},
                    {text: "Row actions", link: "/recipes/row-actions"},
                    {text: "Custom cells", link: "/recipes/custom-cells"},
                    {text: "Dark mode toggle", link: "/recipes/dark-mode"},
                    {text: "Auto refresh", link: "/recipes/auto-refresh"},
                    {text: "Custom look", link: "/recipes/custom-look"},
                ],
            },
            {
                text: "Reference",
                items: [
                    {
                        text: "GridConfig",
                        link: "/config",
                        collapsed: false,
                        items: [
                            {text: "columns", link: "/config#columns"},
                            {text: "filters", link: "/config#filters"},
                            {text: "dataLoader", link: "/config#dataloader"},
                            {text: "defaultSort", link: "/config#defaultsort"},
                            {text: "columnsToggle", link: "/config#columnstoggle"},
                            {text: "gridKey", link: "/config#gridkey"},
                            {text: "theme", link: "/config#theme"},
                            {text: "mobileLayout", link: "/config#mobilelayout"},
                        ],
                    },
                    {text: "API", link: "/api"},
                    {text: "Live demo", link: "/demo"},
                ],
            },
        ],

        socialLinks: [
            {icon: "github", link: "https://github.com/deniskoronets/li-grid"},
            {icon: "npm", link: "https://www.npmjs.com/package/li-grid"},
        ],

        editLink: {
            pattern: "https://github.com/deniskoronets/li-grid/edit/main/docs/:path",
        },

        search: {provider: "local"},

        footer: {
            message: `Sponsored by ${sponsorsHtml}`,
            copyright: `Released under the Apache 2.0 License. Created by <a href="https://github.com/deniskoronets/">Denys Koronets</a>.`,
        },
    },
});
