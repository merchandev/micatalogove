# Reporte completo de cambios y mejoras futuras — MiCatálogo

**Fecha:** 30/10/2026 · **Zona horaria:** America/Caracas  
**Proyecto:** Laravel API + React SPA + Docker  
**Commit base y último commit observado:** `98317f2` — `feat: complete registration flow, fix backend tokens, redesign demos`

## 1. Estado general

MiCatálogo está ejecutándose en Docker Desktop como proyecto `micatalogo-local`. Los seis servicios están activos: aplicación PHP, servidor web de la API, frontend, MariaDB, phpMyAdmin y Mailpit. La base de datos y Mailpit reportan estado saludable.

La versión permite explorar un catálogo funcional, gestionar productos y tiendas, consultar pedidos, conversaciones y carritos, probar roles y revisar el nuevo modelo de suscripción. No está desplegada al VPS. El cobro real no está conectado y persisten hallazgos de seguridad y funcionamiento que deben resolverse antes de abrir producción.

Se conservaron los cambios locales que ya existían. El trabajo continúa sin nuevos commits respecto a la base indicada; hay archivos modificados y archivos nuevos pendientes de versionar. Este reporte no implica que todos esos cambios se hayan creado en esta conversación.

| Procedencia | Alcance |
| --- | --- |
| Cambios recibidos al iniciar | Rutas públicas, dominios, QR, roles, usuarios, inventario, pedidos, conversaciones, carritos, recuperación de contraseña y panel administrativo. |
| Trabajo realizado posteriormente | Correcciones de cinco hallazgos críticos en código/configuración, pruebas de regresión, entorno Docker local, verificación con MariaDB y navegador, suscripción de siete días y USD 5/mes, documentación y revisión de Natan. |
| Pendiente | Cobro definitivo, cierre del resto de la auditoría, rediseño y unificación del carrito, planes superiores y despliegue del VPS. |

## 2. Catálogos, productos y enlaces públicos

### Rutas disponibles

| Ruta | Función |
| --- | --- |
| `/:domain` | Página del catálogo de una tienda. |
| `/:domain/productos` | Listado de productos de la tienda. |
| `/:domain/productos/:productId` | Ficha individual. |
| `/:domain/producto/:productId` | Alias singular compatible. |
| `/tienda/:domain` | Enlace heredado al catálogo. |
| `/tienda/:domain/productos/:productId` | Enlace heredado a la ficha. |
| `/tienda/:domain/producto/:productId` | Alias heredado singular. |

Los productos pueden resolverse por ID, prefijo `id-slug`, slug del nombre o SKU. Las respuestas públicas incluyen un slug calculado. Los títulos del catálogo y de la ficha se actualizan con el nombre de tienda y producto.

El registro y la gestión de usuarios normalizan el dominio de la tienda a partir de su nombre. La configuración valida longitud, formato, unicidad y nombres reservados. La lista de reservados evita colisiones con rutas como administración, autenticación, blog y demos.

El inventario y la configuración generan enlaces y códigos QR para compartir productos y tiendas. Las cinco plantillas enlazan a las fichas públicas: Boutique, Postres, Tech, Restaurant y Minimal.

**Límites pendientes:** los slugs se calculan desde el nombre y pueden cambiar al renombrar un producto; todavía no hay una estrategia completa de URLs estables, redirecciones y metadatos sociales/SEO por producto.

## 3. Funciones administrativas recibidas y conservadas

### Roles y acceso

- **Superadmin:** gestión global y acceso al módulo de base de datos. Es el único rol que puede aprobar las mensualidades incorporadas en esta actualización.
- **Administrador:** gestión de plataforma dentro de sus permisos, sin acceso al módulo de base de datos ni aprobación de mensualidades.
- **Cliente:** gestión de la tienda asociada a su cuenta.

El backend aplica autenticación, estado de cuenta y restricciones por rol. El trait de alcance por tienda se utiliza en los módulos administrativos. La interfaz también limita rutas y opciones del menú.

