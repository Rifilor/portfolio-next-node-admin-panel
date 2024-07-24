<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('detail_info_projects') }}</h2>
            <nuxt-link :to="localePath(`/projects/edit/${route.params.id}`)" class="top-panel__button-edit">
                <svg-icon name="edit" />
                {{ $t('edit') }}
            </nuxt-link>
        </div>
        <app-loader v-if="showLoad"></app-loader>
        <div class="content" v-if="project">
            <div class="block-info">
                <h3 class="content__title">{{ $t('name') }}</h3>
                <h2 class="content__name">{{ project.name }}</h2>
                <h3 class="content__title">{{ $t('status') }}</h3>
                <p class="content__text">{{ $t(project.status.replace(' ', '_')) }}</p>
                <h3 class="content__title">{{ $t('budget') }}</h3>
                <p class="content__text">{{ project.budget }}</p>
                <h3 class="content__title">{{ $t('start_date') }}</h3>
                <p class="content__text">{{ startDate }}</p>
                <h3 class="content__title">{{ $t('end_date') }}</h3>
                <p class="content__text">{{ endDate }}</p>
            </div>
            <div class="block-info">
                <h3 class="content__title">{{ $t('description') }}</h3>
                <p class="content__text">{{ project.description }}</p>
            </div>

        </div>
        <div class="block-list">
            <div class="clients">
                <button class="block-list__button-add" v-on:click="showModalAddClient = true">{{ $t('add') }}</button>
                <h2 class="block-list__title">{{ $t('clients') }}</h2>
                <div class="clients__list">
                    <list-component @clickDelete="(item) => deleteItemClient = item" :showDeleteButton="true" class=""
                        :list="clients" :names="['avatar', 'first_name', 'last_name']"
                        :values="['avatar_url', 'first_name', 'last_name']"></list-component>
                </div>
            </div>
            <div class="employees">
                <button class="block-list__button-add" v-on:click="showModalAddEmployees = true">{{ $t('add') }}</button>
                <h2 class="block-list__title">{{ $t('employees') }}</h2>
                <div class="employees__list">
                    <list-component @clickDelete="(item) => deleteItemEmployee = item" :showDeleteButton="true" class=""
                        :list="employees" :names="['avatar', 'position', 'first_name', 'last_name']"
                        :values="['avatar_url', 'position', 'first_name', 'last_name']"></list-component>

                </div>
            </div>
        </div>
        <modal-delete @delete="deleteItem" v-if="deleteItemClient || deleteItemEmployee" @close="closeModalDelete"
            :title="deleteItemClient ? 'remove_client_from_project' : 'remove_employee_from_project'"
            :text="deleteItemClient ? 'remove_client_from_project_text' : 'remove_employee_from_project_text'"></modal-delete>
        <modal-add-to-project-clients-and-users @clickAdd="clickAddModal" :project="project" :employeMode="showModalAddEmployees" v-if="showModalAddEmployees || showModalAddClient" @close="closeModalAdd"></modal-add-to-project-clients-and-users>
    </div>
</template>
<script lang="ts" setup>
//imports
import type { ProjectInterface, EmployeeInterface, ClientInterface } from '../../interface/interface.ts'
import { useProjectsStore } from '../../stores/projects.ts'
import { useClientStore } from '../../stores/clients.ts'
import { useEmployeesStore } from '../../stores/employees.ts'
import { useStore } from '../../stores/store.ts'
import moment from 'moment'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useStore()
const projectsStore = useProjectsStore()
const clientStore = useClientStore()
const employeesStore = useEmployeesStore()
const localePath = useLocalePath()
const route = useRoute()

//values
const project: Ref<ProjectInterface | null> = ref(null)
const showLoad: Ref<boolean> = ref(false)
const showLoadClients: Ref<boolean> = ref(false)
const showLoadEmployees: Ref<boolean> = ref(false)
const clients: Ref<ClientInterface[]> = ref([])
const employees: Ref<EmployeeInterface[]> = ref([])
const deleteItemClient: Ref<ClientInterface | null> = ref(null)
const deleteItemEmployee: Ref<EmployeeInterface | null> = ref(null)
const showModalAddClient: Ref<boolean> = ref(false)
const showModalAddEmployees: Ref<boolean> = ref(false)

