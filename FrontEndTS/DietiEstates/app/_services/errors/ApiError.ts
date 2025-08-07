class ApiError extends Error {
  statusCode: number;
  userMessage: string;

  constructor(statusCode: number, message: string, userMessage: string) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;