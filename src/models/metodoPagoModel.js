const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class metodoPago{

    getMetodosPago(callback){
        const sql = "select id_metodo_pago, nombre, descripcion from metodos_pago";
        db.query(sql,callback);
    }

    getMetodoPagoById(id,callback){
        const sql = "select id_metodo_pago, nombre, descripcion from metodos_pago where id_metodo_pago = ?";
        db.query(sql,[id],callback);
    }

    postMetodoPago(nombre, descripcion, callback){
        const sql = 'insert into metodos_pago(nombre, descripcion) values (?, ?)';
        db.query(sql, [nombre, descripcion], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putMetodoPago(id, nombre, descripcion, callback){
        const sql = 'update metodos_pago set nombre = ?, descripcion = ? where id_metodo_pago = ?';
        db.query(sql, [nombre, descripcion, id], callback);
    }

    deleteMetodoPago(id, callback){
        const sql = 'delete from metodos_pago where id_metodo_pago = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new metodoPago();
