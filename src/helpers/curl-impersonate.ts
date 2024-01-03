import { exec } from "child_process";
import { Logger } from "./logger";

export class CurlImpersonate {
  private readonly proxyString: string;
  private readonly logger = new Logger(__filename);

  constructor(proxy?: string) {
    this.proxyString = proxy ? `-x "${proxy}"` : "";
  }

  private executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.logger.info(`Executing command: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({ error: true, message: error.message });
          return;
        }

        resolve(stdout);
      });
    });
  }

  private formatCurlParams(params: Record<string, string>): string {
    return Object.entries(params)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(" ");
  }

  public get(
    url: string,
    headers: Record<string, string> = {},
    queryParams: Record<string, string> = {},
  ): Promise<string> {
    const headerString = this.formatCurlParams(headers);
    const queryString = new URLSearchParams(queryParams).toString();
    const command = `curl_chrome110 ${this.proxyString} ${headerString} "${url}?${queryString}"`;

    return this.executeCommand(command);
  }

  public post(
    url: string,
    body: Record<string, any>,
    headers: Record<string, string> = {},
  ): Promise<string> {
    const headerString = this.formatCurlParams(headers);
    const bodyString = JSON.stringify(body);
    const command = `${process.env.CURL_PROCESS} --location "${url}" ${this.proxyString} ${headerString} --data '${bodyString}'`;

    return this.executeCommand(command);
  }
}
