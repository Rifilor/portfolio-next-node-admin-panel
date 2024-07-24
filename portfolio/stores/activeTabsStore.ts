import { defineStore } from 'pinia';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { io, Socket } from 'socket.io-client';

export const useActiveTabsStore = defineStore({
    id: 'active-tabs-store',
    state: () => ({
        activeTabs: 0 as number,
        socket: null as Socket | null,
    }),
    actions: {
        connectSocket() {
            this.socket = io('http://localhost:8080');
            this.socket.on('activeTabs', (count: number) => {
                this.activeTabs = count;
            });
        },
        disconnectSocket() {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        },
    },
});