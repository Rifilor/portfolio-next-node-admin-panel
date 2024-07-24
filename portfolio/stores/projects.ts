



import {  useRuntimeConfig } from "nuxt/app";
import { defineStore } from "pinia";
import type { StoreProjectInterface, EmployeeInterfaceParams, ProjectInterface } from '../interface/interface'
const runtimeConfig = useRuntimeConfig();

export const useProjectsStore = defineStore({
  id: 'use-projects-store',
  state: (): StoreProjectInterface => {
    return {
      projects: [],
      emptyProject: {
        id: -1,
        name: '',
        start_date: null,
        end_date: null,
        status: 'planned',
        budget: 0,
        created_at: null,
        updated_at: null,
        employee_ids: [],
        client_ids: [],
      }
    }
  },
  actions: {
    async fetchAddClientsToProject(projectId: number, clientIds: number[]): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/add-clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectId, clientIds: clientIds })
      }).then(() => {
        return true;
      }).catch(() => {
        return false;
      })
    },
    async fetchAddEmployeesToProject(projectId: number, employeeIds: number[]): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/add-employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectId, employeeIds: employeeIds })
      }).then(() => {
        return true;
      }).catch(() => {
        return false;
      })
    },
    async fetchRemoveClientFromProject(projectId: number, clientId: number): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/remove-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectId, clientId: clientId })

      }).then(() => {
        return true;
      }).catch(() => {
        return false;
      })
    },
    async fetchRemoveEmployeeFromProject(projectId: number, employeeId: number): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/remove-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: projectId, employeeId: employeeId })

      }).then(() => {
        return true;
      }).catch(() => {
        return false;
      })
    },
    async fetchGetProjects(params?: EmployeeInterfaceParams): Promise<void> {
      const paramsQuery = params ? new URLSearchParams(JSON.parse(JSON.stringify(params))) : '';
      const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/projects?${paramsQuery.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const data = await response.json();
      this.projects = data

      // return data;
    },
    async fetchProjectById(id: number): Promise<ProjectInterface> {
      const response = await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.projects = data

      return data;
    },
    async fetchEditProject(item: ProjectInterface): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects/${item.id}`, {
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
    async fetchAddProject(item: ProjectInterface): Promise<boolean> {
      return await fetch(`${runtimeConfig.public.API_BASE_URL}/projects`, {
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
    }
  },
  getters: {

  }
})