
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_utensilios',
    port: process.env.DB_PORT || 3306,
    dateStrings: true
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log("Conexion MYSQL exitosa ")
});

module.exports = db;
