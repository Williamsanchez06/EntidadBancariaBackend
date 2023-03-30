const { response } = require("express");
const jwt  = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {

  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "error en el Token",
    });
  }

  try {
    
    const { id , name } = jwt.verify( token , process.env.SECRET_JWT_SEED );
    req.id   = id;
    req.name = name;

  } catch (error) {
    console.log(error);
    return res.status( 401 ).json({
        ok: false,
        msg : "Token no Valido",
    })
  }

  //Todo salio bien
  next();
};

module.exports = {
  validarJWT,
};
