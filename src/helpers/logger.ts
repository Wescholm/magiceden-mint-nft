import path from "path";
import pino from "pino";
import pretty from "pino-pretty";

export class Logger {
  private readonly logger: pino.Logger;

  constructor(name: string) {
    const stream = pretty({
      colorize: true,
      ignore: "pid",
    });

    this.logger = pino(
      {
        name: path.basename(name),
        level: process.env.LOG_LEVEL || "info",
      },
      stream,
    );
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
