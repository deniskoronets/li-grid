<script lang="ts" setup>
import {GridFilter, GridTranslation} from "../types";

const props = defineProps<{
    translation: GridTranslation,
    filter: GridFilter,
}>();

const model = defineModel();
</script>
<template>
    <select v-model="model">
        <option value="%EMPTY_VALUE%">{{ translation.filterSelectEmpty }}</option>
        <option v-for="item in filter.selectItems" :key="item.key" :value="item.key">
            {{ item.value }}
        </option>
    </select>
</template>
