<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('detail_info_employee') }}</h2>
            <nuxt-link :to="localePath(`/clients/edit/${route.params.id}`)" class="top-panel__button-edit">
                <svg-icon name="edit" />
                {{ $t('edit') }}
            </nuxt-link>
        </div>
        <div class="content" v-if="client">
            <div class="content__img">
                <img :src="client.avatar_url ? client.avatar_url : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'"
                    alt="">
            </div>
            <div class="content__block-text block-text" v-if="client.first_name">
                <h3 class="block-text__text">{{ $t('first_name') }}</h3>
                <p class="block-text__info">{{ client.first_name }}</p>
            </div>
            <div class="content__block-text block-text" v-if="client.last_name">
                <h3 class="block-text__text">{{ $t('last_name') }}</h3>
                <p class="block-text__info">{{ client.last_name }}</p>
            </div>
            <div class="content__block-text block-text" v-if="client.born_date">
                <h3 class="block-text__text">{{ $t('born_date') }}</h3>
                <p class="block-text__info">{{ moment(client.born_date).format('DD.MM.YYYY') }} ({{ getFullYear }})</p>
            </div>
            <div class="content__block-text block-text" v-if="client.phone_number">
                <h3 class="block-text__text">{{ $t('phone_number') }}</h3>
                <p class="block-text__info">{{ client.phone_number }}</p>
            </div>
            <div class="content__block-text block-text" v-if="client.email">
                <h3 class="block-text__text">{{ $t('email') }}</h3>
                <p class="block-text__info">{{ client.email }}</p>
            </div>
            
            <div class="content__block-text block-text" v-if="client.city">
                <h3 class="block-text__text">{{ $t('city') }}</h3>
                <p class="block-text__info">{{ client.city }}</p>
            </div>
            <div class="content__block-text block-text" v-if="client.vacation_days || client.vacation_days == 0">
                <h3 class="block-text__text">{{ $t('vacation_days') }}</h3>
                <p class="block-text__info">{{ client.vacation_days }}</p>
            </div>
            <div class="content__block-text block-text" v-if="client.description">
                <h3 class="block-text__text">{{ $t('description') }}</h3>
                <p class="block-text__info">{{ client.description }}</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
//imports
import type {ClientInterface} from '../../interface/interface.ts'
import { useClientStore } from '../../stores/clients.ts'
import moment from 'moment'
const clientStore = useClientStore()
const route = useRoute()
const localePath = useLocalePath()

//values
const client: ClientInterface | null = ref(null)

//methods

//computed
const getFullYear = computed((): string => {
    if (client.value) {
        return ''+moment().diff(moment(client.value.born_date).format('YYYY-MM-DD'), 'years');
    }
    return ''
})
const getFullYearWork = computed((): string => {
    if (client.value && employee.value.start_work) {
        return ''+moment().diff(moment(client.value.start_work).format('YYYY-MM-DD'), 'years');
    }
    return ''
})

//hook
onMounted(async (): void => {
    client.value = await clientStore.fetchGetClientById<EmployeeInterface>(route.params.id)
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