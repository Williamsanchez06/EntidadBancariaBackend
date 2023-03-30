const { response } = require("express"); //Pra que salaga el autocorrector
const bcrypt = require('bcryptjs');
const  UsuarioSchema = require('../models/Usuario');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password, name } = req.body;

  try {
    // Verificar el Email
    let usuario = await UsuarioSchema.findOne({ where : { email }});

    if( usuario ) {
        return res.status( 400 ).json({
            ok: false,
            msg : 'El correo ya esta en Uso'
        })
    }

    //Crear Usuario con el Modelo
    const dbUser = new UsuarioSchema( req.body );
    dbUser.monto = "1.000.000";

    // Encriptar o Hashear la Contraseña
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync( String( password ) , salt );
    
    //Crear Usuario de DB
    await dbUser.save();

    //Genera el JWT
    const token  = await generarJWT( dbUser.id, name );

    //Generar respuesta EXITOSA
    return res.status( 201 ).json({
        ok  : true,
        id : dbUser.id,
        name,
        email,
        token
  });

  } catch (error) {
    console.log(error);
    return res.status( 500 ).json({
      ok: false,
      msg: "Por Favor comuniquese con el Administrador",
    });
  }
};

const loginUsuario = async(req, res = response) => {

  const { email , password } = req.body;

  try {

    const dbUser = await UsuarioSchema.findOne({ where : { email } });

    if( !dbUser ) {
      return res.status( 400 ).json({
        ok: false,
        msg: 'El correo o La contraseña no es Valido'
      })
    }

    // Confirmar si el password hace match 
    const validPassword = bcrypt.compareSync( String(password), dbUser.password );

    if( !validPassword ) {
      return res.status( 400 ).json({
        ok: false,
        msg: 'El correo o La contraseña no es Valido'
      })
    }

    // Generar el JWT
    const token  = await generarJWT( dbUser.id, dbUser.name );

    //Respuesta del servicio 
    return res.json({
        ok: true,
        id : dbUser.id,
        name : dbUser.name,
        email,
        token
    })

  } catch (error) {
    console.log(error);

    return res.status(400).json({
        ok: false,
        msg : 'Hable con el administrador'
    })
  }

};

const reValidarToken = async(req, res = response) => {

  const { id } = req;

  //Leer la base de datos
  const dbUser = await UsuarioSchema.findOne( { where : { id } } )

   // Generar el JWT
   const token  = await generarJWT( id , dbUser.name );

  return res.json({
    ok: true,
    msg: "Renew",
    id,
    name  : dbUser.name,
    email : dbUser.email,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  reValidarToken,
};
