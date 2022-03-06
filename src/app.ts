import express from "express";
import config from "config";
import log from "./logger";
import connect from "./db/connect";
import createServer from "./utils/server";
import swaggerDocs from "./utils/swagger";

const port = config.get<number>("port");
const host = config.get<string>("host");




const app = createServer();

app.listen(port, host, async () => {
  log.info(`Server listing at http://${host}:${port}`);
    

  await connect();

  swaggerDocs(app, port);
});