<script lang="ts" setup>
import {GridTranslation} from "../types";

const props = defineProps<{
    translation: GridTranslation,
}>();

const model = defineModel<any>();

if (model.value == '') {
    model.value = {from: '', to: ''};
}
</script>
<template>
    <div>
        <input type="date" :placeholder="translation.filterRangeFrom" v-model="model.from">
        &mdash;
        <input type="date" :placeholder="translation.filterRangeTo" v-model="model.to">
    </div>
</template>
<style lang="scss" scoped>
    input {
        max-width: 100px;
    }
</style>
