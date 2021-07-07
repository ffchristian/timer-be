import * as restify from "restify";
import { IApiController } from "./../app/apicontrollers/IApiController";
import { IInitializable } from "./IInitializable";
import * as CorsMiddleware from "restify-cors-middleware2";

export class ApiServer implements IInitializable {

  public name: string = "ApiServer";

  public restifyServer?: restify.Server;

  constructor(public apiControllers: IApiController[]) { }

  public Initialize(): Promise<any> {
    this.restifyServer = restify.createServer();

    const cors =  CorsMiddleware({
      preflightMaxAge: 5,
      origins: ["*"],
      allowHeaders: ["*"],
      exposeHeaders: []
    });

    this.restifyServer.pre(cors.preflight);
    this.restifyServer.use(cors.actual);
    this.restifyServer.use(restify.plugins.queryParser());
    this.restifyServer.use(restify.plugins.bodyParser());

    this.apiControllers.forEach((apiController) => {
      if (this.restifyServer !== undefined) {
        apiController.register(this.restifyServer);
      }
    });

    console.log("rest server starting...");

    return new Promise((resolve, reject) => {
      if (this.restifyServer !== undefined) {
        this.restifyServer.listen(process.env.API_PORT, () => {
          if (this.restifyServer !== undefined) {
            console.log("%s is online on %s", this.restifyServer.name, this.restifyServer.url);
          }
          resolve(true);
        });
      }

    });
  }

}
