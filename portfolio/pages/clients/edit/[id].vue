<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('edit_clients') }}</h2>
        </div>
        <employee-form-data :clientMode="true" @onSubmit="changeEmployee" :pathCancel="`/employees/${route.params.id}`"
            class="form-data" :textButton="'edit'" :itemEdit="itemEdit" v-if="itemEdit"></employee-form-data>
            <app-loader v-if="showLoad"></app-loader>
    </div>
</template>
<script lang="ts" setup>
//imports
import type { ClientInterface } from '../../../interface/interface.ts'
import EmployeeFormData from '../../../components/employees/employee-form-data'
import { useClientStore } from '../../../stores/clients.ts'
import { useStore } from '../../../stores/store.ts'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useStore()
const clientStore = useClientStore()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

//values
const itemEdit: Ref<ClientInterface | null> = ref(null)
    const showLoad: Ref<boolean> = ref(false)

//methods
const changeEmployee = async (): void => {
    showLoad.value = true
    let res: boolean = await clientStore.fetchChangeClient(itemEdit.value)
    console.log('res', res)
    showLoad.value = false
    if (res) {
        store.addTip(i18n.t('client_was_edited'))
        router.push(localePath(`/clients/${route.params.id}`))
    } else {
        store.addTip(i18n.t('edit'))
    }
}

//hook
onMounted(async (): void => {
    itemEdit.value = await clientStore.fetchGetClientById<ClientInterface>(route.params.id)
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