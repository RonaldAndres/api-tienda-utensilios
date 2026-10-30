const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class categoria{

    getCategorias(callback){
        const sql = "select id_categoria, nombre, descripcion from categorias";
        db.query(sql,callback);
    }

    getCategoriaById(id,callback){
        const sql = "select id_categoria, nombre, descripcion from categorias where id_categoria = ?";
        db.query(sql,[id],callback);
    }

    postCategoria(nombre, descripcion, callback){
        const sql = 'insert into categorias(nombre, descripcion) values (?, ?)';
        db.query(sql, [nombre, descripcion], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putCategoria(id, nombre, descripcion, callback){
        const sql = 'update categorias set nombre = ?, descripcion = ? where id_categoria = ?';
        db.query(sql, [nombre, descripcion, id], callback);
    }

    deleteCategoria(id, callback){
        const sql = 'delete from categorias where id_categoria = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new categoria();
