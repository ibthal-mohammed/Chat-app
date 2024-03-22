const BaseError = require("./BaseError");

class NotFound extends BaseError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = NotFound;
