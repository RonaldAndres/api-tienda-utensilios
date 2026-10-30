const express = require('express')
const router = express.Router();

const productoController = require('../controllers/productoController');

router.get('/getProductos', productoController.getProductos)
router.get('/getProductoById/:id', productoController.getProductoById)
router.post('/postProducto', productoController.postProducto)
router.put('/putProducto/:id', productoController.putProducto)
router.delete('/deleteProducto/:id', productoController.deleteProducto)

module.exports = router;
