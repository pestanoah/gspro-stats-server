import { NextFunction, Request, Response } from "express";
import type { HttpException } from "../exceptions/exception";
import { APP_ERROR_MESSAGE } from "../lib/constants";

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  console.error(error);
  const status = error.status ? error.status : 500;
  const message =
    status === 500 ? APP_ERROR_MESSAGE.serverError : error.message;
  const errors = error.error;
  response.status(status).send({ status, message, error: errors });
}

export default errorMiddleware;
