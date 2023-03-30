const  Sequelize  = require("sequelize");
const { db } = require("../db/config");

const TransferirFondo = db.define('transacciones',{
    id_transaccion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    monto : {
        type: Sequelize.STRING,
    },
    estado : {
        type :  Sequelize.STRING,
    },
    fecha : {
        type :  Sequelize.STRING,
    },
    id_usuario_origen : {
        type :  Sequelize.INTEGER,
    },
    id_usuario_destino : {
        type :  Sequelize.INTEGER,
    },
    tipo_movimiento : {
        type : Sequelize.INTEGER
    }
})

module.exports = TransferirFondo;