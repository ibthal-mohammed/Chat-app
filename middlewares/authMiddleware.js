const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { promisify } = require("util");
const NotAuthError = require("../errors/NotAuthError");

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    var decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new NotAuthError('token is not true'))
    }
  }
  if (!token) {
    return next(new NotAuthError("Not authorized, no token"));
  }
  const stillUser = await User.findById(decoded.id);
  req.user = stillUser
  next();
});

module.exports = { protect };