### Módulos

| Módulo | Funcionalidad presente |
| --- | --- |
| Usuarios | Creación, aprobación, suspensión y roles; asociación de clientes con tiendas. |
| Tienda | Nombre, dominio, WhatsApp, descripción, logo, diseño y enlaces compartibles. |
| Inventario | Productos, categorías, SKU, precio, existencias y umbral de stock bajo. |
| Conversaciones | Consultas recibidas, estados, mensajes y seguimiento. |
| Carritos | Registro de carritos, actividad, estado abierto y recuperación al generar pedido. |
| Pedidos/ventas | Pedidos pendientes, completados y cancelados; artículos y totales. |
| Dashboard | Métricas, ventas, productos destacados, alertas de inventario y actividad. |
| Recuperación de contraseña | Solicitud de enlace, cambio de contraseña y revocación de tokens al cambiarla. |
| Blog | Listado y rutas administrativas/públicas; editor y seguridad de HTML pendientes. |

Entre los archivos nuevos del árbol recibido estaban los modelos de pedidos, artículos, conversaciones, mensajes y carritos, sus controladores y ocho migraciones para roles, estados, inventario y módulos comerciales.

La existencia de un módulo no equivale a una validación exhaustiva de todas sus operaciones. Los listados principales y permisos se comprobaron por HTTP; la revisión visual cubrió pantallas concretas descritas en la sección de pruebas.

## 4. Correcciones críticas de la auditoría

### C-1. Login en instalación limpia

Se añadió `2026_10_30_000000_create_personal_access_tokens_table.php`. La migración crea la tabla de tokens de Sanctum, con token almacenado como hash, capacidades, fecha de último uso y expiración opcional.

Se comprobó login, acceso autenticado con token real, cierre de sesión y rechazo del token revocado. La migración también se aplicó correctamente en MariaDB dentro de Docker.

**Estado:** corregido y verificado localmente. La columna de expiración no significa que ya exista una política de caducidad de sesiones: ese punto de la auditoría sigue pendiente.

### C-2. Secretos incluidos en archivos versionados

- Se retiraron la APP_KEY y las contraseñas fijas del Compose de producción.
- Compose exige valores externos y rechaza secretos vacíos.
- Se añadió `.env.production.example` sin secretos reales.
- `scripts/init-production-env.php` genera APP_KEY y contraseñas independientes, no las imprime y rechaza sobrescribir un archivo existente.
- Se verificó que la APP_KEY generada tiene 32 bytes y difiere de la anterior.
- Los archivos locales de entorno están ignorados por Git.
- Los contextos Docker excluyen archivos de entorno, dependencias locales, logs, cachés y la BD local conocida del backend.
- Los Compose alternativos dejaron de incluir las contraseñas fijas detectadas.

**Estado:** corregido en el árbol de trabajo y en las nuevas imágenes locales. La clave antigua sigue comprometida en el historial. No se reescribió el historial ni se rotaron credenciales de un VPS. Cambiar variables de Compose no cambia las contraseñas de una BD cuyo volumen ya está inicializado.

### C-3. Manipulación de precios en checkout y carritos

`StorefrontLeadController` ahora exige IDs válidos y busca los productos activos dentro de la tienda correspondiente. Usa el nombre y precio de BD; los valores de nombre, precio y total enviados por el navegador no determinan los importes guardados.

Las cantidades repetidas de un producto se suman antes de validar stock. Se rechazan productos inexistentes, ajenos, inactivos o sin existencias suficientes. Se limitan líneas/cantidades y se calculan los importes en centavos enteros, con límite de total. También se guardan productos resueltos por el servidor en los metadatos de la conversación.

El cálculo y la escritura ocurren dentro de transacciones; la lectura de productos usa bloqueo de filas.

**Estado:** corregido y probado con precios manipulados y solicitudes reales a Docker/MariaDB. Los pedidos pendientes no reservan stock. Falta corregir el ciclo completo de descuento y reposición al cambiar estados.

