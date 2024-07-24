<template>
    <div class="wrap-modal">
        <div v-on:click="emit('close')" class="wrap-modal__filter"></div>
        <div class="wrap-modal__content">
            <button v-on:click="emit('close')" class="wrap-modal__button-close">
                <svg-icon name="close" />
            </button>
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
//emit
const emit = defineEmits(['close'])
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';
.wrap-modal {
    @include flex-center;
    position: fixed;
    right: 0;
    bottom: 0;
    width: calc(100% - 250px);
    height: 100%;


    &__filter {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
    }
    &__content {
        position: relative;
        min-width: 400px;
        height: max-content;
        border-radius: 8px;
        background-color: var(--color-white);
        border: 1px solid var(--color-gray)
    }
    &__button-close {
        @include flex-center;
        position: absolute;
        top: 10px;
        right: 10px;
        svg {
            width: 30px;
            height: 30px;
        }
    }
}
</style>