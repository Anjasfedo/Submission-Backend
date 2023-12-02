// Importing Hapi module and route configuration from routes.js
const Hapi = require("@hapi/hapi");
const routes = require("./routes");

// Function for initializing the server
const init = async () => {
  // Hapi server configuration
  const server = Hapi.server({
    port: 9000, // Server port
    host: "localhost", // Server host
    routes: {
      cors: {
        origin: ["*"], // CORS configuration, allowing access from any origin
      },
    },
  });

  // Setting the routes defined in the routes.js file
  server.route(routes);

  // Starting the server
  await server.start();
  console.log(`Server is running at ${server.info.uri}`);
};

// Executing the initialization function
init();
