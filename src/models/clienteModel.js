const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class cliente{

    getClientes(callback){
        const sql = "select id_cliente, documento, nombre, apellido, correo, telefono, direccion, ciudad from clientes";
        db.query(sql,callback);
    }

    getClienteById(id,callback){
        const sql = "select id_cliente, documento, nombre, apellido, correo, telefono, direccion, ciudad from clientes where id_cliente = ?";
        db.query(sql,[id],callback);
    }

    postCliente(documento, nombre, apellido, correo, telefono, direccion, ciudad, callback){
        const sql = 'insert into clientes(documento, nombre, apellido, correo, telefono, direccion, ciudad) values (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [documento, nombre, apellido, correo, telefono, direccion, ciudad], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putCliente(id, documento, nombre, apellido, correo, telefono, direccion, ciudad, callback){
        const sql = 'update clientes set documento = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, direccion = ?, ciudad = ? where id_cliente = ?';
        db.query(sql, [documento, nombre, apellido, correo, telefono, direccion, ciudad, id], callback);
    }

    deleteCliente(id, callback){
        const sql = 'delete from clientes where id_cliente = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new cliente();
