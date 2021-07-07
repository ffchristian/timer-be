import * as restify from "restify";
import Timer from "./../timer/timer.model";
export class HealthCheckController {
  public async index(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const timer = await Timer.findCurrentTotal();
      res.send([
        { name: "api", status: "ok" },
        { name: "mongodb", currentCount: new Date( timer.totalAcum * 1000).toISOString().substr(11, 8) },
      ]);
    } catch (error) {
      res.send(400, {message: error.message});
    }
    return next();
  }
}
