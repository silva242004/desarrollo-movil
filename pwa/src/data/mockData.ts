// Usuario fijo del login (sin backend). Mismo patrón del demo visto en clase.
export const USUARIO_FIJO = {
  email: 'user@mail.com',
  password: '123',
}

export interface Paciente {
  id: string
  nombre: string
  apellido: string
  cc: string
  telefono: string
}

// Pacientes de ejemplo para sembrar la lista (mismos nombres usados en la
// app de Ionic, aunque acá viven en su propio localStorage: las dos apps
// no comparten información de pacientes entre sí).
export const PACIENTES_INICIALES: Paciente[] = [
  { id: '1', nombre: 'Alex', apellido: 'Silva', cc: '1130123456', telefono: '3001234567' },
  { id: '2', nombre: 'Juan', apellido: 'Silva', cc: '1130987654', telefono: '3007654321' },
  { id: '3', nombre: 'Lucas', apellido: 'Goyes', cc: '1130456789', telefono: '3009876543' },
  { id: '4', nombre: 'Leiton', apellido: 'Garcia', cc: '1130765432', telefono: '3002345678' },
]
