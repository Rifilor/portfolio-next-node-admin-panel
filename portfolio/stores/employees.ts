import { defineStore } from "pinia";
import type { EmployeeInterface, StoreEmployeesInterface, EmployeeInterfaceParams } from "../interface/interface";
const runtimeConfig = useRuntimeConfig();

export const useEmployeesStore = defineStore({
    id: 'use-employees-store',
    state: (): StoreEmployeesInterface => {
        return {
            employees: [],
            emptyEmployeeObject: {
                id: -1,
                avatar_url: '',
                first_name: '',
                last_name: '',
                born_date: null,
                start_work: null,
                created_at: null,
                updated_at: null,
                email: '',
                city: '',
                phone_number: '',
                position: '', // Frontend, Backend, IOS, Android developer Project, HR Manager
                type_work: '',
                vacation_days: 0,
                project_ids: [],
                description: '',
                
            }
        }
    },
    actions: {
        async fetchGetEmployees<T>(params?: EmployeeInterfaceParams): Promise<T>{
            const paramsQuery = params ? new URLSearchParams(JSON.parse(JSON.stringify(params))) : '';
            console.log('paramsQuery.toString()', paramsQuery.toString());
            
            const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/users?${paramsQuery.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json', 
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        },
        async setEmployeeFromServer(params?: EmployeeInterfaceParams): Promise<void> {
            
            try {
                this.employees = await this.fetchGetEmployees<EmployeeInterface[]>(params);
                console.log(this.employees);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        },
        async fetchDeleteEmployee(id: number | string): Promise<void> {
            try {
                const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/users/${id}}`, {
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
        async fetchAddEmployee(item: EmployeeInterface): Promise<boolean> {
                return  await fetch(`${runtimeConfig.public.API_BASE_URL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(item)
                }).then(()=> {
                    return true
                }).catch(()=> {
                    return false
                })
            
        },
        async fetchGetEmployeeById(id: number | string): Promise<EmployeeInterface> {
            const response =  await fetch(`${runtimeConfig.public.API_BASE_URL}/users/${id}`, {
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
        async fetchChangeEmployees(item: EmployeeInterface): Promise<boolean> {
            return await fetch(`${runtimeConfig.public.API_BASE_URL}/users/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(item)
            }).then(()=> {
                return true
            }).catch(()=> {
                return false
            })
        }

    },
    getters: {

    }
})