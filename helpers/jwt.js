const jwt = require("jsonwebtoken");

const generarJWT = ( id, name) => {
  const payload = { id, name };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          console.log(err); // Todo Mal}
          reject(err);
        } else {
          // Todo Melo
          resolve( token );
        }
      }
    );
  });

};

module.exports = {
    generarJWT
}