<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('detail_info_employee') }}</h2>
            <nuxt-link :to="localePath(`/employees/edit/${route.params.id}`)" class="top-panel__button-edit">
                <svg-icon name="edit" />
                {{ $t('edit') }}
            </nuxt-link>
        </div>
        <div class="content" v-if="employee">
            <div class="content__img">
                <img :src="employee.avatar_url ? employee.avatar_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'"
                    alt="">
            </div>
            <div class="content__block-text block-text" v-if="employee.first_name">
                <h3 class="block-text__text">{{ $t('first_name') }}</h3>
                <p class="block-text__info">{{ employee.first_name }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.last_name">
                <h3 class="block-text__text">{{ $t('last_name') }}</h3>
                <p class="block-text__info">{{ employee.last_name }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.position">
                <h3 class="block-text__text">{{ $t('position') }}</h3>
                <p class="block-text__info">{{ employee.position }} {{ $t(getNamePositionAdding) }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.born_date">
                <h3 class="block-text__text">{{ $t('born_date') }}</h3>
                <p class="block-text__info">{{ moment(employee.born_date).format('DD.MM.YYYY') }} ({{ getFullYear }})</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.phone_number">
                <h3 class="block-text__text">{{ $t('phone_number') }}</h3>
                <p class="block-text__info">{{ employee.phone_number }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.email">
                <h3 class="block-text__text">{{ $t('email') }}</h3>
                <p class="block-text__info">{{ employee.email }}</p>
            </div>
            
            <div class="content__block-text block-text" v-if="employee.city">
                <h3 class="block-text__text">{{ $t('city') }}</h3>
                <p class="block-text__info">{{ employee.city }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.type_work">
                <h3 class="block-text__text">{{ $t('type_work') }}</h3>
                <p class="block-text__info">{{ $t(employee.type_work.replace(' ', '_')) }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.start_work">
                <h3 class="block-text__text">{{ $t('date_start_work') }}</h3>
                <p class="block-text__info">{{ moment(employee.start_work).format('DD.MM.YYYY') }} ({{  getFullYearWork}})</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.vacation_days || employee.vacation_days == 0">
                <h3 class="block-text__text">{{ $t('vacation_days') }}</h3>
                <p class="block-text__info">{{ employee.vacation_days }}</p>
            </div>
            <div class="content__block-text block-text" v-if="employee.description">
                <h3 class="block-text__text">{{ $t('description') }}</h3>
                <p class="block-text__info">{{ employee.description }}</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
//imports
// import type {EmployeeInterface} from '../../interface/interface.ts'
import { useEmployeesStore } from '../../stores/employees.ts'
import moment from 'moment'
const employeesStore = useEmployeesStore()
const route = useRoute()
const localePath = useLocalePath()

//values
const employee: EmployeeInterface | null = ref(null)

//methods

//computed
const getFullYear = computed((): string => {
    if (employee.value) {
        return ''+moment().diff(moment(employee.value.born_date).format('YYYY-MM-DD'), 'years');
    }
    return ''
})
const getFullYearWork = computed((): string => {
    if (employee.value && employee.value.start_work) {
        return ''+moment().diff(moment(employee.value.start_work).format('YYYY-MM-DD'), 'years');
    }
    return ''
})
const getNamePositionAdding = computed((): string => {
    if(employee.value && employee.value.position) {
        let arrayDev = ['frontend', 'backend', 'ios', 'android']
        return arrayDev.indexOf(employee.value.position) >= 0 ? 'developer' : 'manager'
    }
    return ''
})

//hook
onMounted(async (): void => {
    employee.value = await employeesStore.fetchGetEmployeeById<EmployeeInterface>(route.params.id)
})
</script>
<style lang="scss" scoped>
@import '../../assets//style/mixins.scss';

.wrap {
    @include flex-column-center;
    padding: 0 !important;
}

.top-panel {
    @include font(21px);
    padding: 0 50px;
    width: 100%;
    min-height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-gray);
    &__title {
        font-weight: 600;
    }
    &__button-edit {
        margin-left: auto;
        @include button-text-gray;
    }
}

.content {
    padding: 50px;
    width: 100%;
    &__img {
        margin-bottom: 25px;
        width: 300px;
        height: 300px;
        border-radius: 500px;
        overflow: hidden;
        position: relative;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }
}
.block-text {
    margin-top: 12px;
    &__text {
        @include font(14px);
        color: var(--color-gray-text);
        &::after {
            content: ':'
        }
    }
    &__info {
        @include firstLaterUpercase;
        @include font(16px);
        margin-top: 2px;
    }
}
</style>