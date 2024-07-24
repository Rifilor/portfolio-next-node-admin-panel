<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('edit_project') }}</h2>
        </div>
        <project-form-data @onSubmit="editProject" class="form-data" v-if="itemEdit" :itemEdit="itemEdit"
            :textButton="'edit'" :pathCancel="`/projects/${route.params.id}`"></project-form-data>
        <app-loader v-if="showLoad"></app-loader>
    </div>
</template>
<script setup lang="ts">
//imports
import projectFormData from '../../../components/projects/project-form-data'
import type { ProjectInterface } from '../../../interface/interface.ts'
import { useProjectsStore } from '../../../stores/projects.ts'
import { useStore } from '../../../stores/store.ts'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const projectsStore = useProjectsStore()

//value
const itemEdit: Ref<ProjectInterface | null> = ref(null)
const showLoad: Ref<boolean> = ref(null)

//methods
const editProject = async (): void => {
    showLoad.value = true
    const res: boolean = await projectsStore.fetchEditProject(itemEdit.value)
    showLoad.value = false
    if (res) {
        store.addTip(i18n.t('project_was_edited'))
        router.push(localePath(`/projects/${route.params.id}`))
    } else {
        store.addTip(i18n.t('error'))
    }
}

//hook
onMounted(async (): void => {
    showLoad.value = true
    itemEdit.value = await projectsStore.fetchProjectById<ProjectInterface>(route.params.id)
    showLoad.value = false
})
</script>
<style lang="scss" scoped>
@import '../assets/style/mixins.scss';

.wrap {
    @include flex-column-center;
    padding: 0 !important;
    position: relative;
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