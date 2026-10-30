const marcaModel = require('../models/marcaModel')
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

    getMarcas: (req, res)=>{
        marcaModel.getMarcas((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getMarcaById: (req, res)=>{
        const {id} = req.params;
        marcaModel.getMarcaById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result.length === 0){
                res.status(404).json({message: 'Marca no encontrada'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postMarca: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, pais_origen} = body;
        marcaModel.postMarca(nombre, pais_origen, (err, id)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Marca creada', data: {id: id}});
        });
    },

    putMarca: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const {nombre, pais_origen} = body;
        marcaModel.putMarca(id, nombre, pais_origen, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Marca no encontrada'});
                return;
            }
            res.status(200).json({message: 'Marca actualizada'});
        });
    },

    deleteMarca: (req, res)=>{
        const {id} = req.params;
        marcaModel.deleteMarca(id, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            if(result.affectedRows === 0){
                res.status(404).json({message: 'Marca no encontrada'});
                return;
            }
            res.status(200).json({message: 'Marca eliminada'});
        });
    }
}
