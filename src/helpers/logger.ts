import path from "path";
import pino from "pino";

export class Logger {
  private readonly logger: pino.Logger;

  constructor(name: string) {
    this.logger = pino({
      name: path.basename(name),
      level: process.env.LOG_LEVEL || "info",
      transport: {
        target: "pino-pretty",
        options: {
          ignore: "pid",
          colorize: true,
        },
      },
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  warn(msg: string) {
    this.logger.warn(msg);
  }

  debug(message: string, ...args: string[]) {
    this.logger.debug(message.concat(...args));
  }

  error(msg: string, err: any) {
    this.logger.error({ msg, err });
  }

  fatal(msg: string, err: any) {
    this.logger.fatal({ msg, err });
  }
}
