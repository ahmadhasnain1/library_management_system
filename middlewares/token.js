const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  try{
      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return res.status(403).send("A token is required for authentication");
      }
      try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }
      return next();
  } catch(e){
      res.status(500).json({error:e.message})
  }
};

module.exports = verifyToken;