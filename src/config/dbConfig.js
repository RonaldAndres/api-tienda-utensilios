const mysql = require('mysql');
const path = require('path');

// carga el archivo .env si existe (funcion propia de Node, sin librerias).
// En Render no existe: alli se usan las variables de entorno del panel.
try {
    process.loadEnvFile(path.join(__dirname, '..', '..', '.env'));
} catch (e) {}

// pool de conexiones: permite varias consultas a la vez y las transacciones de la venta
const db = mysql.createPool({
    connectionLimit: 2,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_utensilios',
    port: process.env.DB_PORT || 3306,
    dateStrings: true
});

db.getConnection((err, connection)=>{
    if(err){
        console.log("Error de conexion MYSQL: " + err.message);
        return;
    }
    console.log("Conexion MYSQL exitosa ")
    connection.release();
});

module.exports = db;
