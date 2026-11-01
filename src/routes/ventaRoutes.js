const express = require('express')
const router = express.Router();

const ventaController = require('../controllers/ventaController');

router.get('/getVentas', ventaController.getVentas)
router.get('/getVentaById/:id', ventaController.getVentaById)
router.post('/postVenta', ventaController.postVenta)
router.put('/putEstadoVenta/:id', ventaController.putEstadoVenta)

module.exports = router;
