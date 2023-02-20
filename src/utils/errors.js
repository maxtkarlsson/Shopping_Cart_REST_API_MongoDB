const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "BadRequestError";
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

class ValidationError extends BadRequestError {
  constructor(message, validationErrors) {
    super(message);
    this.validationErrors = validationErrors || [];
  }
}

module.exports = {
  catchErrors,
  NotFoundError,
  BadRequestError,
  ValidationError,
};
