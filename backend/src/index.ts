import { setupServer } from "./server";
import { initMongoConnection } from "./db/initMongoConnection";
import http from "http";
import { env } from "./utils/env";
import { initSocket } from "./utils/socket";
import logger from "./utils/logger";

const PORT = env("PORT", "5000");

const bootstrap = async () => {
  await initMongoConnection();

  const app = setupServer();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
};

bootstrap();
