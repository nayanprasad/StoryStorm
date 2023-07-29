const jwt = require("jsonwebtoken");


const jwt_SECRETE = "IteMeHedes";

const fetchUser = async (req, res, next) => {

  const authToken = req.header("auth-token");
  if(!authToken){
    res.status(401).send("enter a valid token");
  }

  try {
    const data = jwt.verify(authToken, jwt_SECRETE);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("enter a valid token - in cath getUser.js");
  }
}

module.exports = fetchUser;