const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

const CABECERA = "select p.id_pedido, p.fecha_pedido, p.direccion_envio, c.documento, c.nombre, c.apellido, c.correo, " +
    "e.id_estado, e.nombre as estado, m.nombre as metodo_pago, sum(d.cantidad * d.precio_unitario) as total " +
    "from pedidos p " +
    "inner join clientes c on p.id_cliente = c.id_cliente " +
    "inner join estados_pedido e on p.id_estado = e.id_estado " +
    "inner join metodos_pago m on p.id_metodo_pago = m.id_metodo_pago " +
    "left join detalle_pedidos d on p.id_pedido = d.id_pedido ";
const AGRUPAR = " group by p.id_pedido, p.fecha_pedido, p.direccion_envio, c.documento, c.nombre, c.apellido, c.correo, e.id_estado, e.nombre, m.nombre";

class venta{

    getVentas(callback){
        const sql = CABECERA + AGRUPAR + " order by p.id_pedido desc";
        db.query(sql, callback);
    }

    getVentaById(id, callback){
        const sql = CABECERA + "where p.id_pedido = ?" + AGRUPAR;
        db.query(sql, [id], (err, pedido)=>{
            if(err){
                return callback(err, null);
            }
            if(pedido.length === 0){
                return callback(null, null);
            }
            const sqlItems = "select d.id_detalle, d.id_producto, pr.nombre as producto, d.cantidad, d.precio_unitario, " +
                "d.cantidad * d.precio_unitario as subtotal from detalle_pedidos d " +
                "inner join productos pr on d.id_producto = pr.id_producto where d.id_pedido = ?";
            db.query(sqlItems, [id], (err2, items)=>{
                if(err2){
                    return callback(err2, null);
                }
                callback(null, {pedido: pedido[0], items: items});
            });
        });
    }

    // registra una venta completa en una transaccion:
    // cliente (se busca o se crea), pedido, detalle y descuento de stock
    postVenta(cliente, id_metodo_pago, items, callback){
        db.getConnection((errCon, con)=>{
            if(errCon){
                return callback(errCon, null);
            }
            const fallar = (error)=>{
                con.rollback(()=>{
                    con.release();
                    callback(error, null);
                });
            };
            con.beginTransaction((errTx)=>{
                if(errTx){
                    con.release();
                    return callback(errTx, null);
                }
                con.query('select id_cliente from clientes where documento = ?', [cliente.documento], (e1, r1)=>{
                    if(e1){
                        return fallar(e1);
                    }

                    const crearPedido = (idCliente)=>{
                        const sqlPedido = 'insert into pedidos(fecha_pedido, direccion_envio, id_cliente, id_metodo_pago, id_estado) values (curdate(), ?, ?, ?, 1)';
                        con.query(sqlPedido, [cliente.direccion, idCliente, id_metodo_pago], (e3, r3)=>{
                            if(e3){
                                return fallar(e3);
                            }
                            const idPedido = r3.insertId;
                            let total = 0;

                            const procesar = (i)=>{
                                if(i === items.length){
                                    con.commit((eCommit)=>{
                                        if(eCommit){
                                            return fallar(eCommit);
                                        }
                                        con.release();
                                        callback(null, {id_pedido: idPedido, total: Math.round(total * 100) / 100});
                                    });
                                    return;
                                }
                                const item = items[i];
                                con.query('select nombre, precio, stock from productos where id_producto = ? for update', [item.id_producto], (e4, r4)=>{
                                    if(e4){
                                        return fallar(e4);
                                    }
                                    if(r4.length === 0){
                                        const er = new Error('El producto ' + item.id_producto + ' no existe');
                                        er.code = 'PRODUCTO_NO_ENCONTRADO';
                                        return fallar(er);
                                    }
                                    if(r4[0].stock < item.cantidad){
                                        const er = new Error('Stock insuficiente para ' + r4[0].nombre + ' (disponibles: ' + r4[0].stock + ')');
                                        er.code = 'STOCK_INSUFICIENTE';
                                        return fallar(er);
                                    }
                                    const sqlDetalle = 'insert into detalle_pedidos(id_pedido, id_producto, cantidad, precio_unitario) values (?, ?, ?, ?)';
                                    con.query(sqlDetalle, [idPedido, item.id_producto, item.cantidad, r4[0].precio], (e5)=>{
                                        if(e5){
                                            return fallar(e5);
                                        }
                                        con.query('update productos set stock = stock - ? where id_producto = ?', [item.cantidad, item.id_producto], (e6)=>{
                                            if(e6){
                                                return fallar(e6);
                                            }
                                            total = total + Number(r4[0].precio) * item.cantidad;
                                            procesar(i + 1);
                                        });
                                    });
                                });
                            };
                            procesar(0);
                        });
                    };

                    if(r1.length > 0){
                        return crearPedido(r1[0].id_cliente);
                    }
                    const sqlCliente = 'insert into clientes(documento, nombre, apellido, correo, telefono, direccion, ciudad) values (?, ?, ?, ?, ?, ?, ?)';
                    con.query(sqlCliente, [cliente.documento, cliente.nombre, cliente.apellido, cliente.correo, cliente.telefono, cliente.direccion, cliente.ciudad], (e2, r2)=>{
                        if(e2){
                            return fallar(e2);
                        }
                        crearPedido(r2.insertId);
                    });
                });
            });
        });
    }

    // cambia el estado de un pedido; si se cancela, devuelve el stock
    putEstadoVenta(id, id_estado, callback){
        db.getConnection((errCon, con)=>{
            if(errCon){
                return callback(errCon, null);
            }
            const fallar = (error)=>{
                con.rollback(()=>{
                    con.release();
                    callback(error, null);
                });
            };
            con.beginTransaction((errTx)=>{
                if(errTx){
                    con.release();
                    return callback(errTx, null);
                }
                con.query("select id_estado from estados_pedido where nombre = 'Cancelado'", (e0, r0)=>{
                    if(e0){
                        return fallar(e0);
                    }
                    const idCancelado = r0.length > 0 ? r0[0].id_estado : null;
                    con.query('select id_estado from pedidos where id_pedido = ? for update', [id], (e1, r1)=>{
                        if(e1){
                            return fallar(e1);
                        }
                        if(r1.length === 0){
                            const er = new Error('Pedido no encontrado');
                            er.code = 'PEDIDO_NO_ENCONTRADO';
                            return fallar(er);
                        }
                        if(idCancelado !== null && r1[0].id_estado === idCancelado){
                            const er = new Error('El pedido ya esta cancelado y no se puede modificar');
                            er.code = 'PEDIDO_CANCELADO';
                            return fallar(er);
                        }
                        con.query('update pedidos set id_estado = ? where id_pedido = ?', [id_estado, id], (e2)=>{
                            if(e2){
                                return fallar(e2);
                            }
                            const terminar = ()=>{
                                con.commit((eCommit)=>{
                                    if(eCommit){
                                        return fallar(eCommit);
                                    }
                                    con.release();
                                    callback(null, true);
                                });
                            };
                            if(idCancelado !== null && Number(id_estado) === idCancelado){
                                const sqlStock = 'update productos p inner join detalle_pedidos d on p.id_producto = d.id_producto set p.stock = p.stock + d.cantidad where d.id_pedido = ?';
                                con.query(sqlStock, [id], (e3)=>{
                                    if(e3){
                                        return fallar(e3);
                                    }
                                    terminar();
                                });
                            } else {
                                terminar();
                            }
                        });
                    });
                });
            });
        });
    }
}

module.exports = new venta();