### C-4. Cuentas conocidas creadas por el seeder en producción

Se separó el seeder de demostración del seeder de producción. En producción se exige correo configurado y contraseña de bootstrap de al menos 16 caracteres. Solo se crea el superadmin; no se crean usuarios ni productos demo. No se reinicia la contraseña de una cuenta existente ni se promueve un cliente que comparta el correo configurado.

`DemoSeeder` rechaza producción incluso si se invoca directamente. Las cuentas conocidas se conservaron exclusivamente para la demostración local.

**Estado:** corregido y cubierto por pruebas. Si una BD existente ya contiene cuentas demo, se deben revisar, cambiar contraseñas o suspenderlas y revocar sus tokens. El nuevo seeder no sanea automáticamente cuentas antiguas.

### C-5. phpMyAdmin y Mailpit expuestos

En el Compose de producción estas herramientas solo arrancan con el perfil `tools`; sus puertos se limitan a `127.0.0.1`. La aplicación de producción exige un servidor SMTP externo. También se restringieron los puertos de herramientas en los Compose alternativos.

En Docker Desktop ambas herramientas están encendidas deliberadamente para explorar y probar la aplicación, con acceso limitado a la computadora. Mailpit captura los mensajes sin enviarlos a Internet.

**Estado:** configuración corregida y puertos locales comprobados. Falta verificar la configuración final del VPS y la entrega con un proveedor SMTP real.

## 5. Entorno Docker Desktop

Se añadió `docker-compose.local.yml`, independiente del entorno de producción. Usa el proyecto `micatalogo-local`, secretos locales propios y el volumen `micatalogo-local_database`.

| Servicio | Función | Acceso del host |
| --- | --- | --- |
| `front-web` | React compilado servido por Nginx | `127.0.0.1:8002` |
| `api-web` | Nginx de la API | `127.0.0.1:8001` |
| `app` | Laravel/PHP-FPM | Interno, sin puerto público. |
| `db` | MariaDB | Interno, sin puerto publicado. |
| `phpmyadmin` | Administración de la BD local | `127.0.0.1:8081` |
| `mailpit` | Bandeja de pruebas | `127.0.0.1:8025` |

El entrypoint de PHP aplica migraciones y ejecuta la optimización de Laravel antes de iniciar PHP-FPM. No ejecuta seed automáticamente. Se añadieron atributos de Git para conservar los scripts de shell con finales de línea LF.

Se construyeron las tres imágenes de aplicación y se cargaron explícitamente los datos demo. El primer arranque aplicó 19 migraciones; después se aplicó la migración de suscripciones. El volumen conserva los datos al detener y reiniciar los servicios.

La prueba del flujo comercial dejó una venta **ficticia** de USD 1.200, una conversación, un carrito recuperado y otro abierto. La Laptop Gamer quedó con seis unidades después de la venta de prueba. No hubo cobro ni envío de WhatsApp.

### Direcciones

- Inicio: <http://localhost:8002>
- Acceso: <http://localhost:8002/admin/login>
- Catálogo: <http://localhost:8002/arturomerchan18>
- Plan: <http://localhost:8002/planes>
- Suscripción/revisión: <http://localhost:8002/admin/subscription>
- Demos visuales: <http://localhost:8002/demos>
- Correo local: <http://localhost:8025>
- BD local: <http://localhost:8081>

Las cuentas demo y los comandos de operación están en `DOCKER-LOCAL.md`. No se incluyen secretos de infraestructura en este reporte.

## 6. Nuevo modelo de negocio

### Definido por el usuario

| Regla | Valor actual |
| --- | --- |
| Prueba gratuita | 7 días. |
| Plan de pago inicial | Un único plan de USD 5 al mes. |
| Planes superiores | Se definirán después. |
| Distribución futura de funciones | Pendiente de definición. |
| Método de cobro definitivo | Pendiente de elección. |

La configuración canónica vive en `api-micatalogo/config/plans.php`. `/api/plans` la expone al frontend. No se añadieron cuotas arbitrarias de productos ni funciones inventadas para justificar niveles de precio.

