import { Collection, Db, MongoClient } from "mongodb";
import * as restify from "restify";
import { DataProcess } from "../../data/DataProcess";

export class HealthCheckController {
  public async index(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      // TEST DB
      const data = new DataProcess("db_feed");
      await data.connect();
      if (data.database !== undefined) {
        const collection: Collection = await data.database.collection("timeline");
        const result: any[] = await collection.find({}).toArray();

        res.send([
          { name: "api", status: "ok" },
          { name: "mongodb", status: result.length > 0 ? "ok" : "no-data" },
        ]);
      }
      res.send(400, "Database not reacheble!");
    } catch (error) {
      res.send(400, error);
    }
    return next();
  }
}
