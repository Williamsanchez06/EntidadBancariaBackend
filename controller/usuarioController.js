const { response } = require("express");
const bcrypt = require('bcryptjs');
const  UsuarioSchema = require('../models/Usuario');
const AddTarjetaModel = require("../models/AddTarjeta");
const TransferirFondo = require("../models/TransferirFondo");
const { Op } = require("sequelize");

const homeCard = async ( req , res = response ) => {

    const { id } = req;

    try {

        UsuarioSchema.hasMany( AddTarjetaModel, { foreignKey: 'id_persona' } );
        AddTarjetaModel.belongsTo( UsuarioSchema, { foreignKey: 'id_persona' } );

        const tarjetaUsuario = await UsuarioSchema.findAll({
            where : { id },
            attributes : ['monto'],
            include : [{
                model : AddTarjetaModel,
                required : true,
                attributes : ['numerotarjeta', 'nombretarjeta', 'expiracion']
            }]
        })

        if( tarjetaUsuario.length === 0) {
            return res.json({
                ok : false,
                msg : 'No tiene Asociado la TARJETA'
            })
        }

        const [{ monto, tarjetaInfos: [{ numerotarjeta, nombretarjeta, expiracion }] }] = tarjetaUsuario;

        return res.json({
            ok: true,
            monto,
            numerotarjeta,
            nombretarjeta,
            expiracion
        })
        
    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: "Por Favor comuniquese con el Administrador",
        });
    }

}

const addTarjeta = async ( req , res = response) => {

    const { id } = req;
    const { numerotarjeta } = req.body;

    try {
        
        //Verificar si esa tarjeta ya esta asociada a un usuario
        let tarjetaUsuario = await AddTarjetaModel.findOne({ where : { numerotarjeta }});

        if( tarjetaUsuario ) {
            return res.status( 400 ).json({
                ok : false,
                msg : 'La tarjeta ya esta Asociada'
            })
        }

        //Crear tarjeta con el Modelo
        const dbTarjeta = new AddTarjetaModel( req.body );
        dbTarjeta.id_persona = id;

        await dbTarjeta.save();

        return res.json({
            ok : true,
            msg: 'Tarjeta asociada Correctamente',
        })

    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: "Por Favor comuniquese con el Administrador",
        });
    }
}

const transferirFondo = async (req, res = response) => {

    const { id } = req;
    const { numerotarjetadest , monto, password } = req.body;

    try {

    const dbUser = await UsuarioSchema.findOne({ where : { id } });
    
    if( !dbUser ){
        return res.status( 400 ).json({
            ok: false,
            msg: "Usuario no Encontrado Inicia Sesion de Nuevo"
        });
    }
    
    // Confirmar si el password hace match 
    const validPassword = bcrypt.compareSync( String(password), dbUser.password );

        if( !validPassword ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Contraseña Invalida'
            })
        }

    let tarjetaDestino = await AddTarjetaModel.findOne({
        where : { numerotarjeta : numerotarjetadest }
    });

    if( !tarjetaDestino ) {
        return res.status( 400 ).json({
            ok: false,
            msg: 'Tarjeta de Destino no existe'
        })
    }

    // Busco por el id de asociado en la tarjeta
    const dbUserDestino = await UsuarioSchema.findOne({ where : { id : tarjetaDestino.id_persona } });

    if(parseInt(dbUser.monto.replaceAll(".", "")) < monto ){
        return res.status( 400 ).json({
            ok: false,
            msg: 'Saldo Insuficiente'
        })
    }

    //Convierto la moneda a colombiana
    dbUser.monto = parseInt(dbUser.monto.replaceAll(".", "")) - monto;
    dbUser.monto = dbUser.monto.toLocaleString("es-CO", {currency: "COP"})
    await dbUser.save();

    dbUserDestino.monto =  parseInt(dbUserDestino.monto.replaceAll(".", "")) + monto;
    dbUserDestino.monto = dbUserDestino.monto.toLocaleString("es-CO", {currency: "COP"})
    await dbUserDestino.save();

    const dbTransaccion = new TransferirFondo( req.body );
    dbTransaccion.id_usuario_origen = id;
    dbTransaccion.monto = dbTransaccion.monto.toLocaleString("es-CO", {currency: "COP"})
    dbTransaccion.id_usuario_destino = tarjetaDestino.id_persona;
    dbTransaccion.tipo_movimiento = 'TRANSFERIRDINERO';
    await dbTransaccion.save();

    return res.json({
        ok:true
    })

    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: "Por Favor comuniquese con el Administrador",
        });
    }

}

const recargarCuenta = async (req, res = response) => {

    const { id } = req;
    
    const { monto, password } = req.body;
    
    try {
        
        const dbUser = await UsuarioSchema.findOne({ where : { id } });

        if( !dbUser ){
            return res.status( 400 ).json({
                ok: false,
                msg: "Usuario no Encontrado Inicia Sesion de Nuevo"
            });
        }

        // Confirmar si el password hace match 
        const validPassword = bcrypt.compareSync( String( password ), dbUser.password );

        if( !validPassword ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Contraseña Invalida'
            })
        }

        dbUser.monto = parseInt(dbUser.monto.replaceAll(".", "")) + monto;
        dbUser.monto = dbUser.monto.toLocaleString("es-CO", {currency: "COP"})
        await dbUser.save();

        const dbTransaccion = new TransferirFondo( req.body );
        dbTransaccion.id_usuario_origen = id;
        dbTransaccion.monto = dbTransaccion.monto.toLocaleString("es-CO", {currency: "COP"})
        dbTransaccion.id_usuario_destino = dbUser.id
        dbTransaccion.tipo_movimiento = 'RECARGARCUENTA';
        await dbTransaccion.save();

        return res.status( 200 ).json({
            ok: true,
            msg: 'Recarga de Dinero con Exito'
        })


    } catch (error) {
        console.log(error);
        return res.status( 500 ).json({
            ok: false,
            msg: "Por Favor comuniquese con el Administrador",
        });
    }
    
}

const historialMovimientos = async ( req, res = response ) => {

    const { id } = req;

    // select u.name, t.monto, t.tipo_movimiento,t.fecha from transacciones t
    // inner join Usuarios u
    // on
    // t.id_usuario_destino = u.id
    // where id_usuario_origen = 26 or id_usuario_destino = 26;

    UsuarioSchema.hasMany( TransferirFondo, { foreignKey: 'id_usuario_destino' } );
    TransferirFondo.belongsTo( UsuarioSchema, { foreignKey: 'id_usuario_destino' } );

        const historialMovimientos = await TransferirFondo.findAll({
            where : {  
                [Op.or]: [
                   { id_usuario_origen  : 26 },
                   { id_usuario_destino : 26 }
                ]
            },
            attributes : ['monto', 'tipo_movimiento', 'fecha'],
            include : [{
                model : UsuarioSchema,
                required : true,
                attributes : ['name']
            }]
        })

        const movimientos = historialMovimientos.map(({monto, tipo_movimiento, fecha, Usuario:{name}}) => ({monto, tipo_movimiento, fecha, name}));

        return res.json(
            movimientos
        )

}

module.exports = {
    addTarjeta,
    transferirFondo,
    homeCard,
    recargarCuenta,
    historialMovimientos
};