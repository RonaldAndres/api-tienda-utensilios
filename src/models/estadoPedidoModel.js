const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class estadoPedido{

    getEstadosPedido(callback){
        const sql = "select id_estado, nombre, descripcion from estados_pedido";
        db.query(sql,callback);
    }

    getEstadoPedidoById(id,callback){
        const sql = "select id_estado, nombre, descripcion from estados_pedido where id_estado = ?";
        db.query(sql,[id],callback);
    }

    postEstadoPedido(nombre, descripcion, callback){
        const sql = 'insert into estados_pedido(nombre, descripcion) values (?, ?)';
        db.query(sql, [nombre, descripcion], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putEstadoPedido(id, nombre, descripcion, callback){
        const sql = 'update estados_pedido set nombre = ?, descripcion = ? where id_estado = ?';
        db.query(sql, [nombre, descripcion, id], callback);
    }

    deleteEstadoPedido(id, callback){
        const sql = 'delete from estados_pedido where id_estado = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new estadoPedido();
