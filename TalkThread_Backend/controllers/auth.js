const JWT = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "khagendar@^$1234098765"; // Use environment variable for secret

module.exports.token = (user) => {
  const jwt = JWT.sign({
    id: user._id,
    email: user.email,
    role: user.role // Include role if needed
  }, secret, { expiresIn: '7d' });
  return jwt;
};

module.exports.decode = (token) => {
  try {
    const decoded = JWT.verify(token, secret);
    return decoded;
  } catch (e) {
    return null;
  }
};
