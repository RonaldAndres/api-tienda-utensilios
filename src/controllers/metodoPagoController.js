const metodoPagoModel = require('../models/metodoPagoModel')
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

    getMetodosPago: (req, res)=>{
        metodoPagoModel.getMetodosPago((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getMetodoPagoById: (req, res)=>{
        const {id} = req.params;
        metodoPagoModel.getMetodoPagoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Método de pago no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postMetodoPago: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, descripcion} = body;
        metodoPagoModel.postMetodoPago(nombre, descripcion, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Método de pago creado', data: {id: id}});
        });
    },

    putMetodoPago: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, descripcion} = body;
        metodoPagoModel.putMetodoPago(id, nombre, descripcion, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Método de pago no encontrado'});
                return;
            }
            res.status(200).json({message: 'Método de pago actualizado'});
        });
    },

    deleteMetodoPago: (req, res)=>{
        const {id} = req.params;
        metodoPagoModel.deleteMetodoPago(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Método de pago no encontrado'});
                return;
            }
            res.status(200).json({message: 'Método de pago eliminado'});
        });
    }
}
