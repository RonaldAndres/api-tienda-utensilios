const express = require('express')
const router = express.Router();

const metodoPagoController = require('../controllers/metodoPagoController');

router.get('/getMetodosPago', metodoPagoController.getMetodosPago)
router.get('/getMetodoPagoById/:id', metodoPagoController.getMetodoPagoById)
router.post('/postMetodoPago', metodoPagoController.postMetodoPago)
router.put('/putMetodoPago/:id', metodoPagoController.putMetodoPago)
router.delete('/deleteMetodoPago/:id', metodoPagoController.deleteMetodoPago)

module.exports = router;
