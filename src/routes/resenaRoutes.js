const express = require('express')
const router = express.Router();

const resenaController = require('../controllers/resenaController');

router.get('/getResenas', resenaController.getResenas)
router.get('/getResenaById/:id', resenaController.getResenaById)
router.post('/postResena', resenaController.postResena)
router.put('/putResena/:id', resenaController.putResena)
router.delete('/deleteResena/:id', resenaController.deleteResena)

module.exports = router;
