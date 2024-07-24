<template>
    <div class="wrap-page">
        <h1 class="title-page">{{ $t('dashboard') }}</h1>
        <div class="content">
            <p class="content__title ">{{ $t('count_vacation')}}: <span class="">{{ currentUser.vacation_days }}</span></p>
            <p class="content__title ">{{ $t('projects')}}: <span class="">{{ currentUser.project_ids.length }}</span></p>
            <p class="content__title ">{{ $t('active_tabs')}}: <span class="">{{ storeActiveTabs.$state.activeTabs }}</span></p>
        </div>
    </div>
</template>
<script setup lang="ts">
//imports
import type {EmployeeInterface} from '../interface/interface.ts'
import {useCurrentUserStore} from '../stores/currentUser.ts'
import { useActiveTabsStore } from '../stores/activeTabsStore.ts';
const currentUserStore = useCurrentUserStore()
const storeActiveTabs = useActiveTabsStore()


//values
const currentUser: Ref<EmployeeInterface | null> = currentUserStore.getCurrentUser

//hook 
onMounted(()=> {
})

</script>
<style lang="scss" scoped>
@import '../assets/style/mixins.scss';
.content {
    margin-top: 80px;
    &__title {
        margin-top: 15px;
        @include font(16px);
        color: var(--color-gray-text);
        span {
            color: var(--color-dark);
            font-weight: 600;
        }
    }
}
</style>