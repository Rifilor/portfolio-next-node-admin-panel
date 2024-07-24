<template>
    <button class="checkbox" v-on:click="emit('select')">
        <svg v-if="!value" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.7" y="2.7" width="18.6" height="18.6" rx="5.3" fill="white" stroke="#2c2c2c"
                stroke-width="1.4" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="none" />
            <rect x="2.7" y="2.7" width="18.6" height="18.6" rx="5.3" fill="white" stroke="#2c2c2c"
                stroke-width="1.4" />
            <path d="M7.5 12L10.9783 15.5L17.5 8.5" stroke="#2c2c2c" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>


    </button>
</template>
<script setup lang="ts">
//props
const props = defineProps<{
    value: boolean,
}>()

//emit
const emit = defineEmits(['select'])

</script>
<style lang="scss" scoped>
.checkbox {
    svg {
        width: 24px;
        height: 24px;
    }
}
</style>