### Funciones incluidas

Catálogo y fichas, inventario y alertas, carrito y pedidos por WhatsApp, conversaciones y seguimiento de carritos, panel de ventas, cinco diseños y QR. El blog global, los usuarios y el acceso a BD siguen siendo herramientas de los roles de plataforma.

### Prueba, vencimiento y conservación

- El servidor fija el final de prueba al crear una tienda.
- Cambiar nombre, dominio o diseño no reinicia los siete días.
- El registro no puede imponer una fecha pagada, precio o plan desde el navegador.
- Las tiendas existentes reciben siete días desde la instalación de la migración.
- Sin prueba o período pagado vigente, se bloquean catálogo público, productos, checkout y registro de carritos.
- El propietario conserva consulta del panel y acceso a renovación; las modificaciones quedan bloqueadas.
- Vencer no borra productos, pedidos ni conversaciones.
- Una suspensión administrativa continúa siendo independiente de la suscripción.

### Renovación manual provisional

El cliente reporta una referencia y observaciones. El servidor registra USD 5 y estado pendiente, sin conceder acceso adicional. El superadmin puede aprobar o rechazar; ni el cliente ni un administrador ordinario pueden aprobar.

Al aprobar se suma un mes calendario desde la fecha mayor entre hoy, el final de la prueba y el final ya pagado. Se conserva el tiempo restante y se ajusta correctamente al último día de meses cortos. Repetir una aprobación no concede otro mes. Hay transacciones, bloqueos, referencia única por tienda y un único reporte pendiente por tienda.

**Este flujo no cobra dinero, no valida un banco ni genera un comprobante fiscal.** Antes de cobrar de verdad deben definirse método, beneficiario, instrucciones, canal de soporte y evidencia de pago. No hay renovación automática ni proveedor conectado.

### Pantallas y archivos nuevos

- `Subscription.jsx`: estado, fechas, reportes e historial para el cliente; revisión para el superadmin.
- `SubscriptionBanner.jsx`: aviso de prueba o vencimiento.
- `SubscriptionController`, `SubscriptionPayment` y `EnsureSubscriptionAccess`.
- Campos de tienda: `plan_code`, `trial_ends_at`, `subscribed_until`.
- Tabla `subscription_payments`: importe, referencia, estado, revisor y período concedido.
- Rutas de consulta, reporte y revisión de mensualidades.

Se reemplazó la página de planes anterior: desaparecieron el gratuito permanente, USD 3,99 y USD 9,99 de esa página. Se actualizaron el registro, las llamadas a crear tienda, el enlace del menú y la descripción comercial de suscripciones en los términos. Esto último ajusta el texto al funcionamiento; no constituye una revisión legal integral.

## 7. Revisión de Natan Electronics

Se confirmó acceso al repositorio privado `merchandev/natan-electronics` y se revisó la copia local facilitada. Natan no se modificó; su cambio local previo en el historial se conservó.

| Área revisada | Qué conviene aprovechar | Situación en MiCatálogo |
| --- | --- | --- |
| Creación de pedidos | Precio y disponibilidad del servidor, cantidades agrupadas, identificador legible, datos de contacto y errores recuperables. | El precio/stock del servidor ya está implementado; faltan otras mejoras de experiencia. |
| Carrito lateral | Filas claras, resumen, estado vacío y acciones diferenciadas. | Referencia revisada; rediseño pendiente. |
| Carrito compartido | Enlace solo con IDs y cantidades, vista previa, precios actuales y confirmación al importar. | Pendiente de adaptar incluyendo la tienda. |
| Pruebas del carrito compartido | Enlaces inválidos, productos retirados, revalidación y alternativa al portapapeles. | Las cuatro pruebas de Natan pasan; no se han trasladado a MiCatálogo. |
| Diseño móvil | Controles táctiles, campos legibles, filtros y organización del catálogo. | Criterios identificados; falta adaptación y revisión visual. |
| Pedido y pago | Separar reporte, verificación y confirmación. | Principio aplicado al flujo manual de suscripción. |
| BNC/D3xD/Supabase | Integraciones específicas del negocio Natan. | No se copiaron servicios, datos ni credenciales. |

