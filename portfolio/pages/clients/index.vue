<template>
    <div class="wrap-page">
        <h1 class="title-page">{{ $t('clients') }}</h1>
        <div class="top-panel">
            <input @change="searchClients()" class="top-panel__search" type="text" v-model.lazy="search"
                :placeholder="$t('search')">
            <p class="top-panel__text">{{ $t('sort') }}:</p>
            <dropdown class="top-panel__dropdown" @change="searchClients()" v-model="sortBy" :watchValue="'name'"
                :idValue="'type'" :useLocalization="true" :list="store.$state.listSortClients"></dropdown>
            <button v-on:click="changeSort" class="top-panel__button-sort" :class="{'top-panel__button-sort--revers': !sortRevers}">
                <svg-icon name="arrow-sort" />
            </button>
            <button class="top-panel__button-clear" v-on:click="clearFilters" v-if="search || sortBy">{{ $t('clear') }}</button>
            <nuxt-link :to="localePath('/clients/add')" class="top-panel__button">
                {{ $t('add_client') }}
            </nuxt-link>
        </div>
        <list-component :search="search" @clickDelete="(item)=> deleteItem = item" :showDeleteButton="true" :showLoad="showLoad" :useClickEventToItem="true"
            :names="['id', 'avatar', 'first_name', 'last_name', 'phone', 'email']"
            :values="['id', 'avatar_url', 'first_name', 'last_name', 'phone_number', 'email']"
            :list="storeClient.$state.clients" @clickItem="clickItem"></list-component>
            <modal-delete :title="'delete_client'" :text="'are_you_sure_delete_client'" v-if="deleteItem" @delete="deleteClient" @close="deleteItem = null"></modal-delete>
    </div>
</template>
<script lang="ts" setup>
//imports
import { useClientStore } from '../stores/clients.ts'
import { useStore } from '../stores/store.ts'
import type { listDropSimpleInterface, EmployeeInterface, paramsEmployeeInterface } from '../interface/interface.ts'
const storeClient = useClientStore()
const store = useStore()
const router = useRouter()
const localePath = useLocalePath()

//values
const search: Ref<string> = ref('');
const showLoad: Ref<boolean> = ref(false);
const sortBy: Ref<listDropSimpleInterface | null> = ref(null)
const sortRevers: Ref<boolean> = ref(false)
const deleteItem: Ref<EmployeeInterface | null> = ref(null)

//methods 
const clearFilters = (): void => {
    sortRevers.value = false
    sortBy.value = null
    search.value = ''
    searchClients()
}
const changeSort = (): void => {
    sortRevers.value = !sortRevers.value
    if(sortBy.value) {
        searchClients()
    }
}
const clickItem = (item): void => {
    console.log('item', item)
    router.push(localePath(`/clients/${item.id}`))
}
const searchClients = async (): void => {
    let params: paramsEmployeeInterface = {
        search: search.value,
        sort_by: sortBy.value ? sortBy.value.type : '',
        sort_order: sortRevers.value ? 'DESC' : 'ASC'
    }
    localStorage.setItem('paramsClients', JSON.stringify({search: search.value, sortBy: sortBy.value, sortRevers: sortRevers.value}))
    showLoad.value = true
    await storeClient.fetchGetClients(params)
    showLoad.value = false
}
const deleteClient = async (): void => {
    showLoad.value = true
    let id: number | string = deleteItem.value.id
    console.log('id', id);
    deleteItem.value = null
    await storeClient.fetchDeleteClient(id)
    searchClients()
}

//hooks
onMounted(async () => {
   
    let paramsLocalStorage: string = localStorage.getItem('paramsClients')
    if(paramsLocalStorage) {
        let paramsForSet: paramsEmployeeInterface = JSON.parse(paramsLocalStorage)
        search.value = paramsForSet.search
        sortBy.value = paramsForSet.sortBy
        sortRevers.value = paramsForSet.sortRevers == true
    }
    await searchClients()
})
</script>
<style lang="scss" scoped>
@import '../assets/style/mixins.scss';

.title-page {
    margin-bottom: 30px;
}

.top-panel {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    &__button {
        @include button-style;
        margin-left: auto;
    }

    &__search {
        @include input-search;
        width: 300px;
    }

    &__text {
        @include font(14px);
        margin-left: 15px;
    }

    &__dropdown {
        width: 200px;
        margin-left: 10px;
    }
    &__button-sort {
        @include flex-center;
        margin-left: 5px;
        svg {
            height: 30px;
            width: 20px;
        }
        &--revers {
            transform: rotateX(180deg);
        }
    }
    &__button-clear {
        @include button-text-gray-red(14px);
        margin-left: 15px;
    }
}
</style>