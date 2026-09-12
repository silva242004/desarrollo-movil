# Parcial 1 - MediClinic

Rama: `parcial-1-alex-silva`


## Credenciales

**PWA (carpeta `pwa/`):** `user@mail.com` / `123`

**Ionic (carpeta `ionic/`):** `doctor@mediclinic.com` / `medico123` (también sirve `medico@mediclinic.com` / `clinica2026`)

## Credenciales

**PWA (carpeta pwa/):** user@mail.com / 123

**Ionic (carpeta ionic/):** doctor@mediclinic.com / medico123 (también dejé medico@mediclinic.com / clinica2026)

## Ejercicio 1 - PWA (administración de pacientes)

Para el login puse un usuario fijo. Si alguien pone mal el correo o la clave, le sale un mensaje de error en pantalla. Si entra bien, guardo la sesión en localStorage, así que si recarga la página no le vuelve a pedir el login (por eso puse también el botón de "Cerrar sesión" arriba).

Ya adentro se ve la lista de pacientes, que armé con 4 de ejemplo (Alex Silva, Juan Silva, Lucas Goyes y Leiton Garcia). Arriba puse un formulario para agregar uno nuevo: pide nombre, apellido, CC y teléfono. Si dejas nombre, apellido o CC vacíos, o si en la CC metes letras, no deja agregarlo y marca el campo en rojo. Cada paciente que se agrega queda guardado de una en localStorage.

Debajo del formulario puse el buscador, que filtra la lista por nombre, apellido o CC a medida que escribes.

Esta la hice como una PWA de verdad, no solo una página: le puse su manifest.json y su service-worker.js hechos a mano (sin plugins), así que se puede instalar y funciona con la estrategia de caché que vimos en clase (network first para el HTML, cache first para JS/CSS e imágenes).

## Ejercicio 2 - Ionic (visitas del médico)

El login lo hice parecido pero con componentes de Ionic: si alguien se equivoca de clave le sale un IonToast (la notificación que aparece arriba y se cierra sola). La sesión también la guardo en localStorage.

Ya adentro puse las tres pestañas de abajo: Visitas, Pacientes y Perfil.

En Visitas se ven las citas del día: paciente, hora y el estado (pendiente, en camino o finalizada, cada uno con su color). Si tocas una visita entras al detalle, y ahí puse un botón para ir avanzando el estado en orden (pendiente → en camino → finalizada); cada cambio lo guardo al toque.

Pacientes es solo un directorio fijo de la clínica, sin relación con las visitas. Y en Perfil puse el nombre y correo del médico que inició sesión, con el botón para cerrar sesión.

Las capturas de cada flujo están en screenshots/pwa/ y screenshots/ionic/.