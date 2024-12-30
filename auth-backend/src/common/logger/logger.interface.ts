export interface LogParams {
  [key: string]: any;
}

export interface CustomLoggerInterface {
  info(message: string, params?: LogParams): void;
  error(message: string, params?: LogParams): void;
  warn(message: string, params?: LogParams): void;
  debug(message: string, params?: LogParams): void;
  verbose(message: string, params?: LogParams): void;
}
