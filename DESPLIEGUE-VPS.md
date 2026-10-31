# MiCatálogo: correcciones críticas y preparación del VPS

Fecha: 30/10/2026. Base: `98317f2`. Se conservan los cambios locales anteriores.

## Correcciones aplicadas

| Hallazgo | Cambio | Límite operativo |
| --- | --- | --- |
| C-1: login en instalación limpia | Migración versionada de `personal_access_tokens`; prueba de login, uso y revocación de un token real. | Aplicar las migraciones en el servidor. |
| C-2: secretos en Git | Compose obtiene secretos de un archivo ignorado; generador de claves aleatorias; contextos Docker excluyen `.env`, dependencias locales y cachés. | La clave antigua sigue comprometida en el historial. La rotación efectiva requiere actualizar el VPS. |
| C-3: precios manipulables | Checkout y carritos resuelven IDs activos de la tienda, usan nombre y precio de BD y calculan importes en centavos. Rechazan productos inexistentes, ajenos, inactivos o sin stock suficiente; suman cantidades repetidas antes de validar stock. | Los pedidos siguen siendo solicitudes pendientes: no reservan stock. El descuento ocurre al completarlos en el flujo existente. El hallazgo A-6 sobre transiciones de estado sigue pendiente. |
| C-4: credenciales conocidas | En producción solo se crea el superadmin configurado con contraseña de al menos 16 caracteres. No se sobrescriben cuentas existentes ni se promueven clientes. `DemoSeeder` rechaza producción incluso si se invoca directamente. | Las cuentas de demostración que ya existan en una BD requieren revisión y cambio de contraseña o suspensión, además de revocar sus tokens. |
| C-5: herramientas expuestas | phpMyAdmin y Mailpit solo se activan con el perfil `tools`, y sus puertos escuchan en `127.0.0.1`. La aplicación de producción exige SMTP externo. También se restringieron estos puertos en los Compose alternativos de desarrollo. | Verificar envío real de correo con las credenciales SMTP del servidor. |

Los pedidos y carritos públicos ahora requieren un ID válido por producto. Los campos `price`, `name` y `total_amount` enviados por el navegador no determinan los importes guardados. El frontend existente ya envía IDs.

El entrypoint del contenedor PHP ejecuta `migrate --force` y `optimize` antes de arrancar PHP-FPM; no ejecuta seed automáticamente. Los puertos web 8001 y 8002 también quedan limitados a loopback, para colocar un proxy HTTPS en el VPS.

## Validaciones locales

```powershell
cd api-micatalogo
php artisan test
cd ../front-micatalogo
npm run build
cd ..
node scripts/check-compose.mjs
```

Resultado de la revisión: 13 pruebas y 63 aserciones aprobadas, formato PHP aprobado, build React aprobado y validación Compose aprobada. También se comprobó que la nueva APP_KEY tiene 32 bytes, difiere de la anterior, que las contraseñas de BD son independientes y que el generador no sobrescribe archivos existentes.

PHPUnit usa SQLite en memoria, sin modificar la BD local. Las pruebas cubren autenticación Sanctum, precios falsificados, límites de tienda, stock agregado, importes decimales y seed de producción. La comprobación de Compose usa credenciales temporales y comprueba servicios por defecto, perfil de herramientas, puertos, SMTP y rechazo de secretos vacíos.

El build de frontend conserva el aviso de bundle superior a 500 kB. No se ejecutó el stack ni se construyeron imágenes: Docker Desktop está instalado, pero el motor Linux no estuvo disponible. Tampoco se verificaron bloqueos concurrentes sobre MariaDB ni entrega real por SMTP. Esas comprobaciones siguen pendientes antes de publicar.

Actualización posterior del 30/10/2026: a solicitud del usuario se construyó y ejecutó el stack local completo en Docker Desktop mediante `docker-compose.local.yml`. Pasaron migraciones y pruebas HTTP con MariaDB; se verificó entrega SMTP a Mailpit. El detalle está en `DOCKER-LOCAL.md`. La entrega mediante proveedor SMTP externo y la prueba de concurrencia de inventario siguen pendientes.

## Configuración del servidor

Usar el `docker-compose.yml` de la raíz. Los archivos Compose del backend son alternativas de desarrollo y no deben usarse para el despliegue de producción.

En un servidor nuevo con PHP CLI disponible, ejecutar desde la raíz:

```sh
php scripts/init-production-env.php
chmod 600 .env.production
```

El generador crea `APP_KEY`, contraseñas de BD y una contraseña de bootstrap distintas; no las imprime y rechaza sobrescribir un archivo existente. También se generó un archivo local ignorado durante esta revisión. Para el VPS, generar sus propios secretos o transferir el archivo mediante un canal seguro; nunca incluirlo en Git ni en la imagen.

