<template>
    <div class="wrap">
        <div class="top-panel">
            <h2 class="top-panel__title">{{ $t('add_new_clients') }}</h2>
        </div>
        <employee-form-data :clientMode="true" @onSubmit="addEmployee" :pathCancel="'/employees'" class="form-data" :textButton="'add'"
            :itemEdit="itemEdit"></employee-form-data>
    </div>

</template>
<script setup lang="ts">
//imports
import employeeFormData from '../../components/employees/employee-form-data'
import type { ClientInterface } from '../../interface/interface.ts'
import {useClientStore} from '../../stores/clients.ts'
import {useStore} from '../../stores/store.ts'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const store = useStore()
const clientStore = useClientStore()
const router = useRouter()
const localePath = useLocalePath()

//values
const itemEdit: Ref<ClientInterface | null> = ref(null)

//methods
const addEmployee = async (): void => {
    let result: boolean = await clientStore.fetchAddClient(itemEdit.value)
    console.log('result', result)
    if (result) {
        store.addTip(i18n.t('client_was_added'))
        router.push(localePath('clients'))
    } else {
        store.addTip(i18n.t('error'))
    }
}

//hook
onMounted((): void => {
    itemEdit.value = JSON.parse(JSON.stringify(clientStore.$state.emptyClientObject))
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