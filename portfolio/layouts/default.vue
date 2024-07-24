<!-- eslint-disable vue/no-multiple-template-root -->
<template>
<NuxtLoadingIndicator :throttle="0" :height="5" class="indicator" />
<tips-list/>
<socket-session/>

    <section class="wrap-page">
        <navigation-panel class="navigation-panel"/>
        <main class="main">
            <slot/>
        </main>
    </section>
    
</template>
<script setup lang="ts">

onMounted(()=> {
    console.log('mounted')

})
</script>
<style lang="scss" scoped>
.wrap-page {
    display: flex;
}
.navigation-panel {
    height: 100vh;
    width: 250px;
}
.main {
    position: relative;
    height: 100vh;
    width: calc(100vw - 250px);
    &>*:first-child {
        background-color: var(--color-body);
        padding: 50px;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>