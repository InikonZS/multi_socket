import { Server } from "http";
import { connection, IUtf8Message, request } from "websocket";
import { ITypedMessage } from "../../dto/ITypedMessage";

const websocket = require("websocket");

export class ServerSocket {
    constructor(server: Server) {
        const wsServer = new websocket.server({
            httpServer: server,
        });

        wsServer.on("request", (request: request) => {
            const _connection = request.accept(undefined, request.origin);
            _connection.on("message", (_message) => {
                if (_message.type === "utf8") {
                    const message = _message as IUtf8Message;
                    const msg: ITypedMessage = JSON.parse(message.utf8Data);
                    console.log(msg);
                }
            })
        });
    }
}