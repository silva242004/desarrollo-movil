// Datos "fijos" de arranque para MediClinic (Ionic).
// No hay backend: todo vive en localStorage, esto solo se usa para
// sembrar los datos la primera vez que se abre la app.

export interface Doctor {
  email: string
  password: string
  nombre: string
}

// Usuarios fijos del médico que puede iniciar sesión en la app.
export const DOCTORES_FIJOS: Doctor[] = [
  { email: 'doctor@mediclinic.com', password: 'medico123', nombre: 'Dra. Laura Restrepo' },
  { email: 'medico@mediclinic.com', password: 'clinica2026', nombre: 'Dr. Andrés Peña' },
]

export type EstadoVisita = 'pendiente' | 'en_camino' | 'finalizada'

export interface Visita {
  id: string
  paciente: string
  hora: string
  estado: EstadoVisita
}

// Visitas del día de ejemplo (mock).
export const VISITAS_INICIALES: Visita[] = [
  { id: '1', paciente: 'Alex Silva', hora: '08:30', estado: 'finalizada' },
  { id: '2', paciente: 'Juan Silva', hora: '10:00', estado: 'en_camino' },
  { id: '3', paciente: 'Lucas Goyes', hora: '11:15', estado: 'pendiente' },
  { id: '4', paciente: 'Leiton Garcia', hora: '14:00', estado: 'pendiente' },
]

export interface Paciente {
  id: string
  nombre: string
  apellido: string
  cc: string
  telefono: string
}

// Directorio de pacientes de la clínica (independiente de las visitas del día).
export const PACIENTES_INICIALES: Paciente[] = [
  { id: '1', nombre: 'Alex', apellido: 'Silva', cc: '1130123456', telefono: '3001234567' },
  { id: '2', nombre: 'Juan', apellido: 'Silva', cc: '1130987654', telefono: '3007654321' },
  { id: '3', nombre: 'Lucas', apellido: 'Goyes', cc: '1130456789', telefono: '3009876543' },
  { id: '4', nombre: 'Leiton', apellido: 'Garcia', cc: '1130765432', telefono: '3002345678' },
]

// Próximo estado dentro del flujo pendiente -> en_camino -> finalizada.
export const SIGUIENTE_ESTADO: Record<EstadoVisita, EstadoVisita | null> = {
  pendiente: 'en_camino',
  en_camino: 'finalizada',
  finalizada: null,
}

export const ETIQUETA_ESTADO: Record<EstadoVisita, string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  finalizada: 'Finalizada',
}

export const COLOR_ESTADO: Record<EstadoVisita, string> = {
  pendiente: 'medium',
  en_camino: 'warning',
  finalizada: 'success',
}
