const clienteModel = require('../models/clienteModel')
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
    if(vacio(body.documento)){
        return 'El campo documento es obligatorio';
    }
    if(vacio(body.nombre)){
        return 'El campo nombre es obligatorio';
    }
    if(vacio(body.apellido)){
        return 'El campo apellido es obligatorio';
    }
    if(vacio(body.correo)){
        return 'El campo correo es obligatorio';
    }
    if(!String(body.correo).includes('@')){
        return 'El campo correo no es un correo válido';
    }
    return null;
};

module.exports = {

    getClientes: (req, res)=>{
        clienteModel.getClientes((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getClienteById: (req, res)=>{
        const {id} = req.params;
        clienteModel.getClienteById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postCliente: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {documento, nombre, apellido, correo, telefono, direccion, ciudad} = body;
        clienteModel.postCliente(documento, nombre, apellido, correo, telefono, direccion, ciudad, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Cliente creado', data: {id: id}});
        });
    },

    putCliente: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {documento, nombre, apellido, correo, telefono, direccion, ciudad} = body;
        clienteModel.putCliente(id, documento, nombre, apellido, correo, telefono, direccion, ciudad, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }
            res.status(200).json({message: 'Cliente actualizado'});
        });
    },

    deleteCliente: (req, res)=>{
        const {id} = req.params;
        clienteModel.deleteCliente(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Cliente no encontrado'});
                return;
            }
            res.status(200).json({message: 'Cliente eliminado'});
        });
    }
}
