import { useFetch } from "nuxt/app";
import {defineStore} from "pinia";
import type { StoreStateInterface } from "~/interface/interface";

export const useStore = defineStore({
    id: 'use-store',
    state: (): StoreStateInterface => {
        return {
            pisitionsList: [
                {name: 'Frontend', type: 'frontend', prefix: 'developer'},
                {name: 'Backend', type: 'backend', prefix: 'developer'},
                {name: 'IOS', type: 'ios', prefix: 'developer'},
                {name: 'Android', type: 'android', prefix: 'developer'},
                {name: 'Sales', type: 'sales', prefix: 'manager'},
                {name: 'Project', type: 'project', prefix: 'manager'},
                {name: 'Hr', type: 'hr', prefix: 'manager'},
            ],
            statusList: [
                {name: 'planned', type: 'planned'},
                {name: 'in_progress', type: 'in progress'},
                {name: 'completed', type: 'completed'},
            ],
            listSortEmployee: [
                {name: 'identy', type: 'id'},
                {name: 'first_name', type: 'first_name'},
                {name: 'last_name', type: 'last_name'},
                {name: 'position', type: 'position'},
                {name: 'phone', type: 'phone_number'},
                {name: 'email', type: 'email'},
            ],
            listSortClients: [
                {name: 'identy', type: 'id'},
                {name: 'first_name', type: 'first_name'},
                {name: 'last_name', type: 'last_name'},
                {name: 'phone', type: 'phone_number'},
                {name: 'email', type: 'email'},
            ],
            listSortProjects: [
                {name: 'name', type: 'name'},
                {name: 'status', type: 'status'},
                {name: 'budget', type: 'budget'},
            ],
            tips: [],
            tipCount: 0,
        }
    },
    actions: {
        addTip(text: string): void {
            this.tips.push({id: this.tipCount++, text: text})
        },
        removeTip(i: number): void {
            if(i >= 0)
              this.tips.splice(i, 1)
            else
              this.tips.splice(0, 1)
          },
    },
    getters: {
      
    }
})