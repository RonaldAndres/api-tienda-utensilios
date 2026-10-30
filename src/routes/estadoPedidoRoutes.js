const express = require('express')
const router = express.Router();

const estadoPedidoController = require('../controllers/estadoPedidoController');

router.get('/getEstadosPedido', estadoPedidoController.getEstadosPedido)
router.get('/getEstadoPedidoById/:id', estadoPedidoController.getEstadoPedidoById)
router.post('/postEstadoPedido', estadoPedidoController.postEstadoPedido)
router.put('/putEstadoPedido/:id', estadoPedidoController.putEstadoPedido)
router.delete('/deleteEstadoPedido/:id', estadoPedidoController.deleteEstadoPedido)

module.exports = router;