Editar `.env.production` con el dominio real en `APP_URL` y `FRONTEND_URL`, las credenciales de SMTP, remitente y `SEED_SUPERADMIN_EMAIL`. La plantilla usa SMTP con STARTTLS en el puerto 587; ajustar esquema y puerto al proveedor. No dejar `catalogo.example.com`. Sin PHP CLI en el host, copiar la plantilla y generar los secretos con herramientas equivalentes del servidor.

En una instalación existente, respaldar la BD y los secretos vigentes antes de cambiarlos. Cambiar `APP_KEY` invalida los datos cifrados con la clave anterior; revisar si hay datos que necesiten migración. No configurar la clave comprometida como clave anterior aceptada. Rotar también las credenciales de BD en MariaDB: modificar las variables de Compose no cambia las contraseñas de un volumen ya inicializado. Conservar `DB_DATABASE` y `DB_USERNAME` acordes con esa BD.

Antes de abrir acceso público, revisar cuentas con las credenciales de demostración de la auditoría, cambiar sus contraseñas o suspenderlas y revocar tokens existentes. Cambiar `APP_KEY` no revoca por sí solo los tokens Sanctum.

## Construcción y arranque, después de completar la configuración

```sh
docker compose --env-file .env.production config --quiet
docker compose --env-file .env.production build
docker compose --env-file .env.production up -d
docker compose --env-file .env.production logs --tail=100 app
```

La primera instalación puede crear el superadmin explícitamente:

```sh
docker compose --env-file .env.production exec app php artisan db:seed --force
```

Después del bootstrap, retirar `SEED_SUPERADMIN_PASSWORD` del archivo y recrear `app` para eliminarlo también del entorno y de la caché de configuración:

```sh
docker compose --env-file .env.production up -d --force-recreate app
```

Configurar el proxy HTTPS del VPS hacia `127.0.0.1:8002`. El frontend ya reenvía `/api/` al backend. Validar las URLs de catálogo y producto, login/logout, rechazo de un checkout con producto ajeno o sin stock, recuperación de contraseña y confirmación de correo recibidas en un buzón real.

### Requisitos del proxy HTTPS

El proxy debe terminar TLS y enviar `X-Forwarded-For` y `X-Forwarded-Proto`. Laravel confía solo en saltos de redes privadas (`TRUSTED_PROXIES`) y usa la IP del visitante para los límites de solicitudes. Si el proxy no envía `X-Forwarded-For`, todos los visitantes compartirían el mismo límite: el registro admite 10 cuentas por hora y conexión. El Nginx del frontend envía HSTS cuando el proxy indica HTTPS. Las demás cabeceras de seguridad, incluida la CSP, ya vienen de las imágenes.

Ejemplo con Caddy instalado en el host. Caddy obtiene el certificado y envía esas cabeceras por defecto:

```caddyfile
catalogo.example.com {
    encode gzip
    reverse_proxy 127.0.0.1:8002
}
```

Después de configurarlo, comprobar desde fuera que `https://dominio/` devuelve `Strict-Transport-Security` y `Content-Security-Policy`, y que cinco logins fallidos seguidos desde una conexión no bloquean a otra.

### Rotación de credenciales en el VPS

Esta parte requiere acceso al servidor y no se ha realizado:

1. Respaldar la BD y el `.env.production` vigente.
2. Generar secretos nuevos y cambiar la contraseña del usuario de MariaDB con `ALTER USER`; después actualizar `.env.production`.
3. Revisar las cuentas `superadmin@`, `admin@` y `cliente@micatalogo.com`: suspenderlas o cambiarles la contraseña. Suspender, cambiar la contraseña, el correo o el rol revoca automáticamente sus tokens.
4. Recrear `app` y comprobar el login de las cuentas reales.

Para administrar la BD de forma temporal, iniciar únicamente phpMyAdmin con el perfil `tools` y usar un túnel SSH hacia `127.0.0.1:8081`. No es necesario iniciar Mailpit en producción. No publicar puertos de herramientas ni de la BD en el firewall.

## Pendientes fuera de estos cinco hallazgos

Esta corrección no equivale a cerrar toda la auditoría. La actualización de prioridad 1 del 30/10/2026 cerró rate limiting, XSS y editor del blog, dependencias vulnerables, transiciones de stock, expiración y revocación de tokens, verificación de correo y cabeceras de seguridad. El detalle está en `REPORTE-COMPLETO-2026-10-30.md`, sección 13.

Siguen pendientes la rotación de credenciales y el certificado TLS en el VPS, el cobro real y la limpieza del historial de Git. No se reescribió el historial ni se desplegó al VPS.