Natan usa HTML/JavaScript, Node y Supabase; MiCatálogo usa React, Laravel y MariaDB. Las piezas deben adaptarse, incluyendo aislamiento por tienda. No se ha hecho una fusión automática de proyectos ni se ha migrado su diseño completo.

## 8. Pruebas y evidencia

| Verificación | Resultado registrado |
| --- | --- |
| Suite PHP | 25 pruebas aprobadas, 125 aserciones. Incluye las dos pruebas originales y nuevas regresiones críticas y de suscripción. |
| Base de pruebas PHP | SQLite en memoria, sin sobrescribir la BD local de trabajo. |
| Formato PHP | Aprobado para los archivos revisados. |
| Build React | Aprobado. Bundle de aproximadamente 864 kB y 238 kB gzip; sigue el aviso de tamaño. |
| ESLint focalizado | Aprobado para `Planes.jsx`, `Subscription.jsx` y `SubscriptionBanner.jsx`. No equivale a que todo el frontend pase lint. |
| Configuración Compose | Aprobada: servicios, credenciales, SMTP, perfiles, puertos y rechazo de secretos vacíos. |
| Generación de secretos | Clave nueva válida, contraseñas independientes, exclusión de Git y protección de sobrescritura. |
| Docker/MariaDB comercial | Login de tres roles, permisos, listados, catálogo, ficha, precio del servidor, pedido, descuento inicial de stock y rechazo de stock insuficiente. |
| Docker/MariaDB suscripción | Registro con siete días, vencimiento, consulta, reporte, importe del servidor, permisos, aprobación repetida y reactivación. |
| Correo | Recuperación entregada a Mailpit; proveedor SMTP externo todavía no probado. |
| Navegador | Catálogo, ficha de producto, panel autenticado, nuevo plan y revisión de suscripciones. |
| Natan | Cuatro pruebas de carrito compartido aprobadas. |

Los datos sintéticos de la prueba de suscripciones se eliminaron al terminar, conservando Arturo Store. La prueba comercial dejó los ejemplos documentados deliberadamente.

Scripts disponibles: `check-compose.mjs`, `init-production-env.php`, `smoke-local.mjs` y `smoke-subscriptions.mjs`. El smoke comercial crea otra venta y descuenta otra unidad si se repite; no es un simple chequeo de disponibilidad.

Este reporte se elaboró con los resultados de las ejecuciones anteriores y una revisión actual de código, Git y servicios. No se repitió la auditoría completa de dependencias ni toda la batería de pruebas para redactarlo.

## 9. Problemas y mejoras pendientes

### Prioridad 1: antes de abrir producción

> Estado actualizado en la sección 13: stock, blog, sanitización, límites, dependencias, sesiones, verificación de correo y cabeceras quedaron corregidos. Siguen pendientes la rotación de credenciales y el TLS en el VPS, además del cobro real.

| Pendiente | Situación y acción necesaria |
| --- | --- |
| Inventario y transiciones de pedido | El ciclo completed → pending → completed puede descontar dos veces. Cancelar un pedido completado no repone stock. Implementar un registro de stock aplicado, transacciones, bloqueos, validación y reposición definida. |
| Editor del blog | Pantalla en blanco confirmada en Docker por `findDOMNode is not a function`. Sustituir React Quill por un editor compatible. |
| HTML del blog | El código sigue renderizando contenido con `dangerouslySetInnerHTML`; falta sanitización de HTML y pruebas de XSS. |
| Límites de solicitudes | No se añadieron throttles a login, registro y endpoints públicos durante esta intervención. Incorporarlos y probar su comportamiento. |
| Dependencias | La auditoría inicial informó vulnerabilidades PHP/JS. Actualizar y volver a ejecutar auditorías; no presentar sus conteos antiguos como un diagnóstico actualizado. |
| Sesiones | Definir expiración de tokens, revocación al suspender cuentas y estrategia de almacenamiento/autenticación del frontend. |
| Abuso de la prueba | El registro activa cuentas sin verificación de email. Definir verificación, moderación y medidas contra pruebas repetidas con cuentas nuevas. |
| Credenciales históricas | Rotar en el servidor, revisar cuentas demo preexistentes y decidir limpieza del historial sin perder trabajo. |
| HTTPS y cabeceras | Configurar proxy TLS y cabeceras de seguridad, incluida una CSP compatible con la aplicación. |
| Cobro real de suscripción | Definir método, datos de pago, instrucciones, comprobantes y soporte; validar el proceso completo antes de aceptar pagos. |

