const  Sequelize  = require("sequelize");
const { db } = require("../db/config");

const UsuarioSchema = db.define('Usuarios',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name : {
        type :  Sequelize.STRING,
        required : true,
    },
    email : {
        type :  Sequelize.STRING,
        required : true,
        unique : true,
    },
    password : {
        type :  Sequelize.STRING,
        required : true,
    },
    monto : {
        type :  Sequelize.STRING,
        required : true,
    },
    telefono : {
        type : Sequelize.STRING,
        require : true
    }
})

module.exports = UsuarioSchema;