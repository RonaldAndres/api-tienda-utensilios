const express = require('express')
const router = express.Router();

const detallePedidoController = require('../controllers/detallePedidoController');

router.get('/getDetallePedidos', detallePedidoController.getDetallePedidos)
router.get('/getDetallePedidoById/:id', detallePedidoController.getDetallePedidoById)
router.post('/postDetallePedido', detallePedidoController.postDetallePedido)
router.put('/putDetallePedido/:id', detallePedidoController.putDetallePedido)
router.delete('/deleteDetallePedido/:id', detallePedidoController.deleteDetallePedido)

module.exports = router;