### Prioridad 2: carrito y experiencia de compra

1. Unificar el carrito utilizado por las cinco plantillas y resolver la duplicidad con el contexto global.
2. Guardar el carrito por tienda, restaurarlo al volver y revalidar productos, precios y existencias.
3. Impedir cantidades superiores al stock en la interfaz y explicar cambios de disponibilidad.
4. Mostrar errores de checkout y no continuar como si el pedido se hubiese registrado cuando la API falla.
5. Adaptar el carrito compartido de Natan con vista previa y confirmación, sin datos personales ni precios en el enlace.
6. Incorporar un número de pedido legible, resumen confirmado por el servidor y datos de entrega según el negocio.
7. Definir estados de pedido/pago/entrega por separado y decidir si se reserva stock en pedidos pendientes.
8. Revisar las cinco plantillas en móvil, tablet y escritorio, con accesibilidad, foco, carga, vacíos y errores.

### Prioridad 3: suscripciones y expansión comercial

- Definir formalmente método de cobro y evidencias de aprobación; el reporte actual solo admite referencia y observaciones.
- Incorporar recordatorios de fin de prueba, vencimiento y pago revisado.
- Mostrar al superadmin un listado de todas las tiendas por estado de suscripción; hoy la nueva pantalla de revisión lista reportes de pago.
- Definir cancelación, reactivación, tolerancia, retención de datos y política de cambios de precio.
- Definir permisos y cuotas por plan cuando existan planes superiores. Hoy hay configuración de un único plan, no un motor completo de prestaciones por nivel.
- Conectar una pasarela solo después de elegirla y definir notificaciones verificadas, reintentos e idempotencia.
- Separar cualquier cobro al comerciante por usar MiCatálogo de los pagos que sus clientes hagan por productos.

### Prioridad 4: datos, rendimiento y mantenimiento

- Paginar productos, usuarios, pedidos, conversaciones, carritos y publicaciones.
- Optimizar consultas del dashboard y revisar que las alertas de stock no cuenten productos inactivos.
- Exigir un identificador válido de sesión de carrito; actualmente sigue admitiendo `null`, con riesgo de mezclar carritos anónimos de una tienda.
- Revisar efectos de borrar usuarios sobre tiendas y publicaciones; priorizar suspensión y conservación del historial.
- Completar validación de publicaciones, imágenes y esquemas HTTP/HTTPS.
- Implementar realmente el formulario de contacto.
- Resolver mojibake y uniformar codificación sin alterar textos ni datos existentes.
- Dividir rutas y componentes con carga diferida para reducir el bundle.
- Corregir el lint restante y ampliar pruebas de autorización entre tiendas, UI y concurrencia de stock.
- Revisar archivos y Compose duplicados, código sin uso, BD local y `composer.phar` versionados; hacerlo preservando los datos existentes.
- Mejorar metadatos, URLs estables, tarjetas sociales y presentación inicial de la SPA.
- Configurar copias de seguridad verificadas, restauración, logs y alertas operativas.
- Revisar la presentación comercial de portada y funcionalidades: todavía puede mencionar IA, revendedores, BCV u otras capacidades no completas. La página de planes ya se limitó a funciones actuales, pero falta una revisión integral del sitio.