//methods
const addEmployeesToProject = async (ids: number[]): void => {
    // console.log('addEmployees', ids)
    showLoad.value = true
    const res: boolean = await projectsStore.fetchAddEmployeesToProject(project.value.id, ids)
    if(res) {
        store.addTip(i18n.t('employees_was_added_to_project'))
        getProject() // this showLoad set false
    } else {
        showLoad.value = false
        store.addTip(i18n.t('error'))
    }
}
const addClientsToProject = async (ids: number[]): void => {
    // console.log('addClients', ids)
    showLoad.value = true
    const res: boolean = await projectsStore.fetchAddClientsToProject(project.value.id, ids)
    if(res) {
        store.addTip(i18n.t('clients_was_added_to_project'))
        getProject() // this showLoad set false

    } else {
        showLoad.value = false
        store.addTip(i18n.t('error'))
    }
}
const clickAddModal = (ids: number[]): void => {
    if(showModalAddEmployees.value) {
        addEmployeesToProject(ids)
    } else if(showModalAddClient.value) {
        addClientsToProject(ids)
    }
    showModalAddEmployees.value = false;
    showModalAddClient.value = false
}
const closeModalAdd = async (): void => {
    showModalAddClient.value = false
    showModalAddEmployees.value = false
}
const getProject = async (): void => {
    showLoad.value = true
    project.value = await projectsStore.fetchProjectById(route.params.id)
    showLoad.value = false

    // console.log('project', project.value, project.value.client_ids.length > 0)
    console.log(project.value.client_ids[0])

    if (project.value.client_ids.length > 0) {
        showLoadClients.value = true;
        for (let i = 0; i < project.value.client_ids.length; i++) {
            let item: ClientInterface = await clientStore.fetchGetClientById(project.value.client_ids[i])
            clients.value.push(item)
        }
        showLoadClients.value = false;
    }
    if (project.value.employee_ids.length) {
        showLoadEmployees.value = true;
        for (let i = 0; i < project.value.employee_ids.length; i++) {
            let item: EmployeeInterface = await employeesStore.fetchGetEmployeeById(project.value.employee_ids[i])
            employees.value.push(item)
        }
        showLoadEmployees.value = false;
    }
}
const closeModalDelete = (): void => {
    deleteItemClient.value = null
    deleteItemEmployee.value = null
}
const deleteItem = (): void => {
    if (deleteItemClient.value) {
        deleteClientFromProject()
    } else if (deleteItemEmployee.value) {
        deleteEmployeeFromProject()
    }
}
const deleteClientFromProject = async (): void => {
    const idClient: number = deleteItemClient.value.id
    deleteItemClient.value = null
    showLoadClients.value = true
    const res: bool = await projectsStore.fetchRemoveClientFromProject(route.params.id, idClient)
    showLoadClients.value = false
    if (res) {
        clients.value = clients.value.filter(el => el.id !== idClient)
        store.addTip(i18n.t('client_was_removed_fro_the_project'))
    } else {
        store.addTip(i18n.t('error'))
    }
}
const deleteEmployeeFromProject = async (): void => {
    const idEmployee: number = deleteItemEmployee.value.id
    deleteItemEmployee.value = null
    showLoadEmployees.value = true
    const res: bool = await projectsStore.fetchRemoveEmployeeFromProject(route.params.id, idEmployee)
    showLoadEmployees.value = false
    if (res) {
        employees.value = employees.value.filter(el => el.id !== idEmployee)
        store.addTip(i18n.t('employee_was_removed_fro_the_project'))
    } else {
        store.addTip(i18n.t('error'))
    }
}

//computed
const startDate = computed((): string => {
    return project.value && project.value.start_date ? moment(project.value.start_date).format('DD.MM.YYYY') : '-'
})
const endDate = computed((): string => {
    return project.value && project.value.end_date ? moment(project.value.end_date).format('DD.MM.YYYY') : '-'
})

//hook
onMounted(async () => {
    await getProject()
})
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

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
    display: flex;
    flex-wrap: wrap;
    padding: 50px;
    width: 100%;
    border-bottom: 1px solid var(--color-gray);

    &__name {
        @include font(24px);
        font-weight: 600;
    }

    &__title {
        @include font(14px);
        color: var(--color-gray-text);
        margin-bottom: 2px;

        &::after {
            content: ':'
        }
    }

    & &__title:not(:first-child) {
        margin-top: 15px;
    }

    &__text {
        @include font(16px)
    }
}

.block-info {
    width: 50%;
    padding-right: 10px;
}

.block-list {
    width: 100%;
    display: flex;

    &>div {
        width: 50%;
    }

    &__title {
        @include font(18px);
        font-weight: 600;
        padding: 20px 50px 20px 50px;
    }

    &__button-add {
        @include button-text-gray;
        position: absolute;
        top: 20px;
        right: 20px;
    }
}

.clients {
    position: relative;

    &__list {
        padding: 0 20px 20px 50px;
    }
}

.employees {
    position: relative;

    .block-list__title {
        padding-left: 0;
    }

    &__list {
        padding: 0 50px 20px 0px;
    }

    .block-list__button-add {
        right: 50px;
    }
}
</style>