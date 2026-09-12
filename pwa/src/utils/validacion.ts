// Reglas de validación del formulario de pacientes.
// Nombre/apellido: solo que no estén vacíos.
// CC: solo dígitos (sin mínimo de longitud).

export function validarNoVacio(valor: string): boolean {
  return valor.trim().length > 0
}

export function validarCC(valor: string): boolean {
  return /^\d+$/.test(valor.trim())
}

export interface ErroresPaciente {
  nombre?: string
  apellido?: string
  cc?: string
}

export function validarPaciente(datos: { nombre: string; apellido: string; cc: string }): ErroresPaciente {
  const errores: ErroresPaciente = {}

  if (!validarNoVacio(datos.nombre)) {
    errores.nombre = 'El nombre es obligatorio.'
  }
  if (!validarNoVacio(datos.apellido)) {
    errores.apellido = 'El apellido es obligatorio.'
  }
  if (!validarNoVacio(datos.cc)) {
    errores.cc = 'La CC es obligatoria.'
  } else if (!validarCC(datos.cc)) {
    errores.cc = 'La CC solo puede contener números.'
  }

  return errores
}
