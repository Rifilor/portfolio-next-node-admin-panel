export interface EmployeeInterface {
    id: number,
    avatar_url: string,
    first_name: string,
    last_name: string,
    born_date: Date | null,
    start_work: Date | null,
    created_at: Date | null,
    updated_at: Date | null,
    email: string,
    city: string,
    phone_number: string,
    position: 'frontend' | 'backend' | 'ios' | 'android' | 'sales' | 'project' | 'hr' | '' // Frontend, Backend, IOS, Android developer Project, HR Manager
    type_work: 'part time' | 'full time' | '',
    vacation_days: number,
    project_ids: number[],
    description: string,
}
export interface EmployeeInterfaceParams {
    id?: number,
    avatar_url?: string,
    first_name?: string,
    last_name?: string,
    born_date?: Date,
    start_work?: Date,
    created_at?: Date,
    updated_at?: Date,
    email?: string,
    city?: string,
    phone_number?: string,
    position?: 'frontend' | 'backend' | 'ios' | 'android' | 'sales' | 'project' | 'hr' // Frontend, Backend, IOS, Android developer Project, HR Manager
    type_work?: 'part time' | 'full time',
    vacation_days?: number,
    project_ids?: number[],
    description?: string,
    search?: string,
}

export interface ClientInterfaceParams {
    id?: number,
    avatar_url?: string,
    first_name?: string,
    last_name?: string,
    born_date?: Date,
    created_at?: Date,
    updated_at?: Date,
    email?: string,
    city?: string,
    phone_number?: string,
    project_ids?: number[],
    description?: string,
    search?: string,
}

export interface ClientInterface {
    id: number, 
    avatar_url: string,
    first_name: string,
    last_name: string,
    born_date: Date | null,
    created_at: Date | null,
    updated_at: Date | null,
    city: string,
    phone_number: string,
    email: string,
    description: string,
    project_ids: number[],
}

export interface ProjectInterface {
    id: number,
    name: string,
    start_date: Date | null,
    end_date: Date | null,
    status: 'planned' | 'in progress' | 'completed',
    budget: number,
    created_at: Date | null,
    updated_at: Date | null,
    employee_ids: number[],
    client_ids: number[],
}

export interface PositionInterface {
    name: string,
    type: string,
    prefix: string,
}

export interface listDropSimpleInterface {
    name: string,
    type: string,
}

export interface StoreStateInterface {
    pisitionsList: PositionInterface[],
    listSortEmployee: listDropSimpleInterface[],
    listSortClients: listDropSimpleInterface[],
    listSortProjects: listDropSimpleInterface[],
    statusList: listDropSimpleInterface[],
    tips: tipsInterface[],
    tipCount: number,
}

export interface StoreProjectInterface {
    projects: ProjectInterface[],
    emptyProject: ProjectInterface,
}

export interface StoreEmployeesInterface {
    employees: EmployeeInterface[],
    emptyEmployeeObject: EmployeeInterface,
}
export interface StoreClientInterface {
    clients: ClientInterface[],
    emptyClientObject: ClientInterface,
}

export interface StoreCurrentUserInterface {
    currentUser: EmployeeInterface
}
export interface linkItemInterface {
    name: String,
    link: String,
}
export interface paramsEmployeeInterface {
    search: string,
    sort_by: string,
    sort_order: string,
}
export interface GetEmployeeInterface {
    data: EmployeeInterface[]
}

export interface tipsInterface {
    id: number,
    text: string,
}