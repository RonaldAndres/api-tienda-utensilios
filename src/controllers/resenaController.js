const resenaModel = require('../models/resenaModel')
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
    if(vacio(body.id_cliente)){
        return 'El campo id_cliente es obligatorio';
    }
    if(isNaN(body.id_cliente)){
        return 'El campo id_cliente debe ser numérico';
    }
    if(vacio(body.id_producto)){
        return 'El campo id_producto es obligatorio';
    }
    if(isNaN(body.id_producto)){
        return 'El campo id_producto debe ser numérico';
    }
    if(vacio(body.calificacion)){
        return 'El campo calificacion es obligatorio';
    }
    if(isNaN(body.calificacion) || !Number.isInteger(Number(body.calificacion)) || Number(body.calificacion) < 1 || Number(body.calificacion) > 5){
        return 'El campo calificacion debe ser un número entero entre 1 y 5';
    }
    if(vacio(body.fecha_resena)){
        return 'El campo fecha_resena es obligatorio';
    }
    if(!/^\d{4}-\d{2}-\d{2}$/.test(body.fecha_resena)){
        return 'El campo fecha_resena debe tener el formato AAAA-MM-DD';
    }
    return null;
};

module.exports = {

    getResenas: (req, res)=>{
        resenaModel.getResenas((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getResenaById: (req, res)=>{
        const {id} = req.params;
        resenaModel.getResenaById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Reseña no encontrada'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postResena: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {id_cliente, id_producto, calificacion, comentario, fecha_resena} = body;
        resenaModel.postResena(id_cliente, id_producto, calificacion, comentario, fecha_resena, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Reseña creada', data: {id: id}});
        });
    },

    putResena: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {id_cliente, id_producto, calificacion, comentario, fecha_resena} = body;
        resenaModel.putResena(id, id_cliente, id_producto, calificacion, comentario, fecha_resena, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Reseña no encontrada'});
                return;
            }
            res.status(200).json({message: 'Reseña actualizada'});
        });
    },

    deleteResena: (req, res)=>{
        const {id} = req.params;
        resenaModel.deleteResena(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Reseña no encontrada'});
                return;
            }
            res.status(200).json({message: 'Reseña eliminada'});
        });
    }
}
