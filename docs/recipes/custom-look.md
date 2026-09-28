# Custom look

The grid is styled through CSS variables and BEM classes under `.li-grid`, so you can restyle it from your own stylesheet without touching the package.

## Brand colors

```css
.li-grid {
    --li-grid-header-text: #1d4ed8;
    --li-grid-row-hover: #eff6ff;
    --li-grid-button-bg: #fff;
    --li-grid-button-hover-bg: #eff6ff;
    --li-grid-button-border: #bfdbfe;
    --li-grid-button-text: #1d4ed8;
}
```

## Zebra rows

```css
.li-grid {
    --li-grid-row-stripe: #fafafc;
}

.li-grid--dark {
    --li-grid-row-stripe: #202126;
}
```

Odd rows get the stripe. Use the variable instead of your own `tr { background }` rule so sticky columns are striped too. To stripe even rows instead, see [Zebra rows](../guide/styling#zebra-rows).

## Compact rows

```css
.li-grid .li-grid__table th,
.li-grid .li-grid__table td {
    padding: 6px 8px;
}
```

## Your site's font

```css
.li-grid {
    --li-grid-font-family: inherit;
    --li-grid-font-size: 15px;
}
```

## Only one grid

Every grid instance gets the same classes. Wrap a grid to style just that one:

```vue
<div class="orders-grid">
    <li-grid :config="config" />
</div>
```

```css
.orders-grid .li-grid {
    --li-grid-row-hover: #fef9c3;
}
```

All variables and classes: [Styling](../guide/styling).
