type Res = string | any;

export class HttpException extends Error {
  statusCode: number;
  response: Res;

  constructor(statusCode: number, response: Res) {
    super();
    this.name = "HttpException";
    this.statusCode = statusCode;
    this.response = response || "Something went wrong";
  }
}

export class UnauthorizedException extends HttpException {
  constructor(response?: Res) {
    super(401, response || "Unauthorized");
  }
}
