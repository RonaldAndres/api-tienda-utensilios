const pedidoModel = require('../models/pedidoModel')
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
    if(vacio(body.fecha_pedido)){
        return 'El campo fecha_pedido es obligatorio';
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(body.fecha_pedido)){
        return 'El campo fecha_pedido debe tener el formato AAAA-MM-DD';
    }
    if(vacio(body.direccion_envio)){
        return 'El campo direccion_envio es obligatorio';
    }
    if(vacio(body.id_cliente)){
        return 'El campo id_cliente es obligatorio';
    }
    if(isNaN(body.id_cliente)){
        return 'El campo id_cliente debe ser numérico';
    }
    if(vacio(body.id_metodo_pago)){
        return 'El campo id_metodo_pago es obligatorio';
    }
    if(isNaN(body.id_metodo_pago)){
        return 'El campo id_metodo_pago debe ser numérico';
    }
    if(vacio(body.id_estado)){
        return 'El campo id_estado es obligatorio';
    }
    if(isNaN(body.id_estado)){
        return 'El campo id_estado debe ser numérico';
    }
    return null;
};

module.exports = {

    getPedidos: (req, res)=>{
        pedidoModel.getPedidos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getPedidoById: (req, res)=>{
        const {id} = req.params;
        pedidoModel.getPedidoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postPedido: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado} = body;
        pedidoModel.postPedido(fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Pedido creado', data: {id: id}});
        });
    },

    putPedido: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado} = body;
        pedidoModel.putPedido(id, fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Pedido actualizado'});
        });
    },

    deletePedido: (req, res)=>{
        const {id} = req.params;
        pedidoModel.deletePedido(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }
            res.status(200).json({message: 'Pedido eliminado'});
        });
    }
}
