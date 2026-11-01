# API REST - Tienda de utensilios de cocina

API hecha con Node.js, Express y MySQL, con la estructura del profesor (rutas, controladores y modelos). Tiene un CRUD completo (crear, leer, actualizar y eliminar) para cada una de las 9 tablas de la base de datos `tienda_utensilios`, alojada en la nube.

- **URL pública de la API:** https://api-tienda-utensilios.onrender.com
- **Repositorio:** https://github.com/RonaldAndres/api-tienda-utensilios

## Instalación

```
npm init -y
npm i express mysql
npm i body-parser
```

Si el proyecto ya trae `package.json`, basta con `npm install`.

## Variables de entorno

| Variable | Descripción | Valor local por defecto |
|---|---|---|
| DB_HOST | Servidor MySQL | localhost |
| DB_USER | Usuario MySQL | root |
| DB_PASSWORD | Contraseña MySQL | (vacía) |
| DB_NAME | Nombre de la base de datos | tienda_utensilios |
| DB_PORT | Puerto MySQL | 3306 |
| PORT | Puerto donde corre la API | 3000 |
| ADMIN_KEY | Clave de administrador (opcional) | (sin clave) |

Las credenciales reales no están en el código ni en este archivo: se configuran como variables de entorno en el servicio de despliegue (Render) y, para ejecutar en local, en el archivo `.env` del comprimido de entrega.

## Ejecución

```
node index.js
```

- **En local:** abrir `http://localhost:3000`.
- **En internet:** abrir https://api-tienda-utensilios.onrender.com (la primera petición puede tardar cerca de un minuto, porque el servicio gratuito se suspende cuando no se usa).

La ruta inicial `GET /` muestra el estado de la API y los enlaces de lectura de cada tabla, de la tienda (`/tienda`) y del panel de administración (`/admin`).

## Cómo funcionan las rutas

Una ruta es la dirección a la que se envía una petición para hacer una operación sobre una tabla. Se arma así:

```
dirección de la API  +  /api/<tabla>  +  /<nombre de la operación>  [ + /id ]

Ejemplo:  https://api-tienda-utensilios.onrender.com/api/pedidos/getPedidoById/3
```

- `/api/<tabla>` indica sobre qué tabla se trabaja (por ejemplo `/api/pedidos`).
- El nombre de la operación indica qué se hace: `get` para consultar, `post` para crear, `put` para actualizar y `delete` para eliminar.
- `:id` es el número del registro y se escribe en la propia dirección (por ejemplo `/3`).
- En `POST` y `PUT` los datos se envían en el body, en formato JSON, con el encabezado `Content-Type: application/json`. En `PUT` se envían todos los campos del registro.

Todas las tablas usan las mismas 5 rutas:

| Método HTTP | Ruta | Operación del CRUD | Qué hace |
|---|---|---|---|
| GET | `/get<Tablas>` | READ (lista) | Devuelve todos los registros. |
| GET | `/get<Tabla>ById/:id` | READ (uno) | Devuelve el registro con ese id. |
| POST | `/post<Tabla>` | CREATE | Crea un registro nuevo. |
| PUT | `/put<Tabla>/:id` | UPDATE | Modifica el registro con ese id. |
| DELETE | `/delete<Tabla>/:id` | DELETE | Elimina el registro con ese id. |

Todas las respuestas son JSON:

| Código | Cuándo ocurre | Respuesta |
|---|---|---|
| 200 | Lectura, actualización o eliminación correctas | `{"data": [...]}` o `{"message": "..."}` |
| 201 | Registro creado | `{"message": "...", "data": {"id": 11}}` |
| 400 | Faltan campos obligatorios o hay datos inválidos | `{"message": "..."}` |
| 404 | El id o la ruta no existen | `{"message": "..."}` |
| 409 | Valor único repetido o llave foránea inválida o en uso | `{"message": "..."}` |
| 500 | Error del servidor o de la base de datos | `{"error": "..."}` |

## Tienda y panel de administración

Además del CRUD de las 9 tablas, el proyecto incluye una tienda funcional que usa la misma API:

