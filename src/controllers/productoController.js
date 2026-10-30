const productoModel = require('../models/productoModel')
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
    if(vacio(body.codigo)){
        return 'El campo codigo es obligatorio';
    }
    if(vacio(body.nombre)){
        return 'El campo nombre es obligatorio';
    }
    if(vacio(body.precio)){
        return 'El campo precio es obligatorio';
    }
    if(isNaN(body.precio) || Number(body.precio) <= 0){
        return 'El campo precio debe ser un número mayor a 0';
    }
    if(vacio(body.stock)){
        return 'El campo stock es obligatorio';
    }
    if(isNaN(body.stock) || !Number.isInteger(Number(body.stock)) || Number(body.stock) < 0){
        return 'El campo stock debe ser un número entero mayor o igual a 0';
    }
    if(vacio(body.id_categoria)){
        return 'El campo id_categoria es obligatorio';
    }
    if(isNaN(body.id_categoria)){
        return 'El campo id_categoria debe ser numérico';
    }
    if(vacio(body.id_marca)){
        return 'El campo id_marca es obligatorio';
    }
    if(isNaN(body.id_marca)){
        return 'El campo id_marca debe ser numérico';
    }
    return null;
};

module.exports = {

    getProductos: (req, res)=>{
        productoModel.getProductos((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getProductoById: (req, res)=>{
        const {id} = req.params;
        productoModel.getProductoById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postProducto: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {codigo, nombre, descripcion, precio, stock, id_categoria, id_marca} = body;
        productoModel.postProducto(codigo, nombre, descripcion, precio, stock, id_categoria, id_marca, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Producto creado', data: {id: id}});
        });
    },

    putProducto: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {codigo, nombre, descripcion, precio, stock, id_categoria, id_marca} = body;
        productoModel.putProducto(id, codigo, nombre, descripcion, precio, stock, id_categoria, id_marca, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }
            res.status(200).json({message: 'Producto actualizado'});
        });
    },

    deleteProducto: (req, res)=>{
        const {id} = req.params;
        productoModel.deleteProducto(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Producto no encontrado'});
                return;
            }
            res.status(200).json({message: 'Producto eliminado'});
        });
    }
}
