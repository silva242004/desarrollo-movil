import type { Paciente } from '../data/mockData'
import { PACIENTES_INICIALES } from '../data/mockData'

const KEYS = {
  session: 'mediclinic_pwa_session',
  pacientes: 'mediclinic_pwa_pacientes',
} as const

export interface Sesion {
  loggedIn: true
  email: string
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

export function guardarPacientes(pacientes: Paciente[]): void {
  localStorage.setItem(KEYS.pacientes, JSON.stringify(pacientes))
}
