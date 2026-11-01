const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const marcaRoutes = require('./src/routes/marcaRoutes');
const estadoPedidoRoutes = require('./src/routes/estadoPedidoRoutes');
const metodoPagoRoutes = require('./src/routes/metodoPagoRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');
const resenaRoutes = require('./src/routes/resenaRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// clave de administrador (opcional). Si la variable ADMIN_KEY existe, solo se puede
// crear, editar o borrar, y ver clientes, pedidos y ventas, enviando el encabezado x-admin-key.
// La lectura del catalogo y la compra desde la tienda siguen siendo publicas.
app.use('/api', (req, res, next)=>{
    const clave = process.env.ADMIN_KEY;
    if(!clave){
        return next();
    }
    const privadas = ['/clientes', '/pedidos', '/detalle_pedidos', '/ventas'];
    const esPrivada = privadas.some((p)=> req.path.startsWith(p));
    const esCompra = req.method === 'POST' && req.path === '/ventas/postVenta';
    if(esCompra || (req.method === 'GET' && !esPrivada)){
        return next();
    }
    if(req.headers['admin'] === clave){
        return next();
    }
    res.status(401).json({message: 'No autorizado: falta la clave de administrador'});
});

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
app.use('/api/ventas', ventaRoutes);

// paginas de la tienda y del panel de administracion
app.get('/tienda', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'tienda.html'));
});
app.get('/admin', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// ruta inicial: muestra el estado de la API y los enlaces a cada tabla
app.get('/', (req, res)=>{
    res.status(200).json({
        proyecto: 'Tienda de Utensilios',
        mensaje: 'API funcionando correctamente',
        rutas: {
            categorias: '/api/categorias/getCategorias',
            marcas: '/api/marcas/getMarcas',
            estados_pedido: '/api/estados_pedido/getEstadosPedido',
            metodos_pago: '/api/metodos_pago/getMetodosPago',
            clientes: '/api/clientes/getClientes',
            productos: '/api/productos/getProductos',
            pedidos: '/api/pedidos/getPedidos',
            detalle_pedidos: '/api/detalle_pedidos/getDetallePedidos',
            resenas: '/api/resenas/getResenas',
            tienda: '/tienda',
            admin: '/admin'
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