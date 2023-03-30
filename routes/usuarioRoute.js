const { Router } = require('express');
const { check } = require('express-validator');

const { addTarjeta, transferirFondo, homeCard, recargarCuenta, historialMovimientos } = require('../controller/usuarioController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router = Router();

//Obtener los datos de la tarjeta y su saldo 
router.get( '/home', validarJWT , homeCard );

//Añadir una Tarjeta De Credito
router.post( '/add-card', [
    check('numerotarjeta', 'El numero de Tarjeta es obligatorio').not().isEmpty(),
    check('nombretarjeta', 'El nombre es Obligatorio').isLength( { min : 10 } ),
    check('expiracion', 'La fecha de expiracion es obligatoria').isLength( { max : 10 } ),
    check('ccv', 'El CCV es Obligatorio').isLength( { max : 3 } ),
    validarCampos,
    validarJWT
], addTarjeta);

//Tranferir dinero a Otra 
router.post('/trasnferirfondo',[
    check('numerotarjetadest', 'El numero es Obligatorio').isLength( { min : 16, max : 16 } ),
    check('monto', 'EL monto es Obligatorio y Numerico').isNumeric(),
    check('telefono', 'El Telefono es Obligatorio').isLength( { min : 10 , max : 10} ),
    check('password', 'El password es obligatorio').isLength( { min : 6 } ),
    validarCampos,
    validarJWT
], transferirFondo)

//Recargar Cuenta
router.post('/recargarcuenta',[
    check('monto', 'EL monto es Obligatorio y Numerico').isNumeric(),
    check('password', 'El password es obligatorio').isLength( { min : 6 } ),
    validarCampos,
    validarJWT
], recargarCuenta )

router.get('/historialmovimientos', historialMovimientos)

module.exports = router;