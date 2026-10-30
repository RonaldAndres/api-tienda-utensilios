const express = require('express')
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

router.get('/getCategorias', categoriaController.getCategorias)
router.get('/getCategoriaById/:id', categoriaController.getCategoriaById)
router.post('/postCategoria', categoriaController.postCategoria)
router.put('/putCategoria/:id', categoriaController.putCategoria)
router.delete('/deleteCategoria/:id', categoriaController.deleteCategoria)

module.exports = router;