| Dirección | Qué es |
|---|---|
| `/tienda` | Tienda: catálogo con búsqueda y categorías, carrito y compra |
| `/admin` | Panel de administración: productos (agregar, editar, eliminar), pedidos (cambiar estado) y clientes |

Rutas de ventas (`/api/ventas`):

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/ventas/getVentas` | Lista los pedidos con cliente, estado, método de pago y total. |
| GET | `/api/ventas/getVentaById/:id` | Devuelve un pedido con sus productos. |
| POST | `/api/ventas/postVenta` | Registra una compra completa: busca o crea el cliente, crea el pedido, guarda el detalle con el precio vigente y descuenta el stock, todo en una transacción. Body: `cliente` (documento, nombre, apellido, correo, telefono, direccion, ciudad), `id_metodo_pago` e `items` (lista de `id_producto` y `cantidad`). Responde 409 si no hay stock suficiente. |
| PUT | `/api/ventas/putEstadoVenta/:id` | Cambia el estado de un pedido. Body: `id_estado`. Si se cancela, devuelve el stock. |

Variable opcional `ADMIN_KEY`: si está definida, crear, editar o eliminar registros y ver clientes, pedidos y ventas exige el encabezado `x-admin-key` con esa clave. El catálogo y la compra desde la tienda siguen siendo públicos.

La tabla `productos` tiene una columna opcional `imagen` (URL de la foto del producto).

## Listado de endpoints

### categorias

Clasifica los utensilios (ollas, sartenes, cuchillos, etc.).

**Campos del body (POST y PUT):** `nombre` (obligatorio), `descripcion`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/categorias/getCategorias` | Devuelve la lista de categorías. | No |
| GET | `/api/categorias/getCategoriaById/:id` | Devuelve la categoría con el id indicado. | No |
| POST | `/api/categorias/postCategoria` | Crea la categoría nuevo con los datos enviados. | Sí |
| PUT | `/api/categorias/putCategoria/:id` | Actualiza la categoría con el id indicado. | Sí |
| DELETE | `/api/categorias/deleteCategoria/:id` | Elimina la categoría con el id indicado. | No |

### marcas

Fabricantes de los productos (IMUSA, Oster, Tramontina, etc.).

**Campos del body (POST y PUT):** `nombre` (obligatorio), `pais_origen`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/marcas/getMarcas` | Devuelve la lista de marcas. | No |
| GET | `/api/marcas/getMarcaById/:id` | Devuelve la marca con el id indicado. | No |
| POST | `/api/marcas/postMarca` | Crea la marca nuevo con los datos enviados. | Sí |
| PUT | `/api/marcas/putMarca/:id` | Actualiza la marca con el id indicado. | Sí |
| DELETE | `/api/marcas/deleteMarca/:id` | Elimina la marca con el id indicado. | No |

### estados_pedido

Estados por los que pasa un pedido (Pendiente, Enviado, Entregado, etc.).

**Campos del body (POST y PUT):** `nombre` (obligatorio), `descripcion`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/estados_pedido/getEstadosPedido` | Devuelve la lista de estados de pedido. | No |
| GET | `/api/estados_pedido/getEstadoPedidoById/:id` | Devuelve el estado de pedido con el id indicado. | No |
| POST | `/api/estados_pedido/postEstadoPedido` | Crea el estado de pedido nuevo con los datos enviados. | Sí |
| PUT | `/api/estados_pedido/putEstadoPedido/:id` | Actualiza el estado de pedido con el id indicado. | Sí |
| DELETE | `/api/estados_pedido/deleteEstadoPedido/:id` | Elimina el estado de pedido con el id indicado. | No |

### metodos_pago

Formas de pago que el cliente elige en un pedido.

**Campos del body (POST y PUT):** `nombre` (obligatorio), `descripcion`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/metodos_pago/getMetodosPago` | Devuelve la lista de métodos de pago. | No |
| GET | `/api/metodos_pago/getMetodoPagoById/:id` | Devuelve el método de pago con el id indicado. | No |
| POST | `/api/metodos_pago/postMetodoPago` | Crea el método de pago nuevo con los datos enviados. | Sí |
| PUT | `/api/metodos_pago/putMetodoPago/:id` | Actualiza el método de pago con el id indicado. | Sí |
| DELETE | `/api/metodos_pago/deleteMetodoPago/:id` | Elimina el método de pago con el id indicado. | No |

### clientes

Personas que compran en la tienda.

**Campos del body (POST y PUT):** `documento`, `nombre`, `apellido`, `correo` (obligatorios); `telefono`, `direccion`, `ciudad`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/clientes/getClientes` | Devuelve la lista de clientes. | No |
| GET | `/api/clientes/getClienteById/:id` | Devuelve el cliente con el id indicado. | No |
| POST | `/api/clientes/postCliente` | Crea el cliente nuevo con los datos enviados. | Sí |
| PUT | `/api/clientes/putCliente/:id` | Actualiza el cliente con el id indicado. | Sí |
| DELETE | `/api/clientes/deleteCliente/:id` | Elimina el cliente con el id indicado. | No |

### productos

Utensilios a la venta; cada uno pertenece a una categoría y a una marca. La lista y la consulta por id también devuelven el nombre de la categoría y de la marca.

**Campos del body (POST y PUT):** `codigo`, `nombre`, `precio`, `stock`, `id_categoria`, `id_marca` (obligatorios); `descripcion`, `imagen`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/productos/getProductos` | Devuelve la lista de productos. | No |
| GET | `/api/productos/getProductoById/:id` | Devuelve el producto con el id indicado. | No |
| POST | `/api/productos/postProducto` | Crea el producto nuevo con los datos enviados. | Sí |
| PUT | `/api/productos/putProducto/:id` | Actualiza el producto con el id indicado. | Sí |
| DELETE | `/api/productos/deleteProducto/:id` | Elimina el producto con el id indicado. | No |

### pedidos

Compras realizadas por los clientes.

**Campos del body (POST y PUT):** `fecha_pedido` (AAAA-MM-DD), `direccion_envio`, `id_cliente`, `id_metodo_pago`, `id_estado` (todos obligatorios).

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/pedidos/getPedidos` | Devuelve la lista de pedidos. | No |
| GET | `/api/pedidos/getPedidoById/:id` | Devuelve el pedido con el id indicado. | No |
| POST | `/api/pedidos/postPedido` | Crea el pedido nuevo con los datos enviados. | Sí |
| PUT | `/api/pedidos/putPedido/:id` | Actualiza el pedido con el id indicado. | Sí |
| DELETE | `/api/pedidos/deletePedido/:id` | Elimina el pedido con el id indicado. | No |

### detalle_pedidos

Productos y cantidades de cada pedido, con el precio al momento de la venta.

**Campos del body (POST y PUT):** `id_pedido`, `id_producto`, `cantidad`, `precio_unitario` (todos obligatorios).

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/detalle_pedidos/getDetallePedidos` | Devuelve la lista de líneas de pedido. | No |
| GET | `/api/detalle_pedidos/getDetallePedidoById/:id` | Devuelve la línea de pedido con el id indicado. | No |
| POST | `/api/detalle_pedidos/postDetallePedido` | Crea la línea de pedido nuevo con los datos enviados. | Sí |
| PUT | `/api/detalle_pedidos/putDetallePedido/:id` | Actualiza la línea de pedido con el id indicado. | Sí |
| DELETE | `/api/detalle_pedidos/deleteDetallePedido/:id` | Elimina la línea de pedido con el id indicado. | No |

### resenas

Calificación y comentario de un cliente sobre un producto.

**Campos del body (POST y PUT):** `id_cliente`, `id_producto`, `calificacion` (1 a 5), `fecha_resena` (AAAA-MM-DD) obligatorios; `comentario`.

| Método | Ruta | Qué hace | Body JSON |
|---|---|---|---|
| GET | `/api/resenas/getResenas` | Devuelve la lista de reseñas. | No |
| GET | `/api/resenas/getResenaById/:id` | Devuelve la reseña con el id indicado. | No |
| POST | `/api/resenas/postResena` | Crea la reseña nuevo con los datos enviados. | Sí |
| PUT | `/api/resenas/putResena/:id` | Actualiza la reseña con el id indicado. | Sí |
| DELETE | `/api/resenas/deleteResena/:id` | Elimina la reseña con el id indicado. | No |