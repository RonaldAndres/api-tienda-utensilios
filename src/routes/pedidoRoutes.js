const express = require('express')
const router = express.Router();

const pedidoController = require('../controllers/pedidoController');

router.get('/getPedidos', pedidoController.getPedidos)
router.get('/getPedidoById/:id', pedidoController.getPedidoById)
router.post('/postPedido', pedidoController.postPedido)
router.put('/putPedido/:id', pedidoController.putPedido)
router.delete('/deletePedido/:id', pedidoController.deletePedido)

module.exports = router;
