<template>
    <modal-slots @close="emit('close')">
        <div class="content">
            <h2 class="content__title">{{ $t(props.title) }}</h2>
            <p class="content__text">{{ $t(props.text) }}</p>
        </div>
        <div class="bottom-panel">
            <button class="bottom-panel__button-cancel" @click="emit('close')">{{ $t('cancel') }}</button>
            <button class="bottom-panel__button-delete" @click="emit('delete')">{{ $t('delete') }}</button>
        </div>
    </modal-slots>
</template>
<script setup lang="ts">
//emit
const emit = defineEmits(['close', 'delete'])

//props
const props = defineProps<{
    title: string,
    text: string,
}>()
</script>
<style lang="scss" scoped>
@import '../../assets//style/mixins.scss';

.content {
    padding: 20px;
    width: 100%;

    &__title {
        @include font(20px, 24px);
        font-weight: 600;
    }

    &__text {
        margin-top: 25px;
        @include font(16px, 18px);
        margin-bottom: 17px;
    }

}

.bottom-panel {
    width: 100%;
    display: flex;
    padding: 10px 20px;
    border-top: 1px solid var(--color-gray);

    &__button-cancel {
        margin-left: auto;
        @include button-text-gray(15px);
    }

    &__button-delete {
        margin-left: 15px;
        @include button-style-red(120px);
    }
}
</style>