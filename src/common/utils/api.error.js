class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "unauthorized") {
    return new ApiError(401, message);
  }

  static conflict(message = "unauthorized") {
    return new ApiError(409, message);
  }

  static forbidden(message = "forbidden") {
    return new ApiError(403, message);
  }

  static serverFailure(message = "unauthorized") {
    return new ApiError(500, message);
  }
}

export default ApiError;
