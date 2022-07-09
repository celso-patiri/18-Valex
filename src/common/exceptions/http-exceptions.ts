type Res = string | any;

export class HttpException extends Error {
  statusCode: number;
  response: Res;

  constructor(statusCode: number, response: Res) {
    super();
    this.name = "HttpException";
    this.statusCode = statusCode || 500;
    this.response = response || "Something went wrong";
  }
}

export class UnauthorizedException extends HttpException {
  constructor(response?: Res) {
    super(401, response || "Unauthorized");
  }
}

export class ForbiddenException extends HttpException {
  constructor(response?: Res) {
    super(403, response || "Forbidden");
  }
}

export class NotFoundException extends HttpException {
  constructor(response?: Res) {
    super(404, response || "Not Found");
  }
}

export class UnprocessableEntityException extends HttpException {
  constructor(response?: Res) {
    super(422, response || "Unprocessable Entity");
  }
}
