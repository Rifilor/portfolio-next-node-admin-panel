<template>
    <div class="project-item" @click="emit('clickItem', item.id)">
        <h5 class="project-item__title">{{ $t('name') }}</h5>
        <p class="project-item__text">{{ item.name }}</p>
        <h5 class="project-item__title">{{ $t('budget') }}</h5>
        <p class="project-item__text">{{ item.budget }}</p>
        <h5 class="project-item__title">{{ $t('status') }}</h5>
        <p class="project-item__text">{{ $t(item.status.replace(' ', '_')) }}</p>
        <h5 class="project-item__title double-text"><span>{{ $t('start_date') }}</span> <span>{{ $t('end_date') }}</span></h5>
        <p class="project-item__text double-text"><span>{{ startDate }}</span> <span>{{ endDate }}</span></p>
        <h5 class="project-item__title double-text"><span>{{ $t('client_on_project') }}</span> <span>{{ $t('employee_on_project') }}</span></h5>
        <p class="project-item__text double-text"><span>{{ item.client_ids.length }}</span> <span>{{ item.employee_ids.length }}</span></p>
    </div>
</template>
<script lang="ts" setup>
//imports
import type {ClientInterface} from '../../interface/interface.ts'
import moment from 'moment'

//props
const props = defineProps<{
    item: ClientInterface,
}>()

//emit
const emit = defineEmits(['clickItem'])

//computed
const startDate = computed((): string => {
    return props.item.start_date ? moment(props.item.start_date).format('DD.MM.YYYY') : '-'
})
const endDate = computed((): string => {
    return props.item.end_date ? moment(props.item.end_date).format('DD.MM.YYYY') : '-'
})


</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';
.project-item {
    cursor: pointer;
    border-radius: 8px;
    background-color: var(--color-white);
    border: 1px solid var(--color-gray);
    padding: 15px;
    &__title {
        @include font(13px, 15px);
        color: var(--color-gray-text);
        &:not(:first-child) {
            margin-top: 5px;
        }
    }
    &__text {
        @include overflowDots;
        @include font(14px, 18px)
    }
    transition: .1s linear;
    &:hover {
        border: 1px solid var(--color-gray-text);
        background-color: var(--color-light-gray);;
    }
}
.double-text {
    display: flex;
    span {
        @include overflowDots;
        padding-right: 5px;
        width: 50%;
        display: inline-block;
    }
}
</style>