<template>
    <div v-if="getCountItems" class="list" :class="{ 'show-loader': showLoad }">
        <list-title :checked="checkedAll" :show-check-box="showCheckBox" :show-delete-button="props.showDeleteButton"
            class="grid-settings" :style="{ 'grid-template-columns': gridColumns }" :names="props.names"
            @select="selectAll" />
        <div v-for="(item, i) in props.list" :key="i" class="wrap-item"
            :class="{ 'wrap-item--hover': useClickEventToItem }">
            <div v-if="useClickEventToItem" :style="{ 'width': props.showDeleteButton ? 'calc(100% - 50px)' : '' }"
                class="click-zone" @click="emit('clickItem', item)" />
            <list-item :checked="selected.indexOf(item.id) >= 0" :show-delete-button="props.showDeleteButton"
                :show-check-box="showCheckBox" class="grid-settings wrap-item__item"
                :style="{ 'grid-template-columns': gridColumns }" :item="item" :values="props.values"
                @select="select(item.id)" @click-delete="$emit('clickDelete', item)" />
        </div>
        <app-loader v-if="showLoad" class="list__loader" />
    </div>
    <div v-else class="list-empty">
        <svg-icon class="list-empty__icon" :name="search ? 'search-empty' : 'list'" />
        <p class="list-empty__text">{{ $t(search ? 'search_empty' : 'list_empty') }}</p>
        <app-loader v-if="showLoad" class="list__loader" />
    </div>
</template>
<script setup lang="ts">
//props
const props = defineProps<{
    search?: string,
    showDeleteButton?: boolean,
    showCheckBox?: boolean,
    names: string[],
    values: string[],
    list: unknown[],
    useClickEventToItem?: boolean,
    showLoad?: boolean,
}>()

//emits
const emit = defineEmits(['clickItem', 'clickDelete'])

//values
const selected: Ref<number[]> = ref([])

//methods
const select = (id: number): void => {
    if (selected.value.indexOf(id) >= 0) {
        selected.value.splice(selected.value.indexOf(id), 1)
    } else {
        selected.value.push(id)
    }
    emit('changeSelect', selected.value)
}
const selectAll = (): void => {
    if (checkedAll.value) {
        selected.value = []
    } else {
        selected.value = props.list.map(el => { return el.id })
    }
    emit('changeSelect', selected.value)
}

//computed
const checkedAll = computed((): boolean => {
    return props.list.filter(el => selected.value.indexOf(el.id) == -1).length == 0
})
const getCountItems = computed((): number => {
    return props.list.length
})
const gridColumns = computed((): string => {
    let text = ''
    if (props.showCheckBox) {
        text += '50px '
    }
    props.values.forEach(nameValue => {
        if (nameValue == 'id') {
            text += '45px '
        } else if (nameValue == 'avatar_url') {
            text += '100px '
        } else {
            text += '1fr '
        }
    })
    if (props.showDeleteButton) {
        text += '50px '
    }
    return text
})
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

.grid-settings {
    display: grid;
    grid-template-rows: 1fr;
    grid-auto-columns: 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
}

.list {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--color-gray);

    &>*:nth-child(odd) {
        background-color: var(--color-light-gray);
    }

    &>*:nth-child(even) {
        background-color: var(--color-white);
    }
}

.wrap-item {
    position: relative;

    &--hover {
        &:hover {
            .wrap-item__item {
                background-color: var(--color-hover);
                ;
            }
        }
    }
}

.click-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.show-loader {
    min-height: 100px;
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