Parte de estos pendientes procede de la auditoría aportada y no se reprobó individualmente durante esta intervención. Se señalan como trabajo pendiente de corrección o validación, sin afirmar que todos se reprodujeron de nuevo.

## 10. Despliegue al VPS: lo preparado y lo que falta

Ya existe configuración de producción con secretos externos, herramientas desactivadas por defecto, puertos de loopback, espera de BD saludable y arranque con migraciones/optimización. La guía está en `DESPLIEGUE-VPS.md`.

Antes del despliegue deben completarse las correcciones prioritarias, definir dominio y proxy HTTPS, generar o transferir secretos por un canal seguro, configurar SMTP y validar entrega real. En una BD existente se debe respaldar y rotar contraseñas en MariaDB, no solo editar el archivo de entorno. También se debe revisar el impacto de cambiar APP_KEY sobre datos cifrados y revocar sesiones/tokens según corresponda.

Faltan un ensayo de respaldo/restauración, pruebas de concurrencia, revisión de producción sin datos demo, proceso de cobro validado y una prueba completa desde el dominio final. No hay despliegue remoto, certificado TLS ni cobro real realizado en esta conversación.

## 11. Orden de trabajo recomendado

1. Cerrar stock, blog, sanitización, throttles, sesiones y dependencias.
2. Mejorar carrito y checkout usando Natan como referencia, manteniendo aislamiento por tienda.
3. Completar cobro y operación de suscripciones, avisos y vista administrativa.
4. Hacer revisión móvil, accesibilidad, paginación y rendimiento.
5. Revisar el diff completo, separar los commits por módulo y proteger el trabajo en Git.
6. Preparar un entorno de ensayo en VPS, validar respaldo, HTTPS, correo, pagos y recuperación.
7. Abrir producción cuando esos flujos estén verificados; definir después los planes superiores con funciones y precios concretos.

## 12. Documentación y evidencia disponibles

- `REPORTE-COMPLETO-2026-10-30.md`: este informe consolidado.
- `DOCKER-LOCAL.md`: accesos, recorrido, comandos y datos de demostración.
- `MODELO-NEGOCIO.md`: reglas de suscripción y análisis de Natan.
- `DESPLIEGUE-VPS.md`: correcciones críticas y preparación de producción.
- `artifacts/docker-local-panel.png`: captura del panel local.
- `artifacts/plan-7-dias-5-usd.png`: captura del nuevo plan.

Los archivos de entorno reales y los artefactos están excluidos de Git. Se conservaron los cambios anteriores del usuario y el proyecto Natan.

## 13. Actualización: correcciones de prioridad 1 (30/10/2026)

Se trabajó sobre el mismo árbol de trabajo, conservando los cambios anteriores y sin commits nuevos. Antes de migrar el entorno local se respaldó la BD en `artifacts/db-backup-antes-prioridad1-2026-10-30.sql`.

