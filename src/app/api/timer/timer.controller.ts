import * as restify from "restify";
import Timer from "./timer.model";
import timerRoomInstance from "./../timerRoom";

export class HealthCheckController {
  public async total(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const curentTime = timerRoomInstance.getCurrentTime();
      return res.send(200, {curentTime});
    } catch (error) {
      res.send(500, {message: error.message});
    }
    return next();
  }
  public async totalOpts(req: restify.Request, res: restify.Response, next: restify.Next) {
    res.send(200, {
      methodsAllowed: "GET",
      description: "this endpoint is meant to get the latest value of the counter"
    });
    return next();
  }

  public async updateCount(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      if (!req.body || !req.body.time) {
        throw {message: "time in seconds expected on the body", statuCode: 400 };
      }
      const timeReceived = req.body.time;
      const curentTime = timerRoomInstance.updateCurrentTime(timeReceived);
      const timer = new Timer({ipAdress: req.socket.remoteAddress, addedTimeInSeconds: timeReceived, totalAcum: curentTime});
      await timer.save();
      return res.send(200, {curentTime});
    } catch (error) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }
  public async updateCountOpts(req: restify.Request, res: restify.Response, next: restify.Next) {
    res.send(200, {
      methodsAllowed: "POST",
      description: "this endpoint is meant to increase and update the time counter",
      body: [
        {
          field: "time",
          type: "number",
          mandatory: true
        }
      ]
    });
    return next();
  }
  public async resetCount(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const password = req.body.password;
      if (!password || password !== process.env.RESET_PASSWORD || req.headers["secret-header"] !== process.env.RESET_HEADER_VALUE) {
        return res.send(401, {message: "unauthorized"});
      }
      timerRoomInstance.resetCurrentTime();
      const timer = new Timer({ipAdress: `${req.socket.remoteAddress}-RESET`, addedTimeInSeconds: 0, totalAcum: 0});
      await timer.save();
      return res.send(200, {curentTime: 0});
    } catch (error) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }
  public async resetCountOpts(req: restify.Request, res: restify.Response, next: restify.Next) {
    res.send(200, {
      methodsAllowed: "PUT",
      description: "this endpoint is meant to reset and update the time counter to 0 ",
      body: [
        {
          field: "password",
          type: "number",
          mandatory: true
        }
      ]
    });
    return next();
  }
}
