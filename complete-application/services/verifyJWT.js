require('dotenv/config');
const jose = require('jose');

const jwksClient = jose.createRemoteJWKSet(
  new URL(`${process.env.BASE_URL}/.well-known/jwks.json`)
);

const verifyJWT = async (req, res, next) => {
  const access_token = req.cookies['app.at'];
  // console.log(`Token ${access_token}`);
  if (!access_token) {
    res.status(401);
    res.send({ error: 'Missing token cookie and Authorization header' });
  } else {
    try {
      // console.log("Decoding token");
      const result = await jose.jwtVerify(access_token, jwksClient, {
        issuer: process.env.BASE_URL,
        audience: process.env.CLIENT_ID,
      });
      // console.dir(result);
      next();
    } catch (e) {
      if (e instanceof jose.errors.JOSEError) {
        res.status(401);
        res.send({ error: e.message, code: e.code });
      } else {
        console.dir(`Internal server error: ${e}`);
        res.status(500);
        res.send({ error: JSON.stringify(e) });
      }
    }
  }
};

module.exports = verifyJWT;
