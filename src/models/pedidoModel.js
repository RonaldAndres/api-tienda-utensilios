const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class pedido{

    getPedidos(callback){
        const sql = "select id_pedido, fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado from pedidos";
        db.query(sql,callback);
    }

    getPedidoById(id,callback){
        const sql = "select id_pedido, fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado from pedidos where id_pedido = ?";
        db.query(sql,[id],callback);
    }

    postPedido(fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado, callback){
        const sql = 'insert into pedidos(fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado) values (?, ?, ?, ?, ?)';
        db.query(sql, [fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putPedido(id, fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado, callback){
        const sql = 'update pedidos set fecha_pedido = ?, direccion_envio = ?, id_cliente = ?, id_metodo_pago = ?, id_estado = ? where id_pedido = ?';
        db.query(sql, [fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado, id], callback);
    }

    deletePedido(id, callback){
        const sql = 'delete from pedidos where id_pedido = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new pedido();
