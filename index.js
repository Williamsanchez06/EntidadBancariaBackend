const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// Crea el servirdor/aplicacion de Express
const app = express();

//Conexion a la base de datos
dbConnection();

//Directorio Publico
app.use(express.static('public'))

//CORS , MILDDLERWARE
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use( '/api/auth', require('./routes/auth') );
app.use( '/api/dashboard/usuario', require('./routes/usuarioRoute') );

app.listen( process.env.PORT , () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
})