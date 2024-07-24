<template>
    <modal-slots @close="emit('close')">
        <div class="modal-content">
            <div class="top-panel">
                <h2 class="top-panel__title">{{ $t(props.employeMode ? 'add_employees_to_project' :
                    'add_clients_to_project') }}</h2>
            </div>
            <div class="sort-block">
                <input @change="searchList()" class="sort-block__search" type="text" v-model.lazy="search"
                    :placeholder="$t('search')">
                <p class="sort-block__text">{{ $t('sort') }}:</p>
                <dropdown class="sort-block__dropdown" @change="searchList()" v-model="sortBy" :watchValue="'name'"
                    :idValue="'type'" :useLocalization="true"
                    :list="props.employeMode ? store.$state.listSortEmployee : store.$state.listSortClients"></dropdown>
                <button v-on:click="changeSort" class="sort-block__button-sort"
                    :class="{ 'sort-block__button-sort--revers': !sortRevers }">
                    <svg-icon name="arrow-sort" />
                </button>
                <button class="sort-block__button-clear" v-on:click="clearFilters" v-if="search || sortBy">{{
                    $t('clear') }}</button>
            </div>
            <div class="wrap-list">
                <list-component @changeSelect="changeSelect" :showCheckBox="true" :names="getNames" :values="getValues"
                :list="props.employeMode ? storeEmployee.$state.employees : storeClient.$state.clients" :search="search"
                :showDeleteButton="false" :showLoad="showLoad"></list-component>
            </div>
         
            <div class="bottom-panel">
                <button class="bottom-panel__button-cancel" v-on:click="emit('close')">{{ $t('cancel') }}</button>
                <button class="bottom-panel__button-add" v-on:click="clickAdd">{{ $t('add') }}</button>
            </div>
        </div>
    </modal-slots>
</template>
<script setup lang="ts">
//imports
import { useClientStore } from '../../stores/clients.ts'
import { useEmployeesStore } from '../../stores/employees.ts'
import { useStore } from '../../stores/store.ts'
import type { listDropSimpleInterface, EmployeeInterface, paramsEmployeeInterface, ProjectInterface } from '../../interface/interface.ts'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const storeClient = useClientStore()
const storeEmployee = useEmployeesStore()
const store = useStore()

//props
const props = defineProps<{
    employeMode: boolean,
    project: ProjectInterface,
}>()

//emit
const emit = defineEmits(['close', 'clickAdd'])

//values
const search: Ref<string> = ref('');
const sortBy: Ref<listDropSimpleInterface | null> = ref(null)
const sortRevers: Ref<boolean> = ref(false)
const showLoad: Ref<boolean> = ref(false)
const selected: Ref<number[]> = ref([])

//methods
const clickAdd = (): void => {
    const arrayIds: number[] = selected.value.filter(id => !(props.employeMode ? props.project.employee_ids : props.project.client_ids).includes(id)) // array without added clients/employees
    if(arrayIds.length) {
        emit('clickAdd', arrayIds)
    } else if(selected.value.length) {
        store.addTip(i18n.t(props.employeMode ? 'this_employee_was_added_to_prpoject' : 'this_client_was_added_to_prpoject'))
    } else {
        store.addTip(i18n.t('choose_someone'))
    }

}
const changeSelect = (items: number[]): void => {
    selected.value = items
}
const searchEmployees = async (): void => {
    let params: paramsEmployeeInterface = {
        search: search.value,
        sort_by: sortBy.value ? sortBy.value.type : '',
        sort_order: sortRevers.value ? 'DESC' : 'ASC'
    }
    showLoad.value = true
    await storeEmployee.setEmployeeFromServer(params)
    showLoad.value = false
}
const searchClients = async (): void => {
    let params: paramsEmployeeInterface = {
        search: search.value,
        sort_by: sortBy.value ? sortBy.value.type : '',
        sort_order: sortRevers.value ? 'DESC' : 'ASC'
    }
    showLoad.value = true
    await storeClient.fetchGetClients(params)
    showLoad.value = false
}
const changeSort = (): void => {
    sortRevers.value = !sortRevers.value
    if (sortBy.value) {
        searchList()
    }
}
const clearFilters = (): void => {
    sortRevers.value = false
    sortBy.value = null
    search.value = ''
    searchList()
}
const searchList = (): void => {
    if (props.employeMode) {
        searchEmployees()
    } else {
        searchClients()
    }
}

//computed
const getNames = computed((): string[] => {
    let names: string[] = ''
    if (props.employeMode) {
        names = ['id', 'avatar', 'first_name', 'last_name', 'position', 'phone', 'email']
    } else {
        names = ['id', 'avatar', 'first_name', 'last_name', 'phone', 'email']
    }
    return names
})
const getValues = computed((): string[] => {
    let names: string[] = ''
    if (props.employeMode) {
        names = ['id', 'avatar_url', 'first_name', 'last_name', 'position', 'phone_number', 'email']
    } else {
        names = ['id', 'avatar_url', 'first_name', 'last_name', 'phone_number', 'email']
    }
    return names
})

//hook
onMounted(async () => {
    searchList()
})
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

.modal-content {
    width: 1200px;
    padding: 20px;

}

.top-panel {
    margin-bottom: 20px;
    width: 100%;

    &__title {
        @include font(20px, 24px);
        font-weight: 600;
    }
}

.sort-block {
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

.bottom-panel {
    margin-top: 20px;
    width: 100%;
    display: flex;
    padding: 10px 20px;

    &__button-cancel {
        margin-left: auto;
        @include button-text-gray(15px);
    }

    &__button-add {
        margin-left: 15px;
        @include button-style(120px);
    }
}
.wrap-list {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
}
</style>