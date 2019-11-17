const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on(
    "message",
    toJson(
      message => {
        const {
          type,
          data: { username }
        } = message;
        switch (type) {
          case "register_client":
            ws.type = "client";
            ws.username = username;
            clients = { ...clients, [username]: { username, ws } };
            ws.send(
              JSON.stringify({
                servers: parseServers(),
                type: "servers"
              })
            );
            break;
          case "register_server": {
            ws.type = "server";
            ws.username = username;
            servers = { ...servers, [username]: { username } };
            const formatedServers = parseServers();
            Object.values(clients).forEach(cws => {
              cws.ws.send(
                JSON.stringify({
                  servers: formatedServers,
                  type: "servers"
                })
              );
            });
            break;
          }
          default:
            break;
        }
      },
      error => {
        console.error(error);
      }
    )
  );

  //send immediatly a feedback to the incoming connection
  ws.send(
    JSON.stringify({
      servers: parseServers(),
      type: "servers"
    })
  );
});

setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping(null);
  });
}, 1000);
