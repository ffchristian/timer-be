import * as restify from "restify";
import { IApiController } from "../IApiController";
import { HealthCheckController } from "./timer.controller";

export class TimerApi implements IApiController {
  private endpoint = "timer";
  constructor(private apiPrefix: string) {
    this.apiPrefix = apiPrefix;
  }
  public register(server: restify.Server): void {
    const healthCheckController = new HealthCheckController();

    server.get(`${this.apiPrefix}/${this.endpoint}/current`, async (req, res, next) => await healthCheckController.total(req, res, next));
    server.post(`${this.apiPrefix}/${this.endpoint}/`, async (req, res, next) => await healthCheckController.updateCount(req, res, next));

  }
}