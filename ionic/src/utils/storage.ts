// Todas las claves de localStorage usadas por la app de Ionic quedan
// centralizadas acá para que sea evidente qué se persiste y dónde.
import type { Paciente, Visita } from '../data/mockData'
import { PACIENTES_INICIALES, VISITAS_INICIALES } from '../data/mockData'

const KEYS = {
  session: 'mediclinic_ionic_session',
  visitas: 'mediclinic_ionic_visitas',
  pacientes: 'mediclinic_ionic_pacientes',
} as const

export interface Sesion {
  loggedIn: true
  email: string
  nombre: string
}

// ---------- Sesión ----------
export function getSesion(): Sesion | null {
  const raw = localStorage.getItem(KEYS.session)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Sesion
  } catch {
    return null
  }
}

export function guardarSesion(sesion: Sesion): void {
  localStorage.setItem(KEYS.session, JSON.stringify(sesion))
}

export function cerrarSesion(): void {
  localStorage.removeItem(KEYS.session)
}

// ---------- Visitas ----------
export function getVisitas(): Visita[] {
  const raw = localStorage.getItem(KEYS.visitas)
  if (!raw) {
    // Primera vez que se abre la app: sembramos las visitas de ejemplo.
    localStorage.setItem(KEYS.visitas, JSON.stringify(VISITAS_INICIALES))
    return VISITAS_INICIALES
  }
  try {
    return JSON.parse(raw) as Visita[]
  } catch {
    return VISITAS_INICIALES
  }
}

export function guardarVisitas(visitas: Visita[]): void {
  localStorage.setItem(KEYS.visitas, JSON.stringify(visitas))
}

// ---------- Pacientes ----------
export function getPacientes(): Paciente[] {
  const raw = localStorage.getItem(KEYS.pacientes)
  if (!raw) {
    localStorage.setItem(KEYS.pacientes, JSON.stringify(PACIENTES_INICIALES))
    return PACIENTES_INICIALES
  }
  try {
    return JSON.parse(raw) as Paciente[]
  } catch {
    return PACIENTES_INICIALES
  }
}
