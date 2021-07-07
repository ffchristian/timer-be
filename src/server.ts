import * as os from "os";
import { HealthCheckApi } from "./app/api/healthCheck";
import { TimerApi } from "./app/api/timer";
import { ApiServer } from "./infrastructure/ApiServer";
import { IInitializable } from "./infrastructure/IInitializable";
import timerRoomInstance from "./app/api/timerRoom";

const servers: IInitializable[] = new Array<IInitializable>();
const apiPrefix = "/api";
servers.push(new ApiServer([
  new HealthCheckApi(apiPrefix),
  new TimerApi(apiPrefix),
  timerRoomInstance
]));

const initAll = async (server: IInitializable) => {
  console.log("%s Inicializando...", server.name);
  await server.Initialize();
  console.log("%s inicializado!", server.name);
};

servers.forEach(initAll);

console.log(`Debugging a TypeScript NodeJS@${process.version} API on ${os.hostname()} (${process.platform}/${process.arch})`);
