const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class marca{

    getMarcas(callback){
        const sql = "select id_marca, nombre, pais_origen from marcas";
        db.query(sql,callback);
    }

    getMarcaById(id,callback){
        const sql = "select id_marca, nombre, pais_origen from marcas where id_marca = ?";
        db.query(sql,[id],callback);
    }

    postMarca(nombre, pais_origen, callback){
        const sql = 'insert into marcas(nombre, pais_origen) values (?, ?)';
        db.query(sql, [nombre, pais_origen], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putMarca(id, nombre, pais_origen, callback){
        const sql = 'update marcas set nombre = ?, pais_origen = ? where id_marca = ?';
        db.query(sql, [nombre, pais_origen, id], callback);
    }

    deleteMarca(id, callback){
        const sql = 'delete from marcas where id_marca = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new marca();
