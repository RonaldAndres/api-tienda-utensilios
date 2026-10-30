const express = require('express')
const router = express.Router();

const clienteController = require('../controllers/clienteController');

router.get('/getClientes', clienteController.getClientes)
router.get('/getClienteById/:id', clienteController.getClienteById)
router.post('/postCliente', clienteController.postCliente)
router.put('/putCliente/:id', clienteController.putCliente)
router.delete('/deleteCliente/:id', clienteController.deleteCliente)

module.exports = router;
