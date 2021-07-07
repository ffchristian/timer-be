import * as os from "os";
import { HealthCheckApi } from "./app/apicontrollers/healthCheck";
import { ApiServer } from "./infrastructure/ApiServer";
import { IInitializable } from "./infrastructure/IInitializable";

const servers: IInitializable[] = new Array<IInitializable>();
const apiPrefix = "/api";
servers.push(new ApiServer([
  new HealthCheckApi(apiPrefix),
]));

const initAll = async (server: IInitializable) => {
  console.log("%s Inicializando...", server.name);
  await server.Initialize();
  console.log("%s inicializado!", server.name);
};

servers.forEach(initAll);

setInterval(() => {

  console.log(`Debugging a TypeScript NodeJS@${process.version} API on ${os.hostname()} (${process.platform}/${process.arch})`);

}, 3000);
