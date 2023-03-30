const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario , reValidarToken }  = require('../controller/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

//Crear un nuevo usuario
router.post( '/new',[
    check('name', 'El nombre es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es Obligatorio').isLength( { min : 6 } ),
    validarCampos
], crearUsuario );

//Login de usuario
router.post( '/', [
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es Obligatorio').isLength( { min : 6 } ),
    validarCampos
], loginUsuario );

//validar y revalidar Token
router.get( '/renew' , validarJWT ,reValidarToken );

module.exports = router;