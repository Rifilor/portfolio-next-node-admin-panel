<template>
    <div class="tips_wrap">
        <transition-group name="tips" tag="div">
            <div class="tips_item" v-for="(item, i) in store.$state.tips" :key="item.id">
                <p v-html="item.text" class="fz14"></p>
                <svg @click="clickDelete(i)" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.51375 7.57727C6.21612 7.28258 6.21612 6.80478 6.51375 6.51008C6.81138 6.21539 7.29392 6.21539 7.59155 6.51008L17.4863 16.2961C17.784 16.5908 17.784 17.0685 17.4863 17.3632C17.1887 17.6579 16.7062 17.6579 16.4085 17.3632L6.51375 7.57727Z"
                        fill="#2C2C2C" />
                    <path
                        d="M16.4086 6.634C16.7063 6.33931 17.1888 6.33931 17.4864 6.634C17.7841 6.9287 17.7841 7.4065 17.4864 7.70119L7.59165 17.4872C7.29402 17.7819 6.81148 17.7819 6.51385 17.4872C6.21622 17.1925 6.21622 16.7147 6.51385 16.42L16.4086 6.634Z"
                        fill="#2C2C2C" />
                </svg>
            </div>
        </transition-group>
    </div>
</template>

<script lang="ts" setup>
//imports
import { useStore } from '../stores/store.ts'
const store = useStore()

//values
const tipLength: Ref<number> = ref(0)

//methods
const createTimer = (): void => {
    setTimeout((): void => {
        store.removeTip()
    }, 2000)
}
const clickDelete = (i: number): void => {
    store.removeTip(i)
}

//watch
watch(store.$state.tips, (newTips) => {
    console.log('watch', tipLength, newTips)
    if (tipLength.value < newTips.length)
        createTimer()
    tipLength.value = newTips.length
})

</script>

<style lang="scss" scoped>
.tips_wrap {
    position: fixed;
    bottom: 48px;
    right: 8px;
    width: 246px;
    z-index: 99999;
}

.tips_item {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;

    p {
        word-break: break-word;
    }

    width: 100%;
    margin-top: 15px;
    padding: 8px;
    background: #FBFCFF;
    border: 1px solid var(--color-border);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    transition: all 0.4s;
    box-sizing: border-box;

    svg {
        cursor: pointer;
        flex-shrink: 0;
    }

    //span {
    //  margin: 0 -2px !important;
    //}
}

.tips-enter,
.tips-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>