const express = require('express');
const bodyParser = require('body-parser');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const marcaRoutes = require('./src/routes/marcaRoutes');
const estadoPedidoRoutes = require('./src/routes/estadoPedidoRoutes');
const metodoPagoRoutes = require('./src/routes/metodoPagoRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');
const resenaRoutes = require('./src/routes/resenaRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/estados_pedido', estadoPedidoRoutes);
app.use('/api/metodos_pago', metodoPagoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle_pedidos', detallePedidoRoutes);
app.use('/api/resenas', resenaRoutes);

// ruta inicial: muestra el estado de la API y los enlaces a cada tabla
app.get('/', (req, res)=>{
    res.status(200).json({
        proyecto: 'Tienda de Utensilios',
        mensaje: 'API D correctamente',
        rutas: {
            categorias: '/api/categorias/getCategorias',
            marcas: '/api/marcas/getMarcas',
            estados_pedido: '/api/estados_pedido/getEstadosPedido',
            metodos_pago: '/api/metodos_pago/getMetodosPago',
            clientes: '/api/clientes/getClientes',
            productos: '/api/productos/getProductos',
            pedidos: '/api/pedidos/getPedidos',
            detalle_pedidos: '/api/detalle_pedidos/getDetallePedidos',
            resenas: '/api/resenas/getResenas'
        }
    });
});

// ruta no encontrada (siempre responde JSON)
app.use((req, res)=>{
    res.status(404).json({message: 'Ruta no encontrada'});
});

// errores generales, por ejemplo un JSON mal escrito en el body
app.use((err, req, res, next)=>{
    res.status(400).json({message: 'El cuerpo de la petición no es un JSON válido'});
});

//iniciar el servidor

app.listen(port, ()=>{
    console.log("Servidor iniciado en http://localhost:" + port);
});