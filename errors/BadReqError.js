const BaseError = require("./BaseError");

class BadReqError extends BaseError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = BadReqError;
