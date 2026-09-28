<script lang="ts" setup>
import {GridTranslation} from "../types";

const props = defineProps<{
    translation: GridTranslation,
}>();

const model = defineModel();
</script>
<template>
    <input type="text" :placeholder="translation.filterTextPartial" v-model="model">
</template>
