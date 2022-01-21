const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  try{
      console.log(req.headers.token);
      const token =
        req.body.token || req.query.token || req.headers.token;

      if (!token) {
        return res.status(403).json({"error":"A token is required for authentication"});
      }
      try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
        console.log('decoded user is: ' ,req.user);
      } catch (err) {
        return res.status(401).json({"error":"Invalid Token"});
      }
      return next();
  } catch(e){
      res.status(500).json({error:e.message})
  }
};

module.exports = {
  verifyToken
}