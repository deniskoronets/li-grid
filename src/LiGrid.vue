<script setup lang="ts">
import {GridColumn, GridConfig, GridData, GridFilter, GridSort, GridTranslation} from "./types";
import {computed, onMounted, ref} from "vue";
import {formatters} from "./formatters";
import CaretDown from "./icons/caret-down.vue";
import CaretUp from "./icons/caret-up.vue";
import FilterEdit from "./icons/filter-edit.vue";
import ChevronDown from "./icons/chevron-down.vue";
import FilterText from "./filters/filter-text.vue";
import FilterNumberRange from "./filters/filter-number-range.vue";
import X from "./icons/x.vue";
import Reload from "./icons/reload.vue";
import {liGridEnTranslation} from "./translations/en";
import {resolveTranslation} from "./translations";
import FilterSelect from "./filters/filter-select.vue";
import FilterDateRange from "./filters/filter-date-range.vue";

const props = defineProps<{
    config: GridConfig,
    translation?: string | GridTranslation,
}>();

const translation = ref(props.translation ? resolveTranslation(props.translation) : liGridEnTranslation);

const emit = defineEmits<{
    (e: 'filtersChanged'): void,
    (e: 'sortChanged', sort: GridSort): void,
    (e: 'pagination', page: string): void,
}>();

const selectedFilters = ref([] as GridFilter[]);

const hiddenColumnsStorageKey = props.config.gridKey ? `li-grid-hidden-columns:${props.config.gridKey}` : null;

const loadHiddenColumns = (): Set<number> => {
    if (!hiddenColumnsStorageKey) {
        return new Set<number>();
    }

    try {
        const stored = localStorage.getItem(hiddenColumnsStorageKey);
        return stored ? new Set(JSON.parse(stored)) : new Set<number>();
    } catch (e) {
        return new Set<number>();
    }
};

const hiddenColumns = ref(loadHiddenColumns());

const saveHiddenColumns = () => {
    if (!hiddenColumnsStorageKey) {
        return;
    }

    try {
        localStorage.setItem(hiddenColumnsStorageKey, JSON.stringify([...hiddenColumns.value]));
    } catch (e) {
        // ignore storage errors (e.g. private browsing)
    }
};

const toggleColumn = (index: number) => {
    if (hiddenColumns.value.has(index)) {
        hiddenColumns.value.delete(index);
    } else {
        hiddenColumns.value.add(index);
    }
    saveHiddenColumns();
};

const visibleColumns = computed(() => props.config.columns.filter((_, index) => !hiddenColumns.value.has(index)));

const stickyClass = (column: GridColumn, index: number) => {
    if (!column.sticky) {
        return {};
    }

    if (index === 0) {
        return {'li-grid__sticky-left': true};
    }

    if (index === visibleColumns.value.length - 1) {
        return {'li-grid__sticky-right': true};
    }

    return {};
};

const sort = ref(props.config.defaultSort ? props.config.defaultSort : {
    column: '',
    order: 'ASC',
} as GridSort);

const isLoading = ref(false);

const gridData = ref(null as null | GridData);

const toggleSort = (column: GridColumn) => {
    sort.value.column = column.sortable;
    sort.value.order = sort.value.order == 'ASC' ? 'DESC' : 'ASC';
    emit('sortChanged', sort.value);
    loadData();
};

const currentPage = ref(1);

const loadData = () => {
    isLoading.value = true;
    props.config.dataLoader(
        selectedFilters.value.filter(filter => filter.value !== '%EMPTY_VALUE%' && filter.value !== ''),
        sort.value,
        currentPage.value
    ).then((data: GridData) => {
        gridData.value = data;
        isLoading.value = false;
    });
};

const goToPage = (page: number) => {
    currentPage.value = page;
    loadData();
};


const applyFormatters = (column: GridColumn, value: any) => {
    if (!column.formatter) {
        return value;
    }

    return formatters[column.formatter](value);
};

const addFilter = (filter: GridFilter) => {
    selectedFilters.value.push({...filter, value: ''});
};

const removeFilter = (filterIndex: number) => {
    selectedFilters.value.splice(filterIndex, 1);
}

function paginationPages(currentPage: number, totalAmountPages: number): number[] {
    const pages: number[] = [];
    const delta = 2;

    if (totalAmountPages <= 7) {
        return Array.from({ length: totalAmountPages }, (_, i) => i + 1);
    }

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalAmountPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
        pages.push(-1); // Gap indicator
    }

    for (let i = left; i <= right; i++) {
        pages.push(i);
    }

    if (right < totalAmountPages - 1) {
        pages.push(-1); // Gap indicator
    }

    pages.push(totalAmountPages);

    return pages;
}

onMounted(() => {
    loadData();
});

defineExpose({
    reload: loadData,
});
</script>

