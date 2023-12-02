const Hapi = require("@hapi/hapi");
const routes = require("./routes");
require('dotenv').config();

const port = process.env.PORT || 9000;

const init = async () => {
  const server = Hapi.server({
    port: defaultPort,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
