class ApiErrror extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

class MissingFieldsError extends ApiErrror {
  constructor(message) {
    super(400, message)
  }
}

class UniqueFieldError extends ApiErrror {
  constructor(message) {
    super(409, message)
  }
}

class NotFoundError extends ApiErrror {
  constructor(message) {
    super(404, message)
  }
}

class InvalidTokenError extends ApiErrror {
  constructor(message) {
    super(401, message)
  }
}

export default ApiErrror
export {
  MissingFieldsError,
  UniqueFieldError,
  NotFoundError,
  InvalidTokenError,
}