<template>
    <div :class="['li-grid', `li-grid--${config.theme ?? 'light'}`, {'li-grid--stack': config.mobileLayout === 'stack'}]">
        <div class="li-grid__filters">
            <filter-edit></filter-edit>
            {{ translation.filters }}
            <button class="li-grid__add-filter li-grid__dropdown">
                {{ translation.addFilter }}
                <chevron-down></chevron-down>

                <ul class="dropdown-content li-grid__filters-list">
                    <li v-for="filter in config.filters" @click="addFilter(filter)">
                        {{ filter.label }} <small>({{ translation['filterLabel-' + filter.type] }})</small>
                    </li>
                </ul>
            </button>
            <div v-for="(filter, filterIndex) in selectedFilters" class="li-grid__selected-filter">
                <label>{{ filter.label }}</label>

                <filter-select v-if="filter.type == 'select'" v-model="filter.value" :filter="filter" :translation="translation"></filter-select>
                <filter-text v-if="filter.type == 'text'" v-model="filter.value" :translation="translation"></filter-text>
                <filter-number-range v-if="filter.type == 'number-range'" v-model="filter.value" :translation="translation"></filter-number-range>
                <filter-date-range v-if="filter.type == 'date-range'" v-model="filter.value" :translation="translation"></filter-date-range>

                <x @click="removeFilter(filterIndex)" class="li-grid__selected-filter-remove"></x>
            </div>
            <button class="li-grid__add-filter" @click="loadData" :disabled="isLoading">
                {{ translation.load }}
                <reload></reload>
            </button>
            <p v-if="gridData && gridData.pagination">
                {{ translation.total }} <b>{{ Number(gridData.pagination.rowsTotalAmount).toLocaleString('en-US') }}</b>
                {{ translation.rowsFound }}, <b>{{ gridData.pagination.perPageRowsAmount }}</b> {{ translation.perPage }}.
            </p>
            <button v-if="config.columnsToggle" class="li-grid__add-filter li-grid__dropdown li-grid__columns-toggle">
                {{ translation.columns }}
                <chevron-down></chevron-down>

                <ul class="dropdown-content li-grid__columns-list">
                    <li v-for="(column, index) in config.columns" :key="index">
                        <label>
                            <input type="checkbox" :checked="!hiddenColumns.has(index)" @change="toggleColumn(index)">
                            {{ column.label }}
                        </label>
                    </li>
                </ul>
            </button>
        </div>
        <div class="li-grid__responsive-table">
            <table class="li-grid__table">
                <thead>
                    <tr>
                        <th v-for="(column, index) in visibleColumns" :key="index" :class="[column.headerClasses ?? [], stickyClass(column, index)]" :style="column.width ? {'min-width': column.width} : {}">
                            <template v-if="column.sortable">
                                <a href="#" @click.prevent="toggleSort(column)">
                                    <span v-if="!column.headerSlotName">
                                        {{ column.label }}
                                    </span>
                                    <span v-else>
                                        <slot :name="column.headerSlotName" :column="column"></slot>
                                    </span>

                                    <caret-down v-if="sort.column == column.sortable && sort.order == 'DESC'"></caret-down>
                                    <caret-up v-if="sort.column == column.sortable && sort.order == 'ASC'"></caret-up>
                                </a>
                            </template>
                            <template v-else>
                                <span v-if="!column.headerSlotName">
                                    {{ column.label }}
                                </span>
                                <span v-else>
                                    <slot :name="column.headerSlotName" :column="column"></slot>
                                </span>
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                <tr v-if="isLoading" key="loading">
                    <td :colspan="visibleColumns.length">
                        {{ translation.loading }}
                    </td>
                </tr>
                <template v-else>
                    <tr v-if="(gridData ? gridData.rows : []).length == 0" key="empty">
                        <td :colspan="visibleColumns.length">
                            {{ translation.noData }}
                        </td>
                    </tr>
                    <tr v-for="(row, rowIndex) in (gridData ? gridData.rows : [])" :key="rowIndex">
                        <td v-for="(column, index) in visibleColumns"
                            :key="index"
                            :data-label="column.label"
                            :class="{'align-left': !column.contentAlign || column.contentAlign == 'left', 'align-center': column.contentAlign == 'center', 'align-right': column.contentAlign == 'right', ...stickyClass(column, index)}"
                            :style="column.width ? {'min-width': column.width} : {}">
                            <template v-if="column.slotName">
                                <slot :name="column.slotName" :row="row"></slot>
                            </template>
                            <template v-if="column.value">
                                <template v-if="typeof column.value == 'string'">
                                    {{ row[column.value] !== null ? applyFormatters(column, row[column.value]) : 'n/a' }}
                                </template>
                                <template v-else>
                                    {{ column.value(row) }}
                                </template>
                            </template>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
        <div class="li-grid__pagination" v-if="gridData && gridData.pagination && gridData.pagination.pagesTotalAmount > 1">
            <ul>
                <li v-if="gridData.pagination.currentPage > 1" @click="goToPage(gridData.pagination.currentPage - 1)" key="prev">
                    {{ translation.prevPage }}
                </li>
                <template v-for="page in paginationPages(gridData.pagination.currentPage, gridData.pagination.pagesTotalAmount)"
                          :key="page">
                    <li v-if="page > 0"
                        @click="goToPage(page)"
                        :class="{active: page == gridData.pagination.currentPage}">
                        {{ page }}
                    </li>
                    <li v-else class="empty">
                        &mdash;
                    </li>
                </template>
                <li v-if="gridData.pagination.currentPage < gridData.pagination.pagesTotalAmount" @click="goToPage(gridData.pagination.currentPage + 1)" key="next">
                    {{ translation.nextPage }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss">
@import "styles";
</style>
