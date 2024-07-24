<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('adding_project') }}</h2>
        </div>
        <project-form-data @onSubmit="createProject" class="form-data" v-if="itemEdit" :itemEdit="itemEdit" :textButton="'edit'"
            :pathCancel="`/projects/${route.params.id}`"></project-form-data>
        <app-loader v-if="showLoad"></app-loader>
    </div>
</template>
<script setup lang="ts">
//imports
import projectFormData from '../../components/projects/project-form-data'
import type { ProjectInterface } from '../../interface/interface.ts'
import { useProjectsStore } from '../../stores/projects.ts'
import { useStore } from '../../../stores/store.ts'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useStore()
const router = useRouter()
const route = useRoute()
const projectsStore = useProjectsStore()
const localePath = useLocalePath()

//value
const itemEdit: Ref<ProjectInterface | null> = ref(null)
const showLoad: Ref<boolean> = ref(null)

//methods
const createProject = async (): void => {
    showLoad.value = true;
    const res: boolean = await projectsStore.fetchAddProject(itemEdit.value)
    showLoad.value = false;
    if (res) {
        store.addTip(i18n.t('project_was_added'))
        router.push(localePath(`/projects`))
    } else {
        store.addTip(i18n.t('error'))
    }

}

//hook
onMounted((): void => {
    itemEdit.value = JSON.parse(JSON.stringify(projectsStore.$state.emptyProject))
})
</script>
<style lang="scss" scoped>
@import '../assets/style/mixins.scss';

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
}

.form-data {
    padding-bottom: 100px;
}
</style>