| Pendiente | Corrección aplicada | Verificación |
| --- | --- | --- |
| Inventario y transiciones | `orders.stock_applied_at` registra si el pedido descontó stock. Al completarse, el pedido se descuenta una sola vez, con el pedido y los productos bloqueados en la transacción. Pasar a pendiente o cancelado repone las unidades. Si falta stock, el sistema rechaza la operación sin cambios parciales y explica el motivo. Los productos borrados se omiten. Los pedidos completados existentes se marcaron como ya descontados. | 5 pruebas PHP; en Docker, el ciclo completed → pending → completed → completed con la Laptop Gamer: 6 → 7 → 6 → 6. |
| Editor del blog | React Quill se sustituyó por un componente propio sobre Quill 2, compatible con React 19. Las imágenes se insertan por URL http/https, sin base64. Se retiró el vídeo incrustado. El editor se carga de forma diferida. | Navegador: creación de borrador con negrita y lista, guardado y recarga en edición; una sola barra de herramientas. |
| HTML del blog | Lista de etiquetas permitidas con `symfony/html-sanitizer` en cada escritura del modelo. Una migración saneó los posts existentes. La vista pública vuelve a sanear con DOMPurify. La imagen destacada exige http/https. | 4 pruebas de XSS: scripts, eventos, `javascript:`, iframes, SVG, estilos y `data:`. En Docker, guardado saneado y rechazo de `javascript:`. |
| Límites de solicitudes | Throttles con respuesta 429 en español para login (5/min por correo e IP), registro (3/min y 10/h por IP), recuperación de contraseña, verificación, catálogo público, carritos (60/min), checkout (10/min) y panel (300/min por usuario). Proxies de confianza limitados a redes privadas para usar la IP real. | 3 pruebas, incluida la falsificación de `X-Forwarded-For`. En Docker, el sexto login fallido devuelve 429. |
| Dependencias | Laravel 13.12 → 13.39, que corrige el aviso crítico de TokenGuard, y actualización de Guzzle, CommonMark, Flysystem y Symfony. En el frontend, `npm audit fix`, override de `postcss-selector-parser` y retirada de react-quill. | `composer audit`: sin avisos. `npm audit`: 1 aviso bajo de Quill 2.0.3 en `getSemanticHTML`. Ese HTML se sanea en el servidor y en el navegador; 2.0.2 no tiene el aviso, pero arrastra un fallo de espacios. |
| Sesiones | Los tokens caducan a los 7 días (`SANCTUM_EXPIRATION`). Los vencidos se eliminan al iniciar sesión. Cambiar estado, rol, correo o contraseña revoca todos los tokens del usuario, igual que borrarlo. El frontend vuelve al login al recibir 401 y avisa que la sesión expiró. | 2 pruebas; en Docker, el token revocado devuelve 401. |
| Abuso de la prueba | El registro envía un correo de confirmación. El catálogo, el checkout y los carritos de una tienda autorregistrada quedan sin publicar hasta confirmarlo. El enlace firmado vence en 24 horas, el reenvío está limitado y el panel muestra un aviso. Las cuentas creadas por el personal y las ya existentes se consideran confirmadas. `verify-email` quedó como enlace reservado. | 3 pruebas; en Docker se completó registro → correo en Mailpit → página de confirmación → catálogo publicado. |
| HTTPS y cabeceras | El frontend envía CSP (`script-src 'self'`), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` y COOP, además de HSTS cuando el proxy indica HTTPS. `index.html` usa `no-cache`. La API envía una CSP restrictiva y oculta `X-Powered-By`. La guía del VPS incluye el ejemplo de Caddy. | Cabeceras comprobadas con curl. Catálogo y panel sin violaciones de CSP en el navegador. |

### Pruebas de esta actualización

- Suite PHP: **42 pruebas, 297 aserciones aprobadas**; antes eran 25 pruebas y 125 aserciones.
- Build React aprobado. El bundle principal bajó de unos 864 kB a 671 kB y el editor quedó en un chunk de 206 kB.
- ESLint aprobado en los archivos modificados; queda un aviso preexistente de fast-refresh en `AuthContext.jsx`.
- Imágenes reconstruidas en Docker Desktop y tres migraciones nuevas aplicadas sobre MariaDB.
- Los datos de prueba creados en Docker (tienda, usuario y posts) se eliminaron. La venta demo conserva su estado; su `completed_at` ahora corresponde a la última vez que se completó.

### Lo que sigue pendiente

- Rotar credenciales y revisar cuentas demo **en el VPS**, configurar el proxy TLS real y validar SMTP externo, incluidos los correos de confirmación.
- Cobro real de la suscripción.
- Decidir si un pedido pendiente debe reservar stock. Hoy solo se descuenta al completarse.
- Los tokens siguen en `localStorage`, protegidos por CSP, saneamiento y caducidad. Migrar a cookies httpOnly (Sanctum SPA) es una mejora opcional.
- Lint completo del frontend y pruebas de concurrencia real de inventario sobre MariaDB.
