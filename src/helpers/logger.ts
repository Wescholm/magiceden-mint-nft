import fs from "fs";
import path from "path";
import pino, { StreamEntry } from "pino";
import pretty from "pino-pretty";

export class Logger {
  private BASE_LOGS_PATH = path.resolve(__dirname, "..", "logs");
  private static instance: Logger;
  private readonly logger: pino.Logger;
  private readonly streams: StreamEntry[] = [
    {
      stream: fs.createWriteStream(
        path.resolve(this.BASE_LOGS_PATH, "info.stream.out"),
      ),
    },
    {
      stream: pretty({
        colorize: true,
        hideObject: true,
        messageKey: "msg",
        errorProps: "e,err,error",
      }),
    },
    {
      level: "debug",
      stream: fs.createWriteStream(
        path.resolve(this.BASE_LOGS_PATH, "debug.stream.out"),
      ),
    },
    {
      level: "trace",
      stream: fs.createWriteStream(
        path.resolve(this.BASE_LOGS_PATH, "trace.stream.out"),
      ),
    },
  ];

  private constructor(childLogger?: any) {
    this.logger =
      childLogger ?? pino({ level: "trace" }, pino.multistream(this.streams));
  }

  static getInstance(filePath: string): pino.Logger {
    const fileName = path.basename(filePath);
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance.createChildLogger(fileName);
  }

  public createChildLogger(module: string): pino.Logger {
    return this.logger.child({ module });
  }
}
