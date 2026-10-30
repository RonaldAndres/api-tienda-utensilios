const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class resena{

    getResenas(callback){
        const sql = "select id_resena, id_cliente, id_producto, calificacion, comentario, fecha_resena from resenas";
        db.query(sql,callback);
    }

    getResenaById(id,callback){
        const sql = "select id_resena, id_cliente, id_producto, calificacion, comentario, fecha_resena from resenas where id_resena = ?";
        db.query(sql,[id],callback);
    }

    postResena(id_cliente, id_producto, calificacion, comentario, fecha_resena, callback){
        const sql = 'insert into resenas(id_cliente, id_producto, calificacion, comentario, fecha_resena) values (?, ?, ?, ?, ?)';
        db.query(sql, [id_cliente, id_producto, calificacion, comentario, fecha_resena], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putResena(id, id_cliente, id_producto, calificacion, comentario, fecha_resena, callback){
        const sql = 'update resenas set id_cliente = ?, id_producto = ?, calificacion = ?, comentario = ?, fecha_resena = ? where id_resena = ?';
        db.query(sql, [id_cliente, id_producto, calificacion, comentario, fecha_resena, id], callback);
    }

    deleteResena(id, callback){
        const sql = 'delete from resenas where id_resena = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new resena();
