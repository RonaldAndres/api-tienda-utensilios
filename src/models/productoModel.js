const db = require('../config/dbConfig')
// se llama a la configuracion de la bd

class producto{

    getProductos(callback){
        const sql = "select p.id_producto, p.codigo, p.nombre, p.descripcion, p.precio, p.stock, p.id_categoria, c.nombre as categoria, p.id_marca, m.nombre as marca from productos p inner join categorias c on p.id_categoria = c.id_categoria inner join marcas m on p.id_marca = m.id_marca";
        db.query(sql,callback);
    }

    getProductoById(id,callback){
        const sql = "select p.id_producto, p.codigo, p.nombre, p.descripcion, p.precio, p.stock, p.id_categoria, c.nombre as categoria, p.id_marca, m.nombre as marca from productos p inner join categorias c on p.id_categoria = c.id_categoria inner join marcas m on p.id_marca = m.id_marca where p.id_producto = ?";
        db.query(sql,[id],callback);
    }

    postProducto(codigo, nombre, descripcion, precio, stock, id_categoria, id_marca, callback){
        const sql = 'insert into productos(codigo, nombre, descripcion, precio, stock, id_categoria, id_marca) values (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [codigo, nombre, descripcion, precio, stock, id_categoria, id_marca], (err, result)=>{
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    putProducto(id, codigo, nombre, descripcion, precio, stock, id_categoria, id_marca, callback){
        const sql = 'update productos set codigo = ?, nombre = ?, descripcion = ?, precio = ?, stock = ?, id_categoria = ?, id_marca = ? where id_producto = ?';
        db.query(sql, [codigo, nombre, descripcion, precio, stock, id_categoria, id_marca, id], callback);
    }

    deleteProducto(id, callback){
        const sql = 'delete from productos where id_producto = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = new producto();
