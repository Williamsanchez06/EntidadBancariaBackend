const  Sequelize  = require("sequelize");
const { db } = require("../db/config");

const AddTarjetaModel = db.define('tarjetaInfo',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_persona: {
        type: Sequelize.INTEGER,
    },
    numerotarjeta : {
        type :  Sequelize.STRING,
    },
    nombretarjeta : {
        type :  Sequelize.STRING,
    },
    expiracion : {
        type :  Sequelize.STRING,
    },
    ccv : {
        type :  Sequelize.STRING,
    }
})

module.exports = AddTarjetaModel;