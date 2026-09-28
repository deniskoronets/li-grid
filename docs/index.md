---
layout: home

hero:
  name: LiGrid
  text: Lightweight Vue 3 data grid
  tagline: Server-side filtering, sorting and pagination in one small component.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Live demo
      link: /demo
    - theme: alt
      text: GitHub
      link: https://github.com/deniskoronets/li-grid

features:
  - title: Bring your own backend
    details: One async dataLoader function receives filters, sort and page. Hook it up to any API.
  - title: Built-in filters
    details: Text, select, number range and date range filters that users add on the fly.
  - title: Sorting & pagination
    details: Clickable sortable headers and smart pagination with gaps for large datasets.
  - title: Column toggling
    details: Let users hide columns. Their choice is remembered in localStorage.
  - title: Slots everywhere
    details: Render any cell or header with your own template via named slots.
  - title: Translations
    details: English and Ukrainian included, or pass your own translation object.
---

<div class="home-screenshot">

[![LiGrid demo: users table with avatars, role badges, status indicators, links, tags and action buttons](/demo.png)](/demo)

</div>

<style>
.home-screenshot {
    max-width: 1152px;
    margin: 48px auto 0;
    padding: 0 24px;
    text-align: center;
}

.home-screenshot img {
    display: inline-block;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    transition: transform 0.2s;
}

.home-screenshot a:hover img {
    transform: translateY(-2px);
}
</style>
