<script setup lang="ts">
import { useActiveTabsStore } from '../stores/activeTabsStore.ts';
import { onMounted, onBeforeUnmount } from 'vue';

const store = useActiveTabsStore();

onMounted(() => {
    store.connectSocket();
});

onBeforeUnmount(() => {
    store.disconnectSocket();
});

</script>