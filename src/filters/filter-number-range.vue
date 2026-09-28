<script lang="ts" setup>
import {GridTranslation} from "../types";

const props = defineProps<{
    translation: GridTranslation,
}>();

const model = defineModel();

if (model.value == '') {
    model.value = {from: '', to: ''};
}
</script>
<template>
    <div>
        <input type="number" :placeholder="translation.filterRangeFrom" v-model="model.from">
        &mdash;
        <input type="number" :placeholder="translation.filterRangeTo" v-model="model.to">
    </div>
</template>
<style lang="scss" scoped>
    input {
        max-width: 100px;
    }
</style>
