class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message = 'Not authorized') {
    super(message, 401);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

module.exports = {
  ErrorResponse,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError
};