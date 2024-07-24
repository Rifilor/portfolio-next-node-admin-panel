<script setup lang="ts">
const router = useRouter();
const localePath = useLocalePath()
onMounted(()=> {
    router.push(localePath('dashboard'))
})
</script>
<style lang="scss">
</style>