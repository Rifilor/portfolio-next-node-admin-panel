<template>
    <div class="title">
        <p v-if="showCheckBox">
            <check-box @select="emit('select')" :value="checked"></check-box>
        </p>
        <p class="title__text" v-for="(name, i) in props.names" :key="i">{{ name !== 'id' ? $t(name) : name }}</p>
        <p v-if="showDeleteButton"></p>
    </div>
</template>
<script lang="ts" setup>
//props
const props = defineProps<{
    names: string[],
    showDeleteButton?: boolean,
    showCheckBox?: boolean,
    checked?: boolean,
}>()

//emit
const emit = defineEmits(['select'])
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

.title {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-bottom: 1px solid var(--color-gray);

    &__text {
        @include font(16px);
        @include firstLaterUpercase;
        @include overflowDots;
        color: var(--color-gray-text);
        font-weight: 600;
    }
}
</style>