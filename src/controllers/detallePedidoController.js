const detallePedidoModel = require('../models/detallePedidoModel')
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
    if(vacio(body.id_pedido)){
        return 'El campo id_pedido es obligatorio';
    }
    if(isNaN(body.id_pedido)){
        return 'El campo id_pedido debe ser numérico';
    }
    if(vacio(body.id_producto)){
        return 'El campo id_producto es obligatorio';
    }
    if(isNaN(body.id_producto)){
        return 'El campo id_producto debe ser numérico';
    }
    if(vacio(body.cantidad)){
        return 'El campo cantidad es obligatorio';
    }
    if(isNaN(body.cantidad) || !Number.isInteger(Number(body.cantidad)) || Number(body.cantidad) <= 0){
        return 'El campo cantidad debe ser un número entero mayor a 0';
    }
    if(vacio(body.precio_unitario)){
        return 'El campo precio_unitario es obligatorio';
    }
    if(isNaN(body.precio_unitario) || Number(body.precio_unitario) <= 0){
        return 'El campo precio_unitario debe ser un número mayor a 0';
    }
    return null;
};

module.exports = {

    getDetallePedidos: (req, res)=>{
        detallePedidoModel.getDetallePedidos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getDetallePedidoById: (req, res)=>{
        const {id} = req.params;
        detallePedidoModel.getDetallePedidoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postDetallePedido: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {id_pedido, id_producto, cantidad, precio_unitario} = body;
        detallePedidoModel.postDetallePedido(id_pedido, id_producto, cantidad, precio_unitario, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Detalle de pedido creado', data: {id: id}});
        });
    },

    putDetallePedido: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {id_pedido, id_producto, cantidad, precio_unitario} = body;
        detallePedidoModel.putDetallePedido(id, id_pedido, id_producto, cantidad, precio_unitario, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Detalle de pedido actualizado'});
        });
    },

    deleteDetallePedido: (req, res)=>{
        const {id} = req.params;
        detallePedidoModel.deleteDetallePedido(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Detalle de pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Detalle de pedido eliminado'});
        });
    }
}
