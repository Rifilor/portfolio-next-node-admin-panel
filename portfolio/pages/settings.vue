<template>
    <div class="wrap-page" v-if="itemEdit">
        <h1 class="title-page">{{ $t('settings') }}</h1>
        <div class="wrap-edits">
            <employee-form-data :textButton="'save'" :itemEdit="itemEdit" @onSubmit="changeEmployee" v-if="itemEdit" class="wrap-edit-block"></employee-form-data>
            <div class="wrap-edit-block-personal">
                <div class="block-input">
                    <p class="block-input__text">{{ $t('language') }}</p>
                    <div class="block-input__input swith-language">
                        <NuxtLink @click="changeLocalizationTime('en')" :to="switchLocalePath('en')"
                            class="swith-language__button" :class="{ 'swith-language__button--active': locale == 'en' }">
                            En
                        </NuxtLink>
                        <NuxtLink @click="changeLocalizationTime('ua')" :to="switchLocalePath('ua')"
                            class="swith-language__button" :class="{ 'swith-language__button--active': locale == 'ua' }">
                            Ua
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
//imports
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type { EmployeeInterface, PositionInterface } from '../interface/interface.ts'
import { useStore } from '../stores/store.ts'
import { useCurrentUserStore } from '../stores/currentUser.ts'
import {useEmployeesStore} from '../stores/employees.ts'
import employeeFormData from '../components/employees/employee-form-data'
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const employeesStore = useEmployeesStore()
const store = useStore()
const storeUser = useCurrentUserStore()
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n()

//values
const dropModel = ref(null)
const date = ref(new Date())
const itemEdit: Ref<EmployeeInterface | null> = ref(null)
// const positionDropValue: Ref<PositionInterface | null> = ref(null)

//computed


//methods
const changeEmployee = async (): void => {
    let res: boolean = await employeesStore.fetchChangeEmployees(itemEdit.value)
    console.log('res', res)
    if(res) {
        store.addTip(i18n.t('employee_was_edit'))
        router.push(localePath(`/employees/${route.params.id}`))
    } else {
        store.addTip(i18n.t('error'))
    }
}



//hook
onMounted((): void => {
    itemEdit.value = JSON.parse(JSON.stringify(storeUser.getCurrentUser))
    // positionDropValue.value = getItemDropMount.value
})
</script>
<style lang="scss">
@import '../assets/style/mixins.scss';

.block-input {
    width: 400px;
    margin-top: 20px;

    &__text {
        @include font(17px);
        @include firstLaterUpercase;
    }

    &__input {
        margin-top: 8px;

    }
}

.swith-language {
    &__button {
        color: #626262;
        font-size: 16px;
        line-height: 110%;
        padding: 0 5px;
        font-weight: 600;
        transition: .1s linear;

        &--active {
            font-size: 17px;
            color: #222;
        }
    }
}

.wrap-edits {
    display: flex;
}
.wrap-edit-block-personal {
    margin-left: 50px;
}
</style>