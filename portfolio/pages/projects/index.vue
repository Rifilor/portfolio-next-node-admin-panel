<template>
    <div class="wrap-page">
        <h1 class="title-page">{{ $t('projects') }}</h1>
        <div class="top-panel">
            <input @change="getProjects()" class="top-panel__search" type="text" v-model.lazy="search"
                :placeholder="$t('search')">
            <p class="top-panel__text">{{ $t('sort') }}:</p>
            <dropdown class="top-panel__dropdown" @change="getProjects()" v-model="sortBy" :watchValue="'name'"
                :idValue="'type'" :useLocalization="true" :list="store.$state.listSortProjects"></dropdown>
            <button v-on:click="changeSort" class="top-panel__button-sort"
                :class="{ 'top-panel__button-sort--revers': !sortRevers }">
                <svg-icon name="arrow-sort" />
            </button>
            <button class="top-panel__button-clear" v-on:click="clearFilters" v-if="search || sortBy">{{ $t('clear')
                }}</button>
            <nuxt-link :to="localePath('/projects/add')" class="top-panel__button">
                {{ $t('add_project') }}
            </nuxt-link>
        </div>
        <project-list :showLoad="showLoad" @clickItem="moveToProject" :list="projectsStore.$state.projects"></project-list>
    </div>
</template>
<script setup lang="ts">
//imports
import type { listDropSimpleInterface, paramsEmployeeInterface } from '../../interface/interface.ts'
import { useProjectsStore } from '../stores/projects.ts'
import { useStore } from '../stores/store.ts'
const store = useStore()
const projectsStore = useProjectsStore()
const localePath = useLocalePath()
const router = useRouter()

//values
const showLoad: Ref<boolean> = ref(false)
const sortBy: Ref<listDropSimpleInterface | null> = ref(null)
const sortRevers: Ref<boolean> = ref(false)
const search: Ref<string> = ref('')

//methods
const clearFilters = (): void => {
    sortRevers.value = false
    sortBy.value = null
    search.value = ''
    getProjects()
}
const getProjects = async (): void => {
    const params: paramsEmployeeInterface = {
        search: search.value,
        sort_by: sortBy.value ? sortBy.value.type : '',
        sort_order: sortRevers.value ? 'DESC' : 'ASC'
    }
    showLoad.value = true
    await projectsStore.fetchGetProjects(params)
    showLoad.value = false
}
const moveToProject = (id: number): void => {
    router.push(localePath(`/projects/${id}`))
}
const changeSort = (): void => {
    sortRevers.value = !sortRevers.value
    if(sortBy.value) {
        getProjects()
    }
}

//hook
onMounted(() => {
    getProjects()
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