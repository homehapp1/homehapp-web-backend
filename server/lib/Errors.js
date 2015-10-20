var BaseError = exports.BaseError = class BaseError extends Error {
  constructor(message, data = null) {
    super(message);
    this.message = message;
    this.data = data;
  }
};

exports.Forbidden = class Forbidden extends BaseError {
  constructor(message, data) {
    message = message || 'Forbidden';
    super(message, data);
    this.statusCode = 403;
  }
};

exports.BadRequest = class BadRequest extends BaseError {
  constructor(message, data) {
    message = message || 'Bad Request';
    super(message, data);
    this.statusCode = 400;
  }
};

exports.NotFound = class NotFound extends BaseError {
  constructor(message, data) {
    message = message || 'Not Found';
    super(message, data);
    this.statusCode = 404;
  }
};

exports.UnprocessableEntity = class UnprocessableEntity extends BaseError {
  constructor(message, data) {
    message = message || 'Unprocessable Entity';
    super(message, data);
    this.statusCode = 422;
  }
};

exports.InternalServerError = class InternalServerError extends BaseError {
  constructor(message, data) {
    message = message || 'Internal Server Error';
    super(message, data);
    this.statusCode = 500;
  }
};

exports.NotImplemented = class NotImplemented extends BaseError {
  constructor(message, data) {
    message = message || 'Not Implemented';
    super(message, data);
    this.statusCode = 501;
  }
};
