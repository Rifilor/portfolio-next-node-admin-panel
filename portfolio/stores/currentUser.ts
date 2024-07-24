import { useFetch } from "nuxt/app";
import {defineStore} from "pinia";
import type { EmployeeInterface, StoreCurrentUserInterface } from "../interface/interface";
const runtimeConfig = useRuntimeConfig();

export const useCurrentUserStore = defineStore({
    id: 'use-current-user-store',
    state: (): StoreCurrentUserInterface => {
        return {
            currentUser: {
                id: 1,
                first_name: 'Devid',
                last_name: 'Piterson',
                avatar_url: 'https://wac-cdn.atlassian.com/ru/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1881',
                born_date: new Date(1995, 5, 12),
                start_work: new Date(2019, 3, 1),
                created_at: new Date(2019, 3, 1),
                updated_at: new Date(),
                email: 'sdsd@gmail.com',
                phone_number: '+380664365784',
                position: 'frontend',
                type_work: 'full time',
                vacation_days: 14,
                project_ids: [],
                description: '',
                city: 'Lviv'
            },
        }
    },
    actions: {
      
       
    },
    getters: {
      getCurrentUser: (state): EmployeeInterface => {
        if(!state.currentUser && localStorage.getItem('currentUserData')) {
            state.currentUser = JSON.parse(''+localStorage.getItem('currentUserData'))
        }
        return state.currentUser;
      }
    }
})