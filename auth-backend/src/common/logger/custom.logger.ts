import { Injectable, Logger } from '@nestjs/common';
import { CustomLoggerInterface, LogParams } from './logger.interface';
import { createHash } from 'crypto';

@Injectable()
export class CustomLogger implements CustomLoggerInterface {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  private hashSensitiveData(data: string): string {
    return createHash('sha256').update(data).digest('hex').slice(0, 8);
  }

  private maskSensitiveData(params?: LogParams): LogParams | undefined {
    if (!params) return undefined;

    const maskedParams = { ...params };

    if (maskedParams.email) {
      maskedParams.email = this.hashSensitiveData(maskedParams.email);
    }

    // Remove password if present
    if ('password' in maskedParams) {
      delete maskedParams.password;
    }

    return maskedParams;
  }

  private formatMessage(
    message: string,
    params?: LogParams,
    error?: Error,
  ): string {
    if (!params) {
      return message;
    }

    return JSON.stringify({
      message,
      params: this.maskSensitiveData(params),
      error,
    });
  }

  info(message: string, params?: LogParams): void {
    this.logger.log(this.formatMessage(message, params));
  }

  error(message: string, error: Error, params?: LogParams): void {
    this.logger.error(this.formatMessage(message, params, error), error.stack);
  }

  warn(message: string, params?: LogParams): void {
    this.logger.warn(this.formatMessage(message, params));
  }

  debug(message: string, params?: LogParams): void {
    this.logger.debug(this.formatMessage(message, params));
  }

  verbose(message: string, params?: LogParams): void {
    this.logger.verbose(this.formatMessage(message, params));
  }
}
