<template>
    <div v-if="list.length" class="wrap-list">
        <project-list-item v-for="(item, i) in props.list" :key="i" class="wrap-list__item" :item="item"
            @click-item="clickItem" />
    </div>
    <div v-else class="list-empty">
        <svg-icon class="list-empty__icon" :name="search ? 'search-empty' : 'list'" />
        <p class="list-empty__text">{{ $t(search ? 'search_empty' : 'list_empty') }}</p>
        <app-loader v-if="showLoad" class="list__loader" />
    </div>
</template>
<script setup lang="ts">
//imports
import type { ClientInterface } from '../../interface/interface.ts'

//props
const props = defineProps<{
    list: ClientInterface[],
    showLoad: boolean,
}>()

//emit
const emit = defineEmits(['clickItem'])

//methods
const clickItem = (id: number): void => {
    emit('clickItem', id)
}

</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

.wrap-list {
    display: flex;
    flex-wrap: wrap;

    &>&__item {
        width: calc((100% - 30px) / 4);
    }

    &>&__item:not(:nth-child(4n+4)) {
        margin-right: 10px;
    }

    &>&__item:not(:nth-child(-n+4)) {
        margin-top: 10px;
    }
}

.list-empty {
    position: relative;
    @include flex-column-center;
    justify-content: center;
    min-height: 400px;
    margin-top: 15px;

    &__icon {
        width: 200px;
        height: 200px;
    }

    &__text {
        @include font(24px);
        margin-top: 10px;
        color: (--color-dark);
    }
}
</style>