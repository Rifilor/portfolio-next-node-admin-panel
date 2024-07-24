import { useRuntimeConfig } from "nuxt/app";
import { defineStore } from "pinia";
import type { ClientInterface, StoreClientInterface, ClientInterfaceParams } from "../interface/interface";
const runtimeConfig = useRuntimeConfig();

export const useClientStore = defineStore({
    id: 'use-client-store',
    state: (): StoreClientInterface => {
        return {
            clients: [],
            emptyClientObject: {
                id: -1,
                avatar_url: '',
                first_name: '',
                last_name: '',
                born_date: null,
                created_at: null,
                updated_at: null,
                city: '',
                phone_number: '',
                email: '',
                description: '',
                project_ids: [],
            }
        }
    },
    actions: {
        async fetchChangeClient(item: ClientInterface) {
            return await fetch(`${runtimeConfig.public.API_BASE_URL}/clients/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            }).then(() => {
                return true
            }).catch(() => {
                return false
            })
        },
        async fetchGetClients(params: ClientInterfaceParams) {
            const paramsQuery = params ? new URLSearchParams(JSON.parse(JSON.stringify(params))) : '';
            console.log('paramsQuery.toString()', paramsQuery.toString());
            const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/clients?${paramsQuery.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.clients = await response.json();
        },
        async fetchAddClient(item: ClientInterface): Promise<boolean> {
            return await fetch(`${runtimeConfig.public.API_BASE_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            }).then(() => {
                return true
            }).catch(() => {
                return false
            })

        },
        async fetchGetClientById(id: number | string) {
            const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/clients/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        },
        async fetchDeleteClient(id: number | string) {
            try {
                const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/clients/${id}}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error delete employee:', error);
            }
        },
    },
    getters: {

    }
})