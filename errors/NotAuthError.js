const BaseError = require("./BaseError");

class NotAuthError extends BaseError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = NotAuthError;
