const estadoPedidoModel = require('../models/estadoPedidoModel')
// se realiza llamado al modelo

const vacio = (valor)=>{
    return valor === undefined || valor === null || valor === '';
};

// errores de MySQL: llave unica, llave foranea y registro referenciado
const manejarError = (err, res)=>{
    if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).json({message: 'Ya existe un registro con ese valor único'});
        return;
    }
    if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        res.status(409).json({message: 'La llave foránea indicada no existe'});
        return;
    }
    if(err.code === 'ER_ROW_IS_REFERENCED_2'){
        res.status(409).json({message: 'No se puede modificar o eliminar: el registro está siendo usado por otra tabla'});
        return;
    }
    res.status(500).json({error: err.message});
};

// validacion de los datos de entrada
const validar = (body)=>{
    if(vacio(body.nombre)){
        return 'El campo nombre es obligatorio';
    }
    return null;
};

module.exports = {

    getEstadosPedido: (req, res)=>{
        estadoPedidoModel.getEstadosPedido((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getEstadoPedidoById: (req, res)=>{
        const {id} = req.params;
        estadoPedidoModel.getEstadoPedidoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Estado de pedido no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postEstadoPedido: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, descripcion} = body;
        estadoPedidoModel.postEstadoPedido(nombre, descripcion, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Estado de pedido creado', data: {id: id}});
        });
    },

    putEstadoPedido: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, descripcion} = body;
        estadoPedidoModel.putEstadoPedido(id, nombre, descripcion, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Estado de pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Estado de pedido actualizado'});
        });
    },

    deleteEstadoPedido: (req, res)=>{
        const {id} = req.params;
        estadoPedidoModel.deleteEstadoPedido(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Estado de pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Estado de pedido eliminado'});
        });
    }
}
