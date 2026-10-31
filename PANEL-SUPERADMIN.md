# Administración global del sistema

El superadmin entra a `/admin/dashboard` y ve el resumen global de tiendas, clientes, correos sin confirmar, suscripciones pagadas, reportes pendientes y mensualidades aprobadas. El mismo módulo está disponible en **Tiendas y clientes** (`/admin/stores`).

La lista incluye tiendas sin pagos y sin propietario. Los clientes sin tienda aparecen en una sección independiente. Las listas tienen paginación; las tiendas pueden buscarse por nombre, dominio, propietario o correo, y filtrarse por estado, activación y suscripción.

Desde **Administrar** se puede:

- Consultar propietario, correo, plazo de activación, estado de cuenta y vigencia.
- Reenviar la activación o confirmarla administrativamente. La confirmación manual exige una acción explícita del superadmin y registra actor, usuario y tienda en el log. No concede una mensualidad ni levanta suspensiones.
- Suspender o reactivar una tienda. Si el cliente sigue suspendido, la tienda no se vuelve pública.
- Suspender o activar al cliente con las acciones existentes de gestión de usuarios.
- Editar nombre, dominio, WhatsApp, descripción y diseño de la tienda.
- Consultar el historial paginado de mensualidades y aprobar o rechazar reportes pendientes. La aprobación conserva las reglas de un mes e idempotencia del controlador de suscripciones.

Las rutas globales y las acciones nuevas están restringidas al rol superadmin tanto en la API como en la interfaz. Los clientes y administradores ordinarios no pueden acceder a ellas. La administración de usuarios y la pantalla global de reportes de suscripción también siguen accesibles desde el menú.

**Cambiar contraseña** (`/admin/security`) permite reemplazar la contraseña actual. Exige la contraseña vigente, una nueva de al menos 12 caracteres y confirmación. Al guardar revoca las sesiones y requiere iniciar sesión de nuevo. Esta función está disponible incluso si la tienda de un cliente tiene la suscripción vencida.

Se creó una cuenta exclusiva de administración para Docker Desktop, sin reemplazar las cuentas existentes ni incorporar la contraseña en el código, seeders o documentación. Sus datos de acceso se entregan al usuario en el chat y se conservan únicamente en un archivo local ignorado dentro de `artifacts/`.

## Entrar al panel de un cliente para asistencia

Cada tienda tiene un botón **Entrar al panel**, también disponible dentro de **Administrar**. Al confirmar se abre el panel del cliente seleccionado, con una franja visible que identifica la asistencia y un botón **Volver al superadmin**.

No se pide ni se copia la contraseña del cliente, y no se emite un token a su nombre. Se conserva la sesión original del superadmin y se usa un contexto de asistencia guardado en `sessionStorage` de la pestaña. La API valida en cada solicitud el superadmin, el token original, el cliente, la tienda y la caducidad. Durante la asistencia los controladores y permisos reciben únicamente al cliente y su tienda.

La asistencia dura hasta 30 minutos. Al salir se invalida el contexto y se vuelve al panel global. Si vence o deja de ser válida, la interfaz retira el contexto y vuelve al panel del superadmin conservando su token original si sigue vigente. No se admite asistencia anidada ni uso del contexto con otro token o por otro administrador.

El cliente debe estar activo. La asistencia respeta la vigencia de la suscripción: el panel puede consultarse tras vencer, pero los cambios que ya están bloqueados para el cliente siguen bloqueados. Para reactivar cuentas o revisar mensualidades se vuelve al panel global. No permite cambiar contraseñas, reportar pagos como cliente ni usar el cierre de sesión del cliente desde el contexto.

La tabla `support_sessions` conserva actor, cliente, tienda, token asociado, inicio, vencimiento y cierre. `support_actions` registra los métodos, rutas, resultados y fechas de las solicitudes de modificación. No almacena cuerpos de formularios, contraseñas ni valores de tokens. Se conservan las referencias de auditoría si se revoca el token; el contexto deja de funcionar.

Validación del backend: 62 pruebas aprobadas, 449 aserciones. Incluyen permisos, búsqueda, filtros, paginación, tiendas sin pagos/propietarios, clientes sin tienda, separación del historial, activación manual, cambio de contraseña, aislamiento del modo de asistencia, registro de cambios, regreso al superadmin, caducidad, vinculación al token y revocación.
