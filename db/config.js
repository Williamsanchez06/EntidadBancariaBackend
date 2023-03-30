const { Sequelize } = require("sequelize");
require("dotenv").config(); // Se importa para utlizar las variables de entorno

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: "mssql",
  host: process.env.HOST_SQL,
  port: process.env.PORT_SQL,
  define: {
    timestamps: false, //Se coloca porque tiende a crear columnas
    freezeTableName : true, //Para que no agregue en la tabla palabras de mas
  },
     pool:{ //Configuracion de sequelize
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000,

     },
     
  
});

const dbConnection = async () => {
  try {
    await db.authenticate();
    console.log("Exitoso");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dbConnection,
  db
};
