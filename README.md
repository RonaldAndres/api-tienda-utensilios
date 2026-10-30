# API REST - Tienda de utensilios de cocina

API hecha con Node.js, Express y MySQL (esquema del profesor: rutas, controladores y modelos).
Tiene un CRUD completo para cada una de las 9 tablas de la base de datos `tienda_utensilios`.

## Instalación

```
npm init -y
npm i express mysql
npm i body-parser
```

(Si ya existe `package.json`, basta con `npm install`.)

## Variables de entorno

| Variable | Descripción | Valor local por defecto |
|---|---|---|
| DB_HOST | Servidor MySQL | localhost |
| DB_USER | Usuario MySQL | root |
| DB_PASSWORD | Contraseña MySQL | (vacía) |
| DB_NAME | Nombre de la base de datos | tienda_utensilios |
| DB_PORT | Puerto MySQL | 3306 |
| PORT | Puerto donde corre la API | 3000 |

Las credenciales reales de la nube NO están en el código: se configuran como variables de entorno en el servicio donde se despliega la API.

## Ejecución

```
node index.js
```

La API queda en `http://localhost:3000`. Ejemplo: `http://localhost:3000/api/productos/getProductos`

### Opciones para ejecutarla

**API pública (no requiere instalar nada):** `https://PEGAR-AQUI-LA-URL-DE-RENDER.onrender.com/api/productos/getProductos`

**Local, con la base de datos en la nube:** en la carpeta del proyecto, `npm install` (la primera vez) y `node index.js`.
El archivo `.env` incluido en el comprimido de entrega ya trae los datos de conexión a Clever Cloud; Node lo lee solo.
Luego abrir `http://localhost:3000/api/productos/getProductos`.
(Requiere Node.js 20.12 o superior. El `.env` no se sube a GitHub: está en `.gitignore`.)

**Local con una base MySQL propia (XAMPP):** borrar el archivo `.env`, importar `tienda_utensilios.sql` en phpMyAdmin y ejecutar `node index.js`.

## Respuestas

- Siempre en JSON.
- Lecturas: `200` con `{"data": [...]}`.
- Creación: `201` con `{"message": "...", "data": {"id": 1}}`.
- Actualización y eliminación: `200` con `{"message": "..."}`.
- `400` datos inválidos o faltantes, `404` recurso no encontrado, `409` llave única duplicada o llave foránea (inexistente o en uso), `500` error del servidor.

## Endpoints

### categorias  (base: `/api/categorias`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/categorias/getCategorias` | Lista todos los registros |
| GET | `/api/categorias/getCategoriaById/:id` | Consulta un registro por id |
| POST | `/api/categorias/postCategoria` | Crea un registro. Body: nombre, descripcion |
| PUT | `/api/categorias/putCategoria/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/categorias/deleteCategoria/:id` | Elimina un registro |

### marcas  (base: `/api/marcas`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/marcas/getMarcas` | Lista todos los registros |
| GET | `/api/marcas/getMarcaById/:id` | Consulta un registro por id |
| POST | `/api/marcas/postMarca` | Crea un registro. Body: nombre, pais_origen |
| PUT | `/api/marcas/putMarca/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/marcas/deleteMarca/:id` | Elimina un registro |

### estados_pedido  (base: `/api/estados_pedido`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/estados_pedido/getEstadosPedido` | Lista todos los registros |
| GET | `/api/estados_pedido/getEstadoPedidoById/:id` | Consulta un registro por id |
| POST | `/api/estados_pedido/postEstadoPedido` | Crea un registro. Body: nombre, descripcion |
| PUT | `/api/estados_pedido/putEstadoPedido/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/estados_pedido/deleteEstadoPedido/:id` | Elimina un registro |

### metodos_pago  (base: `/api/metodos_pago`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/metodos_pago/getMetodosPago` | Lista todos los registros |
| GET | `/api/metodos_pago/getMetodoPagoById/:id` | Consulta un registro por id |
| POST | `/api/metodos_pago/postMetodoPago` | Crea un registro. Body: nombre, descripcion |
| PUT | `/api/metodos_pago/putMetodoPago/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/metodos_pago/deleteMetodoPago/:id` | Elimina un registro |

### clientes  (base: `/api/clientes`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/clientes/getClientes` | Lista todos los registros |
| GET | `/api/clientes/getClienteById/:id` | Consulta un registro por id |
| POST | `/api/clientes/postCliente` | Crea un registro. Body: documento, nombre, apellido, correo, telefono, direccion, ciudad |
| PUT | `/api/clientes/putCliente/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/clientes/deleteCliente/:id` | Elimina un registro |

### productos  (base: `/api/productos`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/productos/getProductos` | Lista todos los registros |
| GET | `/api/productos/getProductoById/:id` | Consulta un registro por id |
| POST | `/api/productos/postProducto` | Crea un registro. Body: codigo, nombre, descripcion, precio, stock, id_categoria, id_marca |
| PUT | `/api/productos/putProducto/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/productos/deleteProducto/:id` | Elimina un registro |

### pedidos  (base: `/api/pedidos`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/pedidos/getPedidos` | Lista todos los registros |
| GET | `/api/pedidos/getPedidoById/:id` | Consulta un registro por id |
| POST | `/api/pedidos/postPedido` | Crea un registro. Body: fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado |
| PUT | `/api/pedidos/putPedido/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/pedidos/deletePedido/:id` | Elimina un registro |

### detalle_pedidos  (base: `/api/detalle_pedidos`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/detalle_pedidos/getDetallePedidos` | Lista todos los registros |
| GET | `/api/detalle_pedidos/getDetallePedidoById/:id` | Consulta un registro por id |
| POST | `/api/detalle_pedidos/postDetallePedido` | Crea un registro. Body: id_pedido, id_producto, cantidad, precio_unitario |
| PUT | `/api/detalle_pedidos/putDetallePedido/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/detalle_pedidos/deleteDetallePedido/:id` | Elimina un registro |

### resenas  (base: `/api/resenas`)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/resenas/getResenas` | Lista todos los registros |
| GET | `/api/resenas/getResenaById/:id` | Consulta un registro por id |
| POST | `/api/resenas/postResena` | Crea un registro. Body: id_cliente, id_producto, calificacion, comentario, fecha_resena |
| PUT | `/api/resenas/putResena/:id` | Actualiza un registro (se envían todos los campos) |
| DELETE | `/api/resenas/deleteResena/:id` | Elimina un registro |

