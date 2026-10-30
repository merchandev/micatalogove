# MiCatálogo en Docker Desktop

Este entorno ejecuta la aplicación completa en la computadora: React, API Laravel, MariaDB, phpMyAdmin y Mailpit. Aparece como proyecto **micatalogo-local** en Docker Desktop y usa un volumen propio, sin modificar otras bases de datos.

## Direcciones y accesos

| Pantalla | Dirección |
| --- | --- |
| Inicio | http://localhost:8002 |
| Acceso al panel | http://localhost:8002/admin/login |
| Catálogo funcional de ejemplo | http://localhost:8002/arturomerchan18 |
| Diseños de demostración | http://localhost:8002/demos |
| Registro de tiendas | http://localhost:8002/register |
| Plan actual | http://localhost:8002/planes |
| Suscripción del cliente / revisión del superadmin | http://localhost:8002/admin/subscription |
| Correos de prueba | http://localhost:8025 |
| Base de datos | http://localhost:8081 |

Las tres cuentas de demostración usan la contraseña `password123`, exclusivamente en este entorno local:

| Cuenta | Rol | Qué permite revisar |
| --- | --- | --- |
| superadmin@micatalogo.com | Superadmin | Panel global, usuarios, productos, pedidos, conversaciones, carritos, blog y acceso a BD. |
| admin@micatalogo.com | Administrador | Gestión de plataforma, sin acceso al módulo de BD ni gestión de superadmins. |
| cliente@micatalogo.com | Cliente | Gestión de Arturo Store: productos, configuración, pedidos, conversaciones y carritos. |

Para phpMyAdmin, el servidor es `db`, el usuario es `micatalogo` y la contraseña está en `.env.docker.local`, campo `DB_PASSWORD`. No es la contraseña de las cuentas de la aplicación.

## Recorrido recomendado

1. Abrir el catálogo `arturomerchan18` y revisar la ficha de un producto. Esta tienda usa productos guardados en MariaDB; los diseños de `/demos` son ejemplos visuales.
2. Entrar al panel con la cuenta cliente. Revisar productos, precios, existencias y configuración de la tienda, incluido su enlace y QR.
3. Añadir productos al carrito del catálogo. El sistema registra el carrito para seguimiento.
4. Solicitar el pedido por WhatsApp. Se crea un pedido pendiente y una conversación. El número incluido en los datos demo es ilustrativo: sustituirlo por un número propio antes de enviar mensajes reales.
5. En el panel, revisar conversaciones y pedidos. Marcar un pedido como completado registra la venta y descuenta stock una sola vez. Pasarlo a pendiente o cancelado repone las unidades. Si no hay existencias suficientes, la venta no se completa y la pantalla muestra el motivo.
6. Entrar como superadmin para revisar usuarios, roles y el alcance global del panel.
7. Probar «Olvidé mi contraseña» y abrir Mailpit. Los correos llegan a esa bandeja local; no salen a Internet.

El checkout usa precios de la BD y valida stock, pero los pedidos pendientes no reservan unidades. El registro crea la cuenta y envía un correo de confirmación, que llega a Mailpit. El catálogo de la tienda nueva se publica al confirmar ese correo; mientras tanto, el propietario puede preparar la tienda desde el panel. Las cuentas que ya existían se marcaron como confirmadas. El editor del blog funciona con Quill 2 y el HTML de las publicaciones se sanea.

Login, registro, recuperación de contraseña, checkout y carritos tienen límites de solicitudes. Por ejemplo, el sexto intento fallido de login en un minuto para el mismo correo devuelve 429. Las sesiones del panel caducan a los siete días; al expirar o revocarse el token, el panel vuelve al login.

La versión actual incluye una prueba de siete días y un único plan de USD 5 al mes. El registro inicia la prueba; al vencer se pausa el catálogo y los cambios de la tienda, conservando consulta y renovación. La sección Suscripción permite reportar una referencia de pago y al superadmin aprobarla. Es un flujo manual provisional sin cobros reales ni pasarela conectada; consultar `MODELO-NEGOCIO.md`.

## Resultado de la puesta en marcha

Los seis servicios se construyeron y arrancaron correctamente en Docker Desktop. Las 19 migraciones se aplicaron sobre MariaDB, incluida la tabla de tokens. Se verificaron por HTTP los tres roles, el panel y sus listados, la denegación de funciones restringidas, el catálogo público, la ficha por slug, los precios calculados por el servidor, el checkout y el rechazo de stock insuficiente.

La prueba dejó una venta completada de USD 1.200, una conversación, un carrito recuperado y otro abierto, con nombres de prueba Docker. La Laptop Gamer quedó con seis unidades después de esa venta de prueba. No se envió ningún mensaje de WhatsApp ni se realizó un cobro real. Mailpit recibió un correo de recuperación para la cuenta superadmin.

Se revisaron en el navegador el catálogo, la ficha de producto y el panel autenticado. Se confirmó que `/admin/blog/create` queda en blanco por `findDOMNode is not a function`, procedente del editor React Quill incompatible con React 19. Corregido en la actualización de prioridad 1: el editor se reemplazó y se comprobó en el navegador la creación y edición de un borrador.

La prueba de integración puede repetirse con `node scripts/smoke-local.mjs`; crea otra venta de prueba y descuenta una unidad, por lo que no debe ejecutarse solo para comprobar si los contenedores están encendidos. Para eso basta con `docker compose ... ps`.

## Encender y detener

Desde la raíz del proyecto:

```powershell
docker compose --env-file .env.docker.local -f docker-compose.local.yml up -d --build
docker compose --env-file .env.docker.local -f docker-compose.local.yml ps
docker compose --env-file .env.docker.local -f docker-compose.local.yml logs --tail=100 app
```

Para detenerlo conservando la BD:

```powershell
docker compose --env-file .env.docker.local -f docker-compose.local.yml stop
```

Para volver a iniciarlo sin reconstruir:

```powershell
docker compose --env-file .env.docker.local -f docker-compose.local.yml start
```

Las migraciones se aplican al arrancar el contenedor PHP. Los datos demo se cargaron explícitamente en la primera instalación. No repetir el seeder después de editar esos datos: actualiza cuentas, productos y stock de demostración.

Los cambios de código necesitan reconstruir las imágenes. `.env.docker.local` está excluido de Git y contiene secretos exclusivos de este entorno. Todos los puertos publicados están limitados a esta computadora.
