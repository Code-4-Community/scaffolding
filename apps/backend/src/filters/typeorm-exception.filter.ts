import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

interface DBError {
  driverError?: {
    code?: string;
    detail?: string;
  };
  code?: string;
  detail?: string;
  message?: string;
  stack?: string;
}

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Some drivers attach the DB error on `driverError`, others surface `code`/`detail` on the error itself.
    const err = exception as unknown as DBError;
    const code = err.driverError?.code || err.code;
    const detail = err.driverError?.detail || err.detail || err.message;

    // Postgres: foreign_key_violation = '23503'
    if (code === '23503') {
      const message = detail || 'Foreign key violation';
      this.logger.warn(message);
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message,
      });
      return;
    }

    // Postgres: unique_violation = '23505'
    if (code === '23505') {
      const message = detail || 'Unique constraint violation';
      this.logger.warn(message);
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        error: 'Conflict',
        message,
      });
      return;
    }

    this.logger.error('Unhandled QueryFailedError', err.stack || String(err));
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Database error',
    });
  }
}
