# Activación de la tienda dentro del panel

La tienda se publica desde el registro, aunque el propietario todavía no haya confirmado su correo. El plazo para confirmarlo es de **24 horas desde la creación de la cuenta**. El propietario ve el aviso, la fecha límite, el tiempo restante y la opción de reenviar el correo dentro del panel.

Durante esas 24 horas funcionan el catálogo público, las fichas, el carrito y el checkout, siempre que la tienda esté activa y la prueba o suscripción siga vigente. Los visitantes no ven una pantalla de activación en ese período.

Si el plazo termina sin confirmación, el catálogo y sus endpoints públicos quedan pausados. El propietario conserva acceso al panel para gestionar la confirmación; no se eliminan sus productos ni su tienda. Un enlace de confirmación válido puede reactivar la publicación después de vencer el plazo, sujeto a la suscripción y a cualquier suspensión administrativa.

Reenviar el correo, cambiar el diseño o editar la tienda no reinicia el plazo. La confirmación sigue exigiendo un enlace firmado y válido; no se marca ningún correo como verificado automáticamente. La prueba comercial continúa siendo de siete días y la mensualidad de USD 5: el plazo de activación es una regla distinta.

El plazo se calcula en el servidor usando la fecha de registro existente; no es necesario modificar fechas ni hacer una migración de datos. La API entrega `email_activation` solo como parte de los datos de usuario del panel. La interfaz actualiza el estado al recuperar el foco y después de confirmar el correo.

Se añadieron pruebas para publicación inmediata, acceso a productos y checkout, vencimiento exacto a las 24 horas, acceso al panel después del vencimiento, conservación de datos, reactivación con firma válida, reenvío sin reinicio del plazo y respeto de suspensión/suscripción.

La tienda local `merchan` ya existía activa y sin productos al revisar el problema. La corrección permite mostrar su plantilla; los productos deben añadirse desde Inventario.
