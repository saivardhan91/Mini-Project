const auth = require("../controllers/auth");

module.exports = (req, res, next) => {
  let token = req.headers['token'];
  if (!token) {
    token = req.cookies['token'];
  }

  if (!token) {
    return res.status(401).json({ status: "fail", message: "Unauthorized: No token provided" });
  }

  try {
    let decode = auth.decode(token);
    if (!decode) {
      return res.status(401).json({ status: "fail", message: "Unauthorized: Invalid token" });
    }

    let email = decode.email;
    let id = decode.id;

    req.headers.email = email;
    req.headers._id = id;

    console.log('Email:', email);
    console.log('ID:', id);

    next();
  } catch (error) {
    console.error('Token decoding error:', error.message);
    return res.status(401).json({ status: "fail", message: "Unauthorized: Token error" });
  }
};
