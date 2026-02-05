// Task entity matching backend Tarea
export interface Tarea {
    id: number;
    titulo: string;
    descripcion: string;
    fechaCreacion: string; // ISO date string
    fechaVencimiento: string; // ISO date string
    estado: Estado;
    idUsuario: number;
}

// Task estado enum
export enum Estado {
    PENDIENTE = 'PENDIENTE',
    EN_PROGRESO = 'EN_PROGRESO',
    COMPLETADA = 'COMPLETADA'
}

// DTO for creating a task (only required fields)
export interface CreateTareaDTO {
    titulo: string;
    descripcion: string;
    fechaVencimiento: string; // ISO date string
    idUsuario: number;
}

// DTO for updating a task (only allowed fields)
export interface UpdateTareaDTO {
    id: number;
    titulo: string;
    descripcion: string;
    fechaVencimiento: string; // ISO date string
}
