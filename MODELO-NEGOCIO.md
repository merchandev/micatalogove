# Modelo de suscripción y referencia Natan

Fecha: 30/10/2026.

## Decisiones confirmadas

- Un único plan inicial de **USD 5 al mes**.
- Prueba gratuita de **7 días** con las funciones actuales del catálogo.
- Los planes superiores y su distribución de funciones se definirán después.

La configuración canónica está en `api-micatalogo/config/plans.php`. La página pública consulta `/api/plans`; ya no anuncia un plan gratuito permanente ni precios de USD 3,99 o USD 9,99. El registro y la portada indican la duración de la prueba y la mensualidad.

## Funcionamiento implementado

Al registrar una tienda, el servidor fija el final de su prueba. Modificar su nombre, dominio o diseño no reinicia el período. Las tiendas existentes reciben siete días desde la aplicación de la migración, para evitar un vencimiento retroactivo al instalar esta versión.

Cuando no queda prueba ni mensualidad vigente, el servidor bloquea el catálogo público, sus productos, el checkout y el registro de carritos. El propietario conserva acceso de consulta al panel y a la renovación; los cambios de productos, pedidos, tienda y conversaciones quedan bloqueados. Vencer no elimina datos. La suspensión administrativa de una cuenta o tienda continúa siendo independiente y no se resuelve pagando.

La página **Suscripción** del cliente muestra el plan, las fechas, el tiempo restante y los reportes de mensualidades. El superadmin dispone de **Suscripciones** para revisar los reportes. El cliente no puede aprobarse un pago ni indicar un importe inferior; los administradores ordinarios tampoco pueden activar mensualidades.

El método de cobro definitivo sigue pendiente de elección. Para la demostración local se implementó provisionalmente **reporte de referencia y aprobación manual por superadmin**. El formulario no ejecuta cobros, no verifica bancos y no inventa datos de pago. Antes de un uso real deben definirse el método, los datos del beneficiario, el canal de soporte y los comprobantes necesarios. El importe registrado es el precio del plan en USD; no es una integración bancaria ni un comprobante fiscal.

Un reporte pendiente no modifica la vigencia. Al aprobarlo se añade un mes calendario desde la fecha mayor entre hoy, el final de la prueba y el final pagado. Se conserva el tiempo restante si se paga antes. En meses cortos se ajusta al último día válido. La aprobación usa transacción y bloqueo de filas; repetir la misma aprobación no suma meses. Cada referencia es única por tienda y solo se admite un reporte pendiente a la vez.

## Funciones incluidas en el plan actual

- Catálogo público y fichas de productos.
- Inventario y alertas de existencias.
- Carrito y pedidos por WhatsApp.
- Conversaciones y seguimiento de carritos.
- Panel de ventas.
- Cinco diseños de tienda y códigos QR.

No se han agregado límites arbitrarios de productos. Los roles de plataforma y las funciones del plan son conceptos distintos: el blog global y la administración de usuarios siguen siendo herramientas de plataforma. Esta versión tiene un solo plan, por lo que la configuración actual es una base para agregar planes; todavía no constituye un motor de cuotas o permisos diferentes por plan.

## Qué aporta Natan Electronics

Se confirmó acceso al repositorio privado `merchandev/natan-electronics` y se revisó su copia local en `E:\09 - PROYECTO SEPTIEMBRE 2026\NATAN\natan-electronics`. No se modificó ese proyecto. Su frontend HTML/JavaScript y backend Node/Supabase necesitan adaptación a React/Laravel y al aislamiento por tienda de MiCatálogo.

| Referencia revisada | Aplicación propuesta en MiCatálogo | Estado |
| --- | --- | --- |
| `api/pedidos/crear.js` | Precio y disponibilidad del servidor, cantidades agrupadas, errores recuperables, número de pedido legible y límites de solicitudes. | MiCatálogo ya calcula precios y valida stock; faltan mejorar identificación y UX del checkout y aplicar límites. |
| `diseno/carrito.html` | Carrito lateral con filas claras, resumen, estado vacío y acciones diferenciadas. | Referencia revisada; rediseño pendiente. |
| `diseno/funciones.js`, funciones de bolsa compartida | Compartir IDs y cantidades, mostrar vista previa, resolver precios actuales y exigir confirmación al importar. | Referencia revisada; adaptación pendiente. Cada enlace deberá incluir la tienda. |
| `tests/carrito-compartido.test.js` | Validación de enlaces, productos retirados y alternativa cuando el portapapeles falla. | Sus cuatro pruebas pasan en Natan; todavía no son funciones implementadas en MiCatálogo. |
| `diseno/movil.css` y `diseno/README.md` | Diseño móvil, controles táctiles y campos legibles. | Criterios identificados para la siguiente revisión de las cinco plantillas. |
| Flujo de pedidos y pagos de Natan | Separar pedido, comprobación de pago y cumplimiento; no tratar un reporte como dinero recibido. | Principio aplicado a la suscripción; no se trasladaron credenciales ni integraciones BNC/D3xD. |

## Siguiente iteración propuesta

1. Unificar el carrito de las cinco plantillas con persistencia por tienda, límites de stock visibles y errores claros al confirmar.
2. Adaptar el enlace de carrito compartido de Natan, con vista previa y precios actuales, sin datos personales en el enlace.
3. Mejorar checkout, datos de entrega, identificación de pedidos y seguimiento, manteniendo el precio del servidor.
4. Corregir transiciones de inventario, editor del blog, sanitización y límites de solicitudes pendientes de la auditoría.
5. Definir cobro real, comprobantes, soporte y recordatorios de vencimiento. La elección del proveedor se hará antes de conectar servicios externos.
6. Solo entonces definir planes superiores con funciones, cuotas y precios explícitos, y aplicarlos tanto en la API como en la interfaz.

## Pruebas

`SubscriptionTest` verifica precio público, prueba de siete días, intentos de alterar fechas por registro, vencimiento exacto, todos los accesos públicos, consulta y renovación tras vencer, permisos de aprobación, importe del servidor, referencias repetidas, aprobación idempotente, renovación adelantada, ajuste de fin de mes, separación entre tiendas y suspensión administrativa.

Resultado: 25 pruebas PHP aprobadas, 125 aserciones, formato PHP aprobado, build React aprobado y ESLint aprobado para las tres pantallas/componentes nuevos. `node scripts/smoke-subscriptions.mjs` también pasó contra Docker/MariaDB: creó una tienda temporal, comprobó vencimiento, restricciones, reporte y aprobación, reactivación e idempotencia. Después eliminó exclusivamente su tienda y cuenta sintéticas. Arturo Store conservó sus datos y su prueba de siete días. Se verificaron en el navegador la página de planes y la gestión de suscripciones del superadmin.
