# Live demo

1,250 generated users, filtered, sorted and paginated in the browser with `wrapObjectArrayWithGrid`. Cells show what slots can render: images, badges, status dots, links, tags, progress bars, star ratings, toggles, inline SVG charts and buttons.

Try adding filters, sorting by a column, hiding columns with **Columns**, and scrolling sideways: **User** and **Actions** stay pinned. On a phone (or a narrow browser window) rows turn into cards.

<UsersDemo />

## Source

The component behind this page. It uses the local source (`../../src`) and VitePress's `useData()` for the theme; in your app import from `"li-grid"` instead.

<<< @/components/UsersDemo.vue
