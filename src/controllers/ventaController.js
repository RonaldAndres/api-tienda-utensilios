const ventaModel = require('../models/ventaModel')
// se realiza llamado al modelo

const vacio = (valor)=>{
    return valor === undefined || valor === null || String(valor).trim() === '';
};

const manejarError = (err, res)=>{
    if(err.code === 'STOCK_INSUFICIENTE'){
        res.status(409).json({message: err.message});
        return;
    }
    if(err.code === 'PRODUCTO_NO_ENCONTRADO' || err.code === 'PEDIDO_NO_ENCONTRADO'){
        res.status(404).json({message: err.message});
        return;
    }
    if(err.code === 'PEDIDO_CANCELADO'){
        res.status(409).json({message: err.message});
        return;
    }
    if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).json({message: 'Ya existe un cliente con ese correo o documento'});
        return;
    }
    if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        res.status(409).json({message: 'El método de pago o el estado indicado no existe'});
        return;
    }
    res.status(500).json({error: err.message});
};

// valida el cuerpo de la venta y devuelve un mensaje de error o null
const validar = (body)=>{
    const cliente = body.cliente;
    if(!cliente || typeof cliente !== 'object'){
        return 'Faltan los datos del cliente';
    }
    const obligatorios = ['documento', 'nombre', 'apellido', 'correo', 'direccion', 'ciudad'];
    for(let i = 0; i < obligatorios.length; i++){
        if(vacio(cliente[obligatorios[i]])){
            return 'El campo cliente.' + obligatorios[i] + ' es obligatorio';
        }
    }
    if(!String(cliente.correo).includes('@')){
        return 'El campo cliente.correo no es un correo válido';
    }
    if(vacio(body.id_metodo_pago) || isNaN(body.id_metodo_pago)){
        return 'El campo id_metodo_pago es obligatorio y debe ser numérico';
    }
    if(!Array.isArray(body.items) || body.items.length === 0){
        return 'El pedido debe tener al menos un producto en items';
    }
    for(let i = 0; i < body.items.length; i++){
        const it = body.items[i];
        if(!it || vacio(it.id_producto) || isNaN(it.id_producto)){
            return 'Cada item debe tener un id_producto numérico';
        }
        if(vacio(it.cantidad) || isNaN(it.cantidad) || !Number.isInteger(Number(it.cantidad)) || Number(it.cantidad) <= 0){
            return 'Cada item debe tener una cantidad entera mayor a 0';
        }
    }
    return null;
};

module.exports = {

    getVentas: (req, res)=>{
        ventaModel.getVentas((err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    getVentaById: (req, res)=>{
        const {id} = req.params;
        ventaModel.getVentaById(id, (err, result)=>{
            if(err){
                res.status(500).json({error: err.message});
                return;
            }
            if(result === null){
                res.status(404).json({message: 'Pedido no encontrado'});
                return;
            }
            res.status(200).json({data: result});
        });
    },

    postVenta: (req, res)=>{
        const body = req.body || {};
        const mensaje = validar(body);
        if(mensaje){
            res.status(400).json({message: mensaje});
            return;
        }
        const c = body.cliente;
        const cliente = {
            documento: String(c.documento).trim(),
            nombre: String(c.nombre).trim(),
            apellido: String(c.apellido).trim(),
            correo: String(c.correo).trim(),
            telefono: vacio(c.telefono) ? null : String(c.telefono).trim(),
            direccion: String(c.direccion).trim(),
            ciudad: String(c.ciudad).trim()
        };
        // si un producto viene repetido, se suman las cantidades
        const items = [];
        body.items.forEach((it)=>{
            const idProducto = Number(it.id_producto);
            const existente = items.find((x)=> x.id_producto === idProducto);
            if(existente){
                existente.cantidad = existente.cantidad + Number(it.cantidad);
            } else {
                items.push({id_producto: idProducto, cantidad: Number(it.cantidad)});
            }
        });
        ventaModel.postVenta(cliente, Number(body.id_metodo_pago), items, (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(201).json({message: 'Pedido registrado', data: result});
        });
    },

    putEstadoVenta: (req, res)=>{
        const {id} = req.params;
        const body = req.body || {};
        if(vacio(body.id_estado) || isNaN(body.id_estado)){
            res.status(400).json({message: 'El campo id_estado es obligatorio y debe ser numérico'});
            return;
        }
        ventaModel.putEstadoVenta(id, Number(body.id_estado), (err, result)=>{
            if(err){
                manejarError(err, res);
                return;
            }
            res.status(200).json({message: 'Estado del pedido actualizado'});
        });
    